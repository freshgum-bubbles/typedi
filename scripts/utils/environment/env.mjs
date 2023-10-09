// @ts-check
import { config } from 'dotenv';
import { resolve as resolvePath, dirname as pathToDirname } from 'node:path';
import assert from 'node:assert';
import { existsSync as fileExists } from 'fs';
import { fileURLToPath } from 'node:url';

/** Get a reference to the current directory (in this case /scripts/util/). */
const directoryName = pathToDirname(fileURLToPath(import.meta.url));
const dotenvFilePath = resolvePath(directoryName, '../../../.env');

/** Present a nicely-formatted error message to the user if .env is missing to reduce confusion. */
const ENV_FILE_MISSING_ERROR_MESSAGE = [
  'This script requires the presence of a .env file, which is currently not present.',
  'Please rename the .env.template file to .env, populate any required values, and retry this operation.',
].join('\n');

export function installEnvironment() {
  assert(fileExists(dotenvFilePath), ENV_FILE_MISSING_ERROR_MESSAGE);

  /** Load variables from the .env file into `process.env`. */
  config({ path: dotenvFilePath });
}
