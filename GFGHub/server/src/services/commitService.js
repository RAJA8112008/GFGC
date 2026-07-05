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

    if (!Array.isArray(existing.data)) {
      sha = existing.data.sha;
    }
  } catch (err) {
    if (err.status !== 404) {
      console.error("GitHub getContent error:", err);
      throw err;
    }
    // file does not exist yet -> create new
    sha = undefined;
  }

  let response;
  try {
    response = await octokit.rest.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message,
      content: encodedContent,
      sha
    });
  } catch (err) {
    if (err.status === 422 && err.message.includes('"sha" wasn\'t supplied')) {
      // The file might exist with different casing. Fetch the directory and find it.
      const dirPath = path.substring(0, path.lastIndexOf('/'));
      const fileName = path.substring(path.lastIndexOf('/') + 1);
      
      try {
        const dir = await octokit.rest.repos.getContent({ owner, repo, path: dirPath || '' });
        if (Array.isArray(dir.data)) {
          const matched = dir.data.find(f => f.name.toLowerCase() === fileName.toLowerCase());
          if (matched) {
            response = await octokit.rest.repos.createOrUpdateFileContents({
              owner,
              repo,
              path: matched.path, // Use the existing path casing
              message,
              content: encodedContent,
              sha: matched.sha
            });
            return response.data.commit;
          }
        }
      } catch (dirErr) {
        // Ignore directory fetch errors and throw the original error
      }
    }
    throw err;
  }

  return response.data.commit;
};