import '../src/App.css';
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal, useIsAuthenticated } from '@azure/msal-react';
import { loginRequest } from './config/msalConfig';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { InteractionRequiredAuthError } from '@azure/msal-browser';


interface UserInfo {
    success: boolean;
    data: {
        userId: string;
        email: string;
        name?: string;
    };
}


function App() {
    const { instance, accounts, inProgress } = useMsal();
    const isAuthenticated = useIsAuthenticated();
    const [loading, setLoading] = useState(false);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [products, setProducts] = useState(null);



    useEffect(() => {
        const handleRedirect = async () => {
            try {
                const response = await instance.handleRedirectPromise();
                if (response) {
                    console.log("Successfull login redirect:", response.account);
                }
            } catch (error) {
                console.error("Error ocurred during redirect:", error);
            }
        };

        handleRedirect();
    }, [instance]);



    const handleLogin = async () => {
        try {
            await instance.loginRedirect(loginRequest);
        } catch (error) {
            console.error("Failed to log in:", error);
        }
    };

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
            const response = await instance.acquireTokenSilent({
                ...loginRequest,
                account: accounts[0]
            });
            //get protected route
            const result = await axios.get(`${import.meta.env.VITE_API_URL}/auth/msal/me`, {
                headers: {
                    'Authorization': `Bearer ${response.accessToken}`
                }
            });
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


    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await instance.acquireTokenSilent({
                ...loginRequest,
                account: accounts[0]
            });

            const result = await axios.get(`${import.meta.env.VITE_API_URL}/products`, {
                headers: {
                    'Authorization': `Bearer ${response.accessToken}`
                }
            });
            setProducts(result.data);
        } catch (error) {
            if(error instanceof InteractionRequiredAuthError){
                await instance.loginRedirect(loginRequest);
            }
            console.error('Error obtaining products:', error);
        }
        finally {
            setLoading(false);
        }
    };

    console.log('Authenticated: ', isAuthenticated);
    console.log('Accounts: :', accounts);
    console.log('In progress:', inProgress);

    return (
        <div className="app-container">
            <h1> Authentication: React + MSAL + Fastify</h1>
            <UnauthenticatedTemplate>
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
            </UnauthenticatedTemplate>

            <AuthenticatedTemplate>
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

                    <div className="flex-row">
                        <button onClick={fetchProducts} disabled={loading} className="btn btn-products">
                            Get products
                        </button>
                    </div>

                    {!loading && products && (
                        <div>
                            <h3>Products from Database:</h3>
                            <pre className="info-box">{JSON.stringify(products, null, 2)}</pre>
                        </div>
                    )}

                    <button onClick={handleLogout} className="btn btn-logout">Log out</button>
                </div>
            </AuthenticatedTemplate>
        </div>
    );
}
export default App;