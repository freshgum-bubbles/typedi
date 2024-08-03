import Path from 'path';
import Url from 'url';
import * as WebEntryPointCreator from './generateWebBuildEntryPoints.mjs';

import { RollupOptions, OutputOptions, ModuleFormat } from 'rollup';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import terser, { Options as TerserOptions } from '@rollup/plugin-terser';
import alias from '@rollup/plugin-alias';
import virtual from '@rollup/plugin-virtual';

import merge from 'deepmerge';
import { compose, pipeInto } from 'ts-functional-pipe';

/**
 * Resolve a path from the current directory, or {@link __dirname}.
 * @param path - The path to resolve.
 */
const resolvePathFromCurrentDir = (path: string) => Path.resolve(__dirname, path);

// All hail Node.
const __dirname = Path.dirname(Url.fileURLToPath(import.meta.url));

const UMD_NAME = 'TypeDI';
const UMD_BUNDLE_PATH = 'build/bundles/typedi.umd.js';
const UMD_MIN_BUNDLE_PATH = 'build/bundles/typedi.umd.min.js';
const MJS_BUNDLE_PATH = 'build/bundles/typedi.mjs';
const MJS_MIN_BUNDLE_PATH = 'build/bundles/typedi.min.mjs';

const UMD_FULL_BUNDLE_PATH = 'build/bundles/typedi.umd.full.js';
const UMD_FULL_MIN_BUNDLE_PATH = 'build/bundles/typedi.umd.full.min.js';

const MJS_FULL_BUNDLE_PATH = 'build/bundles/typedi.full.mjs';
const MJS_FULL_MIN_BUNDLE_PATH = 'build/bundles/typedi.full.min.mjs';

// See below for information on tiny builds.
const MJS_TINY_BUNDLE_PATH = 'build/bundles/typedi.tiny.min.mjs';

/**
 * A list of properties in the codebase to mangle.
 * In this case, "mangling" refers to the minification of the names in the final bundle.
 * Note that this only affects minified builds (ending in `.min.js`).
 *
 * The addition of members to this array should be done very cautiously.
 *
 * __WARNING: DO NOT ADD ANY MEMBERS OF PUBLICLY-EXPORTED CLASSES / OBJECTS HERE.__
 *
 * A special exception is made for `ContainerInstance.throwIfDisposed`, which is
 * marked as private and can easily be replicated.
 */
const SAFE_PROPERTIES_TO_MANGLE = [
  // ContainerInstance
  'throwIfDisposed',

  //VisitorCollection
  'notifyChildContainerVisited',
  'notifyChildContainerVisited',
  'notifyOrphanedContainerVisited',
  'notifyNewServiceVisited',
  'notifyRetrievalVisited',
  'notifyVisitors',
  'forwardOrphanedContainerEvents',
  'anyVisitorsPresent',
  'forEachVisitor',
  'addVisitorToCollection',
  'removeVisitorFromCollection',
] as const;

/**
 * A list of properties in the codebase to mangle.
 *
 * Unlike `SAFE_PROPERTIES_TO_MANGLE`, this list contains publicly-exposed members.
 * This list may be useful in the case of `umd.js` builds, where consumers
 * require the absolute bare minimum file size, at the expense of being able to
 * (safely & deterministically) access well-known public / private class members.
 *
 * **This is not currently used.**
 */
const UNSAFE_PROPERTIES_TO_MANGLE = [
  // ContainerInstance
  'getServiceValue',
  'disposeServiceInstance',
  'getOrDefault',
  'getManyOrDefault',
  'resolveMetadata',
  'getIdentifierLocation',
  'resolveConstrainedIdentifier',
  'resolveMultiID',
  'multiServiceIds',
  'metadataMap',
  'resolveTypeWrapper',
  'isRetrievingPrivateToken',
  'getConstructorParameters',
  'resolveResolvable',
  'visitor',

  // ManyServicesMetadata
  'tokens',

  // TypeWrapper
  'extract',
  'lazyType',
  'eagerType',

  // ContainerRegistry
  'registerContainer',
  'hasContainer',
  'getContainer',
  'removeContainer',
  'containerMap',

  // Errors
  'normalizedIdentifier',
  'footer',
] as const;

const PROPERTIES_TO_MANGLE_FOR_TINY_BUILDS = [...SAFE_PROPERTIES_TO_MANGLE, ...UNSAFE_PROPERTIES_TO_MANGLE];

const TERSER_OPTIONS: TerserOptions = {
  parse: {
    html5_comments: false,
    shebang: false,
  },
  compress: {
    defaults: true,
    keep_fargs: false,
    passes: 5,

    // Unsafe transformations.
    // Be careful when changing these!
    unsafe: true,

    // Remove names from Symbol() expressions.
    unsafe_symbols: true,

    // Transform regular functions to arrow functions in select circumstances.
    unsafe_arrows: true,

    // Transform { m: function () { } } to { m() { } }.
    // We don't strictly need this, as we never use functions as properties,
    // but it may be useful in future.
    unsafe_methods: true,

    // Disable unsafe comparisons, as it may cause issues.
    unsafe_comps: false,
    hoist_funs: true,
    pure_getters: true,
  },
  format: {
    ecma: 2020,

    // We won't need IE8 where we're going.
    ie8: false,
    comments: false,
    wrap_func_args: false,
  },
  mangle: {
    // Disable any support for Safari 10.
    // It's a deprecated version, and we only target evergreen browsers.
    safari10: false,
    properties: {
      // For ordinary .min.js builds, we ALWAYS use the safe list of properties to mangle.
      // The unsafe lists may cause a few issues with those who need to access private
      // Container API's.
      regex: new RegExp(SAFE_PROPERTIES_TO_MANGLE.join('|')),
    },
  },
};

/** A partial set of options for all Rollup output declarations. */
const DEFAULT_ROLLUP_OUTPUT_OPTIONS: OutputOptions = {
  sourcemap: true,
};

/** A set of Terser options for ES6 builds of TypeDI. */
const MJS_TERSER_OPTIONS: TerserOptions = merge(TERSER_OPTIONS, {
  compress: {
    module: true,
  },
});

/** A set of Terser options for tiny builds of TypeDI. */
const TINY_TERSER_OPTIONS: TerserOptions = merge(TERSER_OPTIONS, {
  mangle: {
    properties: {
      regex: new RegExp(PROPERTIES_TO_MANGLE_FOR_TINY_BUILDS.join('|')),
    },
  },
});

/** A set of Terser options for tiny.mjs builds of TypeDI. */
const MJS_TINY_TERSER_OPTIONS: TerserOptions = merge(TINY_TERSER_OPTIONS, {
  compress: {
    module: true,
  },
});

/** The prefix used when referencing files in the contrib/ directory. */
const CONTRIB_IMPORT_PREFIX = 'internal:contrib';
const CONTRIB_DIR_PATH = resolvePathFromCurrentDir('../../src/contrib/');

/** The import specifier for the generated contrib/ barrel file. */
const CONTRIB_GENERATED_BARREL_IMPORT = 'internal:web_entry_contrib_barrel_do_not_use';

/** The barrel configuration used for generating web bundle entry points. */
const WEB_ENTRY_BARREL_CONFIG = WebEntryPointCreator.BarrelConfiguration.check({
  inputDirectory: CONTRIB_DIR_PATH,
  entryPointFileNames: ['index.mts'],

  packagesToExport: 'all',
  generatedImports: {
    importPrefix: CONTRIB_IMPORT_PREFIX,
  },

  packageNameOverrides: {
    ES: 'es',
  },

  // Now that I think about it, a preamble isn't really needed anymore as the file is
  // never actually written to disk.  For now, let's keep it anyway though.
  preamble: '/* <!> <!> <!> THIS FILE IS GENERATED.  DO NOT EDIT. <!> <!> <!> */',
});

const ROLLUP_BUNDLE_TSCONFIG_PATH = resolvePathFromCurrentDir('../tsconfig/tsconfig.rollup.json');

/** Interpolate a pre-existing Rollup output options object with further values. */
const mergeOutputOptionsWithDefaults = (options: OutputOptions): OutputOptions =>
  merge(DEFAULT_ROLLUP_OUTPUT_OPTIONS, options);

const createAliasPluginWithDefaults = () =>
  alias({
    // Replace all instances of the contrib import prefix with the contrib/ directory path.
    entries: [{ find: CONTRIB_IMPORT_PREFIX, replacement: CONTRIB_DIR_PATH }],
  });

const createTypeScriptPluginWithDefaults = () => typescript({ tsconfig: ROLLUP_BUNDLE_TSCONFIG_PATH });

/** Interpolate the Rollup output object with the TypeScript plugin. */
const addTypeScriptPluginToOutput = (options: RollupOptions): RollupOptions =>
  merge(options, { plugins: [createTypeScriptPluginWithDefaults()] });

/** Interpolate the Rollup output object with the Alias plugin. */
const addAliasPluginToOptions = (options: RollupOptions): RollupOptions =>
  merge(options, { plugins: [createAliasPluginWithDefaults()] });

const createOutput = compose(mergeOutputOptionsWithDefaults);

/** Interpolate the Rollup output object with the default UMD configuration. */
const createUmdBuild = (options: OutputOptions): OutputOptions => merge({ format: 'umd', name: UMD_NAME }, options);

async function createRollupOptions() {
  // Create the contrib/ barrel file in plaintext.  It is then used as a virtual module.
  const CONTRIB_BARREL = await WebEntryPointCreator.createBarrelAsString(WEB_ENTRY_BARREL_CONFIG);

  // The virtual plugin resolves the import for the contrib/ barrel file (in web.full.mts) to
  // the plaintext barrel file.  This is done so we don't have to save / manage ordinary files
  // (and being careful not to check them into version control / having to un-break TypeScript.)
  const createVirtualPlugin = () => virtual({ [CONTRIB_GENERATED_BARREL_IMPORT]: CONTRIB_BARREL });

  // Other module resolution plugins are kept separate so they can be inserted *after* plugin-virtual.
  // According to <https://github.com/rollup/plugins/tree/master/packages/virtual>, the CommonJS and
  // NodeResolve plugins should come *after* virtual, as they may alter the generated output.
  const addModuleResolutionPluginsToOptions = (options: OutputOptions) =>
    merge(options, { plugins: [commonjs(), nodeResolve()] });

  const addVirtualPluginToOptions = (options: OutputOptions) => merge({ plugins: [createVirtualPlugin()] }, options);
  const addWebPluginsToOptions = compose(addAliasPluginToOptions, addVirtualPluginToOptions);

  // Shorthand for createUmdBuild.  Allows for adding more functions later on.
  const umd = compose(createUmdBuild);

  const options: RollupOptions[] = [
    pipeInto(
      {
        input: './src/index.mts',
        output: (
          [
            umd({ file: UMD_BUNDLE_PATH }),
            umd({ file: UMD_MIN_BUNDLE_PATH, plugins: [terser(TERSER_OPTIONS)] }),
            { format: 'es', file: MJS_BUNDLE_PATH },
            { format: 'es', file: MJS_MIN_BUNDLE_PATH, plugins: [terser(MJS_TERSER_OPTIONS)] },

            // Tiny builds of TypeDI are experimental; they're mostly designed for private use,
            // to investigate ways to optimize the Container architecture.
            // They include minification for more private symbols, which may cause issues for
            // those who require access to private Container API's.
            //
            // They're also only available in ES Modules format (so no UMD variants).
            // Therefore, they're not yet recommended for public consumption.
            { format: 'es', file: MJS_TINY_BUNDLE_PATH, plugins: [terser(MJS_TINY_TERSER_OPTIONS)] },

            // We have to cast each item to OutputOptions[] as TypeScript doesn't agree that the
            // string "es" (in `format`) matches rollup's `ModuleFormat` type. a string literal
            // union literally matching the word "es".  Amazing.
            // TODO: Can we uncurse this?
          ] as OutputOptions[]
        ).map(createOutput),
        plugins: [commonjs(), nodeResolve()],
      },
      addTypeScriptPluginToOutput
    ),
    pipeInto(
      {
        input: './src/entry/web/web.full.mts',
        output: (
          [
            umd({ file: UMD_FULL_BUNDLE_PATH }),
            umd({ file: UMD_FULL_MIN_BUNDLE_PATH, plugins: [terser(TERSER_OPTIONS)] }),
            { format: 'es', file: MJS_FULL_BUNDLE_PATH },
            { format: 'es', file: MJS_FULL_MIN_BUNDLE_PATH, plugins: [terser(MJS_TERSER_OPTIONS)] },
          ] as OutputOptions[]
        ).map(createOutput),
      },
      addTypeScriptPluginToOutput,
      addWebPluginsToOptions,
      addModuleResolutionPluginsToOptions
    ),
  ];

  return options;
}

export default createRollupOptions();
