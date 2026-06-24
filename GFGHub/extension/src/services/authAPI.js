const BACKEND_URL =
    "http://localhost:5000/api";

export const loginWithGithub = () => {
    chrome.tabs.create({
        url: `${BACKEND_URL}/auth/github`,
    });
};

export const saveToken = async (token) => {
    return chrome.storage.local.set({
        jwt: token,
    });
};

export const getToken = async () => {
    const result =
        await chrome.storage.local.get(["jwt"]);

    return result.jwt;
};

export const logout = async () => {
    await chrome.storage.local.remove("jwt");
};