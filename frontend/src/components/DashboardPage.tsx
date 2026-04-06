import { Link } from '@tanstack/react-router';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../config/msalConfig';
import { useState } from 'react';
import { InteractionRequiredAuthError } from '@azure/msal-browser';
import { getMe } from '../services/api';
import '../App.css';
import { DashboardCardLink } from '@/components/DashboardCardLink';


interface UserInfo {
    success: boolean;
    data: {
        userId: string;
        email: string;
        name?: string;
    };
}

export default function DashboardPage() {
    const { instance, accounts, inProgress } = useMsal();
    const [loading, setLoading] = useState(false);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);


    const handleLogout = async () => {
        try {
            await instance.logoutRedirect({
                postLogoutRedirectUri: window.location.origin
            });
        } catch (error) {
            console.error("Failed to log out:", error);
        }
    };

    const fetchMe = async () => {
        try {
            setLoading(true);
            const result = await getMe();
            setUserInfo(result.data);

        } catch (error) {
            if (error instanceof InteractionRequiredAuthError) { //In case MSAL failed silently refresh token, it will throw this type of Erro
                await instance.loginRedirect(loginRequest); //We catch it and request user to login again
            }
            console.error('Error obtaining user info:', error);
        }
        finally {
            setLoading(false); //Independently if everything went ok or not, we desactivate the Loader
        }
    };


    return (
        <>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <div className="grid auto-rows-min gap-4 md:grid-cols-2">
                    <DashboardCardLink
                        to="/products"
                        label="Ir a productos"
                        disabled={inProgress !== 'none'}
                    />

                    <DashboardCardLink
                        to="/formulario"
                        label="Ir a formulario"
                        disabled={inProgress !== 'none'}
                    />
                </div>

                {/* <div className="min-h-screen flex-1 rounded-xl bg-muted/50 md:min-h-min">
                    <h1>Dashboard</h1>
                    <div className="auth-box logged-in">
                        <h2>Now you are logged in!</h2>
                        {accounts.length > 0 && (
                            <div className="info-box">
                                <p><strong>User:</strong> {accounts[0].name}</p>
                                <p><strong>Email:</strong> {accounts[0].username}</p>
                            </div>
                        )}

                        <div className="flex-row">
                            <button onClick={fetchMe} className="btn btn-check">Check protected user info</button>
                        </div>

                        {loading && <p>Loading user info...</p>}

                        {!loading && userInfo && (
                            <div className="info-box">
                                <p><strong>Logged user id:</strong> {userInfo.data.userId}</p>
                            </div>
                        )}

                        <div className="flex-row" style={{ marginTop: '1rem' }}>
                            <Link to="/products" className="btn btn-navigate">
                                Go to Products
                            </Link>
                        </div>

                        <button onClick={handleLogout} className="btn btn-logout">Log out</button>
                    </div>


                </div> */}
            </div>
        </>
    )
}
