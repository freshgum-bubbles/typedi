import { config } from 'dotenv';
import { resolve as resolvePath } from 'node:path';
import { execa } from 'execa';

/** Load variables from the .env file into `process.env`. */
config({
    path: resolvePath(__dirname, '../.env')
});
