import axios from "axios";

const instance = axios.create({
    baseURL:
        import.meta.env.VITE_BACKEND_URL ||
        "https://gfgc-1.onrender.com/api",
});

instance.interceptors.request.use(
    (config) => {
        const token =
            localStorage.getItem("gfghub_token");

        if (token) {
            config.headers.Authorization =
                `Bearer ${token}`;
        }

        return config;
    }
);

instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (
            error.response?.status === 401
        ) {
            localStorage.removeItem(
                "gfghub_token"
            );

            window.location.href =
                "/login";
        }

        return Promise.reject(error);
    }
);

export default instance;