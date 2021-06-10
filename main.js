import { getInput, setFailed } from '@actions/core';
import { exec } from '@actions/exec';
import { getOctokit, context } from '@actions/github';
import yn from 'yn';

import {
  normaliseFingerprint,
  diffSizes,
  buildOutputText,
  getPullRequest,
  getAssetSizes,
} from './lib/helpers';

let octokit;

async function run() {
  try {
    const myToken = getInput('repo-token', { required: true });
    const usePrArtifacts = yn(getInput('use-pr-artifacts', { required: false }));

    const cwd = process.cwd();

    octokit = getOctokit(myToken);
    const pullRequest = await getPullRequest(context, octokit);

    const prAssets = await getAssetSizes({ cwd, build: !usePrArtifacts });

    await exec(`git checkout ${pullRequest.base.sha}`);

    const masterAssets = await getAssetSizes();

    const fileDiffs = diffSizes(normaliseFingerprint(masterAssets), normaliseFingerprint(prAssets));

    const body = buildOutputText(fileDiffs);

    try {
      await octokit.issues.createComment({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: pullRequest.number,
        body,
      });
    } catch (e) {
      console.log(`Could not create a comment automatically. This could be because github does not allow writing from actions on a fork.

See https://github.community/t5/GitHub-Actions/Actions-not-working-correctly-for-forks/td-p/35545 for more information.`);

      console.log(`Copy and paste the following into a comment yourself if you want to still show the diff:

${body}`);
    }
  } catch (error) {
    setFailed(error.message);
  }
}

export default run;
