export const commitFile = async (
  octokit,
  owner,
  repo,
  path,
  content,
  message
) => {
  const encodedContent = Buffer.from(content).toString("base64");

  let sha;

  try {
    const existing = await octokit.rest.repos.getContent({
      owner,
      repo,
      path
    });

    sha = existing.data.sha;
  } catch (err) {
    // file does not exist yet -> create new
    sha = undefined;
  }

  const response = await octokit.rest.repos.createOrUpdateFileContents({
    owner,
    repo,
    path,
    message,
    content: encodedContent,
    sha
  });

  return response.data.commit;
};