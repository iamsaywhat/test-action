const core = require('@actions/core');
const github = require('@actions/github');

function getPullRequestFromGithubRef() {
  const result = /refs\/pull\/(\d+)\/merge/g.exec(process.env.GITHUB_REF);
  if (!result) throw new Error("Reference not found.");
  const [, pullRequestId] = result;
  return pullRequestId;
}

function getPullRequestNumberFromEventPath() {
  const fs = require('fs')
  const ev = JSON.parse(
    fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8')
  )
  // console.warn(ev)
  return ev.pull_request.number
}

async function run() {
    try {

      const githubToken = core.getInput('github_token');
      const octokit = github.getOctokit(githubToken)

      // console.info("getPullRequestFromGithubRef: " +  getPullRequestFromGithubRef())
      // // console.info("getPullRequestNumberFromEventPath: " +  getPullRequestNumberFromEventPath())
      // console.info("number: " + github.context.issue.number)

      // console.info("owner: " + github.context.repo.owner)
      // console.info("repo: " + github.context.repo.repo)

      const data = await octokit.rest.pulls.get({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        pull_number: github.context.issue.number,
      });

      // console.info(data)

      octokit.rest.pulls.update({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        pull_number: github.context.issue.number,
        body: data.data.body + "YOOOOO"
      })

      console.warn("run_id: " + github.context.runId)

      const resp = await octokit.rest.actions.listWorkflowRunArtifacts({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        run_id: github.context.runId
      });

      const number = resp.data.total_count
      const artifacts = resp.data.artifacts
      console.info("number: " + number)
      console.info("artifacts: " + artifacts)

    } catch (error) {
      core.setFailed(error.message);
    }
  }
  
  run();