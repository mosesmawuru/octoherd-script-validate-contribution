// @ts-check

/**
 * octoherd-script-good-pr
 *
 * @param {import('@octoherd/cli').Octokit} octokit
 * @param {import('@octoherd/cli').Repository} repository
 */
export async function script(octokit, repository) {
  const [repoOwner, repoName] = repository.full_name.split("/");

  const issues = await octokit.request('GET /repos/{owner}/{repo}/issues', {
    owner: repoOwner,
    repo: repoName,
  })

  try {
    for (let i = 0; i < issues.data.length; i++) {
      const {body} = issues.data[0];

      // TODO: Pass this in as a argument
      const todoExists = body.includes("TODO");

      if (todoExists) {

        await octokit.request('POST /repos/{owner}/{repo}/issues/{issue_number}/labels', {
          owner: repoOwner,
          repo: repoName,
          issue_number: issues.data[i].number,
          labels: ["needs info"] // TODO: make this label an argument
        })
      }
    }
  } catch(e) {
    octokit.log.error(e)
  }
}