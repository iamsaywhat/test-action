const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
    try {

      const githubToken = core.getInput('github_token');
      const octokit = github.getOctokit(githubToken)

      // You can also pass in additional options as a second parameter to getOctokit
      // const octokit = github.getOctokit(myToken, {userAgent: "MyActionVersion1"});
  
      const { data: pullRequest } = await octokit.rest.pulls.get({
          owner: 'octokit',
          repo: 'rest.js',
          pull_number: 123,
          mediaType: {
            format: 'diff'
          }
      });
  
      console.log(pullRequest);
    } catch (error) {
      core.setFailed(error.message);
    }
  }
  
  run();