import { config } from 'dotenv';
import { resolve as resolvePath } from 'node:path';
import assert from 'node:assert';
import { $ } from 'execa';

/** Load variables from the .env file into `process.env`. */
config({
    path: resolvePath(__dirname, '../.env')
});

/**
 * Pipe the stderr and stdout of an execa child process to this process' streams.
 * 
 * @param {import('execa').ExecaChildProcess} childProcess The script to act upon.
 * @param {boolean} interactive Whether stdin is also forwarded.
 */
function pipeChildProcessIO (childProcess, interactive) {
    const { stdout, stderr, stdin } = childProcess;

    stdout.pipe(process.stdout);
    stderr.pipe(process.stderr);
    
    if (interactive) {
        stdin.pipe(process.stdin);
    }
}

/**
 * Get an environmental variable from `process.env`.
 * 
 * @param {string} name The name of the variable.
 * @param {boolean} ensureExists Whether to assert the presence of the variable.
 */
function getEnvironmentalVariable (name, ensureExists = true) {
    const value = process.env[name];

    if (ensureExists) {
        assert(value, `The ${name} environmental variable is required.`);
    }

    return value;
}

const gitUser = getEnvironmentalVariable('DOCUSAURUS_GIT_USER', true);
const gitPass = getEnvironmentalVariable('DOCUSAURUS_GIT_PASS', true);

// TODO: check for any dirty / staged git files?

const deployScript = $({
    env: {
        GIT_USER: gitUser,
        GIT_PASS: gitPass
    }
})`npm run docs:website`;

/** Pipe the deploy script's std[in,out,err] to this process'. */
pipeChildProcessIO(deployScript);

