// @ts-check

import { config } from 'dotenv';
import { resolve as resolvePath, dirname } from 'node:path';
import assert from 'node:assert';
import { $ } from 'execa';
import { fileURLToPath } from 'node:url';

const scriptsDirectory = dirname(fileURLToPath(import.meta.url));
const dotenvFilePath = resolvePath(scriptsDirectory, '../.env');
const docsDirectoryPath = resolvePath(scriptsDirectory, '../docs/');

/** Load variables from the .env file into `process.env`. */
config({ path: dotenvFilePath });

/**
 * Pipe the stderr and stdout of an execa child process to this process' streams.
 * 
 * @param {import('execa').ExecaChildProcess} childProcess The script to act upon.
 * @param {boolean} interactive Whether stdin is also forwarded.
 */
function pipeChildProcessIO (childProcess, interactive = false) {
    const { stdout, stderr, stdin } = childProcess;

    stdout?.pipe(process.stdout);
    stderr?.pipe(process.stderr);
    
    if (interactive) {
        stdin?.pipe(process.stdin);
    }
}

/**
 * Monitor the exit code of a child.
 * 
 * @param {import('execa').ExecaChildProcess} childProcess The script to act upon.
 * @param {boolean} exitOnError If the child exits with an error code, this process is terminated
 * with the exit code of the child.
 */
async function monitorChildProcessExitCode (childProcess, exitOnError = true) {
    const { exitCode } = await childProcess;
    const failed = exitCode > 0;

    if (failed && exitOnError) {
        process.exit(exitCode);
    }

    return failed;
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

await buildAPIReference();
await buildDocs();
await deployDocs();

async function deployDocs() {
    const deployDocsCommand = $({
        env: {
            GIT_USER: gitUser,
            GIT_PASS: gitPass
        },

        /** Run in docs/. Alternative to `pushd` which isn't cross-platform. */
        cwd: docsDirectoryPath
    })`npm run deploy`;

    /** Docusaurus' deploy script *might* need stdin input; not 100% sure whether this is needed. */
    pipeChildProcessIO(deployDocsCommand, true);

    await monitorChildProcessExitCode(deployDocsCommand);
}

async function buildDocs() {
    const startDocsBuildCommand = $({
        /** Run in docs/. Alternative to `pushd` which isn't cross-platform. */
        cwd: docsDirectoryPath
    })`npm run build`;

    /** Pipe the deploy script's std[in,out,err] to this process'. */
    pipeChildProcessIO(startDocsBuildCommand);

    await monitorChildProcessExitCode(startDocsBuildCommand);
}

async function buildAPIReference() {
    const buildApiReferenceCommand = $`npm run docs:api-reference`;
    pipeChildProcessIO(buildApiReferenceCommand);

    /** Let TypeDoc move its files into docs/static before running Docusaurus. */
    await monitorChildProcessExitCode(buildApiReferenceCommand);
}

