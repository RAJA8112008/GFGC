const BACKEND_URL =
    "http://localhost:5000/api";

export async function pushSolution(payload) {
    const resp = await fetch(`${BACKEND_URL}/api/solutions`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    return await resp.json();
}