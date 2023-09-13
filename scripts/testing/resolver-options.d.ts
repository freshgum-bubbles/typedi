import { PackageJson } from 'type-fest';

/** Copied from <https://jestjs.io/docs/configuration#resolver-string> */
export type ResolverOptions = {
  /** Directory to begin resolving from. */
  basedir: string;
  /** List of export conditions. */
  conditions?: Array<string>;
  /** Instance of default resolver. */
  defaultResolver: (path: string, options: ResolverOptions) => string;
  /** List of file extensions to search in order. */
  extensions?: Array<string>;
  /** List of directory names to be looked up for modules recursively. */
  moduleDirectory?: Array<string>;
  /** List of `require.paths` to use if nothing is found in `node_modules`. */
  paths?: Array<string>;
  /** Allows transforming parsed `package.json` contents. */
  packageFilter?: (pkg: PackageJson, file: string, dir: string) => PackageJson;
  /** Allows transforms a path within a package. */
  pathFilter?: (pkg: PackageJson, path: string, relativePath: string) => string;
  /** Current root directory. */
  rootDir?: string;
};
