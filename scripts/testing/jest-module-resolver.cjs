const path = require('path');
const basePath = path.resolve(__dirname, '../../');

/** @type {(path: string, options: import('./resolver-options').ResolverOptions) => string} */
module.exports = (modulePath, options) => {
    let newPath = modulePath;
    let newOptions = options;

    /** 
     * Resolve the path relative to the base directory. 
     * In this case, the base directory in the options is the folder in which
     * the module we are currently resolving is located.
     */
    const resolvedPath = path.resolve(options.basedir, modulePath);

    /** Special case: transform the internal module specifier. */
    if (modulePath === 'internal:typedi') {
        modulePath = path.resolve(basePath, './src/index.mts');
    } else if (modulePath.startsWith('internal:typedi')) {
        modulePath = path.resolve(basePath, './src/', modulePath);
    }

    /** Only change resolution logic for our modules. */
    if (resolvedPath.startsWith(basePath) && !resolvedPath.includes('node_modules')) {
        /** Transform `.mjs` modules to `.mts`. */
        if (modulePath.endsWith('.mjs')) {
            newPath = modulePath.replace('.mjs', '.mts');
        }
    }

    return options.defaultResolver(newPath, newOptions);
}
