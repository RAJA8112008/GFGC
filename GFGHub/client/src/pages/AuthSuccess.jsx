import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const AuthSuccess = () => {
    const navigate = useNavigate();
    const { setToken } = useContext(AuthContext);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        console.log("AuthSuccess token:", token);   // ← debug

        if (token) {
            // Make sure the token is persisted before we go to the dashboard
            localStorage.setItem("token", token);
            setToken(token);
            window.location.replace("/dashboard");
        } else {
            window.location.replace("/login");
        }
    }, [navigate, setToken]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Authentication Successful</h2>
                <p>Redirecting to dashboard...</p>
            </div>
        </div>
    );
};

export default AuthSuccess;
