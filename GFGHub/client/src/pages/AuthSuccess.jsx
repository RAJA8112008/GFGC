import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthSuccess = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(
            window.location.search
        );

        const token = params.get("token");

        if (token) {
            localStorage.setItem(
                "token",
                token
            );

            navigate("/dashboard");
        } else {
            navigate("/login");
        }
    }, [navigate]);

    return (
        <div
            className="
      min-h-screen
      flex
      items-center
      justify-center
      "
        >
            <div
                className="
        text-center
        "
            >
                <h2
                    className="
          text-2xl
          font-bold
          mb-4
          "
                >
                    Authentication Successful
                </h2>

                <p>
                    Redirecting to dashboard...
                </p>
            </div>
        </div>
    );
};

export default AuthSuccess;