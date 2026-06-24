import { getToken } from "./authAPI";

const BACKEND_URL = "http://localhost:5000";

export const pushSolution = async (
    payload
) => {
    const token = await getToken();

    const response = await fetch(
        `${BACKEND_URL}/api/solutions`,
        {
            method: "POST",
            headers: {
                "Content-Type":
                    "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        }
    );

    return await response.json();
};

export const getStats = async () => {
    const token = await getToken();

    const response = await fetch(
        `${BACKEND_URL}/api/dashboard/stats`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return await response.json();
};