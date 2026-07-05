import axios from "../utils/api";

const authAPI = {
    login: () => {
        window.location.href =
            `${import.meta.env
                .VITE_BACKEND_URL
            }/auth/github`;
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