// @ts-check

import { existsSync, readdirSync, statSync, writeFileSync } from 'fs';
import path, { dirname, resolve } from 'path';
import rt from 'runtypes';
import { assertUnreachable } from '../utils/assertUnreachable.mjs';
import { fileURLToPath } from 'url';
import { createUuidIterator } from '../utils/uuid.mjs';
import camelcase from 'camelcase';

// All hail Node.
const __dirname = dirname(fileURLToPath(import.meta.url));

/** The directory in which web build entry points shall be generated. */
const ENTRY_POINT_DIR = resolve(__dirname, '../../src/entry/web/');

const ENTRY_POINT_CONTRIB_NAME = 'contrib.full.generated.mts';

const GENERATED_CONTRIB_BARREL_PREAMBLE = `
/* <!> THIS FILE IS GENERATED. DO NOT EDIT. <!> */
`;

const CONTRIB_PACKAGE_ENTRY_POINT_FILE_NAMES = ['index.mts'];

/** The directory in which contributory features are located. */
const CONTRIB_DIR = resolve(__dirname, '../../src/contrib/');
const SRC_DIR = resolve(__dirname, '../../src/');

/** A map of overrides for certain contributory package names. */
const PACKAGE_NAME_OVERRIDES = {
  es: 'ES',
};

const BarrelConfiguration = rt.Record({
  baseDir: rt.String,
  exportedPackages: rt.Union(rt.Literal('all'), rt.Array(rt.String)),
  generatedImports: rt.Record({
    importPrefix: rt.Union(rt.String, rt.Literal('@typedi:contrib'))
  })
});

let GENERATED_EXPORT_UUID_ITERATOR = createUuidIterator();
const GENERATED_EXPORT_PREFIX = 'GeneratedWebEntryPointExport$';

function getAllContribPackages() {
  return readdirSync(CONTRIB_DIR).filter(entry => {
    const fullPath = resolve(CONTRIB_DIR, entry);
    const stat = statSync(fullPath);
    const isValidEntry = stat.isDirectory();

    // if (!isValidEntry) {
    //   console.warn([
    //     `An invalid contributory package was encountered: "${entry}"`,
    //     `A directory was expected.`
    //   ].join('\n'));
    // }

    return isValidEntry;
  });
}

function getAllContribPackagesWithEntryPoints() {
  const packages = getAllContribPackages();

  return packages.reduce((map, packageName) => {
    // This function will throw if it can't find an end-point, so this is fine.
    const entryPoint = getEntryPointForContribPackage(packageName);
    return { ...map, [packageName]: entryPoint };
  }, Object.create(null));
}

function getEntryPointForContribPackage(contribPackageName) {
  const fullPackagePath = resolve(CONTRIB_DIR, contribPackageName);
  const matches = CONTRIB_PACKAGE_ENTRY_POINT_FILE_NAMES.filter(possibleEntryPointFileName => {
    const fullEntryPointFileName = resolve(fullPackagePath, possibleEntryPointFileName);
    return existsSync(fullEntryPointFileName);
  });

  if (matches.length === 0) {
    assertUnreachable(
      [
        `A valid entry-point for the "${contribPackageName}" contributory package could not be found.`,
        'The following entry-point file-names are supported:',
        ...CONTRIB_PACKAGE_ENTRY_POINT_FILE_NAMES.map(x => `  - ${x}`),
      ].join('\n')
    );
  }

  if (matches.length > 1) {
    assertUnreachable(
      [
        `Multiple entry-points for the "${contribPackageName}" contributory package were encountered:`,
        matches.join(', '),
      ].join('\n')
    );
  }

  return matches[0];
}

function resolveEntryPointNameToImportName(fileName, contribPackageName) {
  switch (fileName) {
    // As per the local TypeScript config, .mts files must be referenced as .mjs.
    case 'index.mts':
      return 'index.mjs';
    case 'index.ts':
      return 'index.js';
  }

  assertUnreachable(
    `An unexpected entry-point for the "${contribPackageName}" contributory package was encountered: "${fileName}".`
  );
}

function getAllContribPackagesWithImportNames() {
  const packagesWithEntryPoints = getAllContribPackagesWithEntryPoints();

  return Object.entries(packagesWithEntryPoints).reduce((map, [packageName, entryPoint]) => {
    const importName = resolveEntryPointNameToImportName(entryPoint, packageName);
    return { ...map, [packageName]: importName };
  }, Object.create(null));
}

/**
 * Create a barrel file for the provided contributory packages.
 *
 * @param {rt.Static<typeof BarrelConfiguration>} barrelConfig - The barrel configuration to use.
 */
function createBarrelFileForContribImports(barrelConfig) {
  const allPackagesWithImports = getAllContribPackagesWithImportNames();

  // All generated imports must be prefixed with the import prefix specified.
  // We do this because we can substitute this for "@internal:contrib" in the build
  // stage; this means this script does not have to generate relative paths.
  const { importPrefix } = barrelConfig.generatedImports;

  return Object.entries(allPackagesWithImports)
    .filter(([packageName]) => !doesBarrelConfigExcludePackageName(barrelConfig, packageName))
    .reduce((generatedBarrelFile, [packageName, importName]) => {
      const resolvedPath = `${importPrefix}/${packageName}/${importName}`;

      // Convert the directory name to PascalCase, e.g. transient-ref -> TransientRef.
      const reexportName = getExportNameForPackage(packageName);

      return generatedBarrelFile + generateBarrelReexportForPath(resolvedPath, reexportName);
    }, GENERATED_CONTRIB_BARREL_PREAMBLE);
}

function getExportNameForPackage(packageName) {
  return PACKAGE_NAME_OVERRIDES[packageName] ?? camelcase(packageName, { pascalCase: true });
}

function generateBarrelReexportForPath(path, exportName) {
  const baseId = generateUuidForExport();
  const fullId = `_${exportName}${baseId}`;

  return `
import * as ${fullId} from "${path}";
export { ${fullId} as ${exportName} };`;
}

function generateUuidForExport() {
  // e.g. GeneratedWebEntryPointExport$1
  return `${GENERATED_EXPORT_PREFIX}${GENERATED_EXPORT_UUID_ITERATOR.next().value}`;
}

/** @param {rt.Static<typeof BarrelConfiguration>} barrelConfig */
function writeBarrelFileForConfig(barrelConfig, baseOutputPath = null) {
  const outputPath = baseOutputPath ?? path.resolve(ENTRY_POINT_DIR, ENTRY_POINT_CONTRIB_NAME);
  console.log({ outputPath });
  const barrelFile = createBarrelFileForContribImports(barrelConfig);
  writeFileSync(outputPath, barrelFile);
}

/**
 * Determine whether a given barrel configuration excludes a certain package from being exported.
 *
 * @param {rt.Static<typeof BarrelConfiguration>} barrelConfig
 * @param {string} packageName
 * @returns {boolean} Whether the package is excluded.
 */
function doesBarrelConfigExcludePackageName(barrelConfig, packageName) {
  const { exportedPackages } = barrelConfig;

  if (exportedPackages === 'all') {
    return false;
  }

  return exportedPackages.some(exportedPackage => exportedPackage === packageName);
}

writeBarrelFileForConfig({
  baseDir: SRC_DIR,
  exportedPackages: 'all',
  generatedImports: {
    importPrefix: 'internal:contrib'
  }
});
