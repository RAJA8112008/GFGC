import { getToken } from "./authAPI";

const BACKEND_URL =
    "http://localhost:5000/api";

export const getRepositories = async () => {
    const token = await getToken();

    const response = await fetch(
        `${BACKEND_URL}/api/github/repos`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error(
            "Failed to load repositories"
        );
    }

    return await response.json();
};

export const createRepository = async (
    name
) => {
    const token = await getToken();

    const response = await fetch(
        `${BACKEND_URL}/api/github/repos`,
        {
            method: "POST",
            headers: {
                "Content-Type":
                    "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                name,
            }),
        }
    );

    return await response.json();
};