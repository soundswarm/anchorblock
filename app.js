const tieron = require('./tierionHelpers');
const gh = require('./githubHelpers');
// starts process
// const run = async () => {
//   // Generate a new random hash each second.
//   const merkleTools = await tieron.addLeafPerSec('arbitrary');
//   tieron.sendTreeToChainpoint(merkleTools);
//   return run();
// };
// run();

const run = async () => {
  const repos = await gh.getPublicRepos();
  console.log('REPOS', repos);
  repos.map(async repo => {
    // console.log(repo.commits_url)
    const commits_url = repo.commits_url.slice(0, repo.commits_url.length - 6);
    // const commits = await gh.getRepoCommits(commits_url);
    console.log('COMMITSabdsf', commits_url);
  });
  const last = repos.length;
  const lastRepoId = repos[last - 1].id;
  console.log('LASTREPOID', lastRepoId);
};

run();
