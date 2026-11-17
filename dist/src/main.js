import * as core from '@actions/core';
import { Config } from '@oclif/core';
import { RequestError as GitHubHttpError } from '@octokit/request-error';
import * as bump from 'bump-cli';
import * as diff from './diff.js';
import { Repo } from './github.js';
export async function run() {
    try {
        const file = core.getInput('file');
        const doc = core.getInput('doc');
        const hub = core.getInput('hub');
        const branch = core.getInput('branch');
        const overlays = core
            .getInput('overlay')
            ?.split(',') // Separate overlay files by comma
            ?.filter((e) => e); // Remove empty strings
        const token = core.getInput('token');
        const command = core.getInput('command') || 'deploy';
        const expires = core.getInput('expires');
        const failOnBreaking = core.getInput('fail_on_breaking') === 'true';
        const filenamePattern = core.getInput('filename_pattern');
        const mcpServer = core.getInput('mcp_server');
        const cliParams = [file];
        // HELP: this condition on the import meta dirname is here only
        // for the tests. I have no idea why the value is 'undefined' in
        // tests.
        const oclifConfig = import.meta.dirname ? import.meta.dirname : '.';
        let deployParams = ['--token', token];
        if (doc) {
            deployParams = deployParams.concat(['--doc', doc]);
        }
        if (hub) {
            deployParams = deployParams.concat(['--auto-create', '--hub', hub]);
            if (filenamePattern) {
                deployParams = deployParams.concat(['--filename-pattern', filenamePattern]);
            }
        }
        if (branch) {
            deployParams = deployParams.concat(['--branch', branch]);
        }
        if (overlays) {
            deployParams = deployParams.concat(processOverlays(overlays));
        }
        if (mcpServer) {
            deployParams = deployParams.concat(['--mcp-server', mcpServer]);
        }
        // debug is only output if you set the secret `ACTIONS_RUNNER_DEBUG` to true
        core.debug(`Waiting for bump ${command} ...`);
        core.debug(new Date().toTimeString());
        switch (command) {
            case 'preview':
                await bump.Preview.run(cliParams, oclifConfig);
                break;
            case 'dry-run':
            case 'validate': // DEPRECATED, kept for backward compatibility with old gem
                await bump.Deploy.run(cliParams.concat(deployParams).concat(['--dry-run']), oclifConfig);
                break;
            case 'deploy':
                await bump.Deploy.run(cliParams.concat(deployParams), oclifConfig);
                break;
            case 'diff':
                const repo = new Repo(doc, hub, branch);
                let file1 = await repo.getBaseFile(file);
                const overlays1 = (await repo.getBaseOverlays(overlays)) || [];
                let file2;
                let overlays2;
                if (file1) {
                    overlays2 = overlays;
                    file2 = file;
                }
                else {
                    file1 = file;
                }
                const config = await Config.load(oclifConfig);
                await new bump.Diff.Diff(config)
                    .run(file1, file2, doc, hub, branch, token, 'markdown', expires, overlays1, overlays2)
                    .then((result) => {
                    if (result) {
                        diff.run(result, repo).catch(handleErrors);
                    }
                    else {
                        core.info('No changes detected, nothing more to do.');
                        repo.deleteExistingComment();
                    }
                    if (failOnBreaking && result && !!result.breaking) {
                        throw new Error('Failing due to a breaking change detected in your API diff. Please check the diff comment on your pull request.');
                    }
                })
                    .catch(handleErrors);
                break;
        }
        core.debug(new Date().toTimeString());
    }
    catch (error) {
        handleErrors(error);
    }
}
function handleErrors(error) {
    let msg = 'Unknown error';
    if (error instanceof GitHubHttpError) {
        msg = [
            `[GitHub HttpError ${error.status}] ${error.message}`,
            '',
            'Please check your GitHub Action workflow file or Actions repository settings.',
            'Especially if running the action on a fork PR: https://github.blog/2020-08-03-github-actions-improvements-for-fork-and-pull-request-workflows/',
        ].join('\n');
    }
    else if (error instanceof Error) {
        msg = error.message;
    }
    core.debug(JSON.stringify(error, Object.getOwnPropertyNames(error)));
    core.setFailed(msg);
}
function processOverlays(overlays) {
    return overlays.map((o) => ['--overlay', o]).flat();
}
//# sourceMappingURL=main.js.map