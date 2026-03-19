import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../config/msalConfig";
import '../App.css';


export default function LoginPage() {
    const { instance, inProgress } = useMsal();


    const handleLogin = async () => {
        try {
            await instance.loginRedirect(loginRequest);
        } catch (error) {
            console.error("Failed to log in:", error);
        }
    };

    return (
        <div className="app-container">
            <h1> Authentication: React + MSAL + Fastify</h1>
            <div className="auth-box">
                <h2>You are not logged in</h2>
                <p>State: {inProgress}</p>

                <button
                    className="btn btn-login"
                    onClick={handleLogin}
                    disabled={inProgress !== 'none'}
                >
                    Log in
                </button>
            </div>
        </div>
    )
}