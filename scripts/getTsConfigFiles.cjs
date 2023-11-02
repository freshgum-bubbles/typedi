/* eslint-disable @typescript-eslint/no-var-requires */
// @ts-check

const path = require('path');

const TYPESCRIPT_CONFIGURATIONS = {
  /** @deprecated */
  ProductionCommonJS: getAbsoluteFilename('./tsconfig/tsconfig.prod.cjs.json'),

  ProductionESM5: getAbsoluteFilename('./tsconfig/tsconfig.prod.esm5.json'),
  Production: getAbsoluteFilename('./tsconfig/tsconfig.prod.json'),
  ProductionTypes: getAbsoluteFilename('./tsconfig/tsconfig.prod.types.json'),

  /** Used for testing the package via Jest. */
  Spec: getAbsoluteFilename('./tsconfig/tsconfig.spec.json'),

  /** Used for generating API documentation with TypeDoc. */
  TypeDoc: getAbsoluteFilename('./tsconfig/tsconfig.typedoc.json'),
};

/**
 * Get an absolute path for the specified file name.
 * @param {string} fileName - The file name to process.
 */
function getAbsoluteFilename(fileName) {
  return path.resolve(__dirname, fileName);
}

module.exports = { TYPESCRIPT_CONFIGURATIONS };
