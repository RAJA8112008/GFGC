export const commitFile = async (
    octokit,
    owner,
    repo,
    path,
    content,
    message
) => {
    const encodedContent =
        Buffer.from(content).toString("base64");

    try {
        const response =
            await octokit.rest.repos.createOrUpdateFileContents(
                {
                    owner,
                    repo,
                    path,
                    message,
                    content: encodedContent,
                }
            );

        return response.data.commit;
    } catch (error) {
        throw error;
    }
};