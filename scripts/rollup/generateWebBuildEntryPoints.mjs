// @ts-check

import FS from 'fs';
import AsyncFS from 'fs/promises';
import Url from 'url';
import Path from 'path';
import Rt from 'runtypes';
import camelcase from 'camelcase';

import { assertUnreachable } from '../utils/assertUnreachable.mjs';
import { createUuidIterator } from '../utils/uuid.mjs';

export const BarrelConfiguration = Rt.Record({
  // The directory to scan for modules.
  inputDirectory: Rt.String,

  // An array of possible entry-point file-names.
  entryPointFileNames: Rt.Array(Rt.String),

  packagesToExport: Rt.Union(
    // All packages are exported.
    Rt.Literal('all'),

    // Only the specified packages are exported.
    Rt.Array(Rt.String)
  ),
  generatedImports: Rt.Record({
    // The import prefix to use when generating imports for contributory packages.
    importPrefix: Rt.Union(Rt.String),
  }),

  // A map of overrides for certain package names.
  packageNameOverrides: Rt.Optional(Rt.Dictionary(Rt.String, Rt.String)),

  // A string to prepend the barrel file with.
  preamble: Rt.Optional(Rt.String),
});

let GENERATED_EXPORT_UUID_ITERATOR = createUuidIterator();
const GENERATED_EXPORT_PREFIX = 'GeneratedWebEntryPointExport$';

/**
 * Get a list of all packages in the specified directory.
 * Packages are expected in folder form.
 *
 * The returned list of packages is not checked for missing entry-points.
 *
 * @param {Rt.Static<typeof BarrelConfiguration>} barrelConfig - The barrel configuration to check.
 */
export async function* findPackagesInDirectory(barrelConfig) {
  const { inputDirectory } = barrelConfig;
  const dir = await AsyncFS.readdir(inputDirectory);

  for (const entry of dir) {
    const fullPath = Path.resolve(inputDirectory, entry);
    const stat = await AsyncFS.stat(fullPath);
    const isDirectory = stat.isDirectory();
    const isValidEntry = isDirectory;

    if (isValidEntry) {
      yield entry;
    } else {
      console.warn(
        [`An invalid contributory package was encountered: "${entry}".`, `A directory was expected.`].join('\n')
      );
    }
  }
}

/**
 * Get a list of all contributory packages.
 *
 * Like {@link findPackagesInDirectory}, but the returned packages are checked
 * for missing entry-points.
 *
 * @param {Rt.Static<typeof BarrelConfiguration>} barrelConfig - The barrel configuration to check.
 *
 * @returns {Promise<{ [k: string]: string }>} A mapping of contributory package names to
 * their respective entry-points.  The entry-point file names are named as they appear in
 * the file system.
 */
export async function findPackagesWithEntryPointsInDirectory(barrelConfig) {
  const { inputDirectory } = barrelConfig;

  const packages = findPackagesInDirectory(barrelConfig);
  let map = Object.create(null);

  for await (const packageName of packages) {
    const entryPoint = getEntryPointForContribPackage(packageName, barrelConfig);
    map = { ...map, [packageName]: entryPoint };
  }

  return map;
}

/**
 * Determine the entry-point of a given contributory package.
 * The existence of files is checked synchronously.
 *
 * @param {string} contribPackageName - The name of the contributory package to check.
 * @param {Rt.Static<typeof BarrelConfiguration>} barrelConfig - The barrel configuration to check.
 */
export function getEntryPointForContribPackage(contribPackageName, barrelConfig) {
  const { inputDirectory, entryPointFileNames } = barrelConfig;
  const fullPackagePath = Path.resolve(inputDirectory, contribPackageName);

  const matches = entryPointFileNames.filter(possibleEntryPointFileName => {
    const fullEntryPointFileName = Path.resolve(fullPackagePath, possibleEntryPointFileName);
    return FS.existsSync(fullEntryPointFileName);
  });

  if (matches.length === 0) {
    assertUnreachable(
      [
        `A valid entry-point for the "${contribPackageName}" contributory package could not be found.`,
        'The following entry-point file-names are supported:',
        ...entryPointFileNames.map(x => `  - ${x}`),
      ].join('\n')
    );
  }

  if (matches.length > 1) {
    assertUnreachable(
      [
        `Multiple entry-points for the "${contribPackageName}" contributory package were encountered:`,
        ...matches.map(x => `  - ${x}`),
      ].join('\n')
    );
  }

  return matches[0];
}

/**
 * Resolve a file-name to its equivalent import file-name in TypeScript.
 * For instance, `.mts` files must be reference as `.mjs` files.
 *
 * @param {string} fileName - The file-name to transform.
 * @param {string} contribPackageName - The name of the contributory package
 * currently being resolved.
 */
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

/**
 * Like {@link findPackagesWithEntryPointsInDirectory}, but with the entry-point names transformed
 * to import specifiers via {@link resolveEntryPointNameToImportName}.
 *
 * @param {Rt.Static<typeof BarrelConfiguration>} barrelConfig - The barrel configuration to check.
 *
 * @returns {Promise<{ [k: string]: string }>} A mapping of contributory package names to their
 * respective entry-points as valid import specifiers.
 */
export async function getPackagesInDirectoryAsImportSpecifiers(barrelConfig) {
  const packagesWithEntryPoints = await findPackagesWithEntryPointsInDirectory(barrelConfig);

  return Object.entries(packagesWithEntryPoints).reduce((map, [packageName, entryPoint]) => {
    const importName = resolveEntryPointNameToImportName(entryPoint, packageName);
    return { ...map, [packageName]: importName };
  }, Object.create(null));
}

/**
 * Create a barrel file for the provided contributory packages.
 *
 * @param {Rt.Static<typeof BarrelConfiguration>} barrelConfig - The barrel configuration to use.
 */
export async function createBarrelAsString(barrelConfig) {
  const allPackagesWithImports = await getPackagesInDirectoryAsImportSpecifiers(barrelConfig);

  // All generated imports must be prefixed with the import prefix specified.
  // We do this because we can substitute this for "@internal:contrib" in the build
  // stage; this means this script does not have to generate relative paths.
  const { importPrefix } = barrelConfig.generatedImports;
  const { preamble } = barrelConfig;

  return Object.entries(allPackagesWithImports)
    .filter(([packageName]) => !doesBarrelConfigExcludePackageName(barrelConfig, packageName))
    .reduce((generatedBarrelFile, [packageName, importName]) => {
      const resolvedPath = `${importPrefix}/${packageName}/${importName}`;

      // Convert the directory name to PascalCase, e.g. transient-ref -> TransientRef.
      const reexportName = getExportNameForPackage(packageName, barrelConfig);

      return generatedBarrelFile + generateBarrelReexportForPath(resolvedPath, reexportName);
    }, preamble ?? '');
}

/**
 * Transform the specified package name into one suitable for exporting.
 * For instance, `transient-ref` would be transformed to `TransientRef`.
 *
 * @param {string} packageName - The package name to transform.
 * @param {Rt.Static<typeof BarrelConfiguration>} barrelConfig - The barrel configuration to check.
 *
 * @returns { string } The transformed package name.
 */
function getExportNameForPackage(packageName, barrelConfig) {
  const { packageNameOverrides } = barrelConfig;
  return packageNameOverrides?.[packageName] ?? camelcase(packageName, { pascalCase: true });
}

/**
 * Generate a JavaScript snippet containing a star import from the given import specifier,
 * which is then immediately re-exported as the provided export name.
 *
 * @remarks
 * The syntax of the emitted JavaScript is not checked.
 *
 * @param {string} path - The import specifier to re-export.
 * @param {string} exportName - The name to re-export all exports as.
 */
function generateBarrelReexportForPath(path, exportName) {
  const baseId = generateUuidForExport();
  const fullId = `_${exportName}${baseId}`;

  return `
import * as ${fullId} from "${path}";
export { ${fullId} as ${exportName} };`;
}

/** Generate a UUID for a re-export. */
function generateUuidForExport() {
  // e.g. GeneratedWebEntryPointExport$1
  return `${GENERATED_EXPORT_PREFIX}${GENERATED_EXPORT_UUID_ITERATOR.next().value}`;
}

/**
 * Write a barrel file following the provided configuration to the specified output path.
 *
 * @param {Rt.Static<typeof BarrelConfiguration>} barrelConfig - The configuration to use to generate the barrel.
 * @param {string} outputPath - The path to output the barrel file to.
 */
export async function writeBarrelFileForConfig(barrelConfig, outputPath) {
  const barrelFile = await createBarrelAsString(barrelConfig);
  return AsyncFS.writeFile(outputPath, barrelFile);
}

/**
 * Determine whether a given barrel configuration excludes a certain package from being exported.
 *
 * @param {Rt.Static<typeof BarrelConfiguration>} barrelConfig
 * @param {string} packageName - The name of the package to test.
 *
 * @returns {boolean} Whether the package is excluded.
 */
function doesBarrelConfigExcludePackageName(barrelConfig, packageName) {
  const { packagesToExport } = barrelConfig;

  if (packagesToExport === 'all') {
    return false;
  }

  return packagesToExport.some(exportedPackage => exportedPackage === packageName);
}
