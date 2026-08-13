import axios from "../utils/api";

const authAPI = {
    login: () => {
        const backendBase = import.meta.env.VITE_BACKEND_URL || "/api";
        window.location.href = `${backendBase.replace(/\/api\/?$/, "")}/api/auth/github`;
    },

    logout: async () => {
        localStorage.removeItem(
            "gfghub_token"
        );
    },

    getProfile: async () => {
        const { data } =
            await axios.get("/auth/me");

        return data;
    },
};

export default authAPI;