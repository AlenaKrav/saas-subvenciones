import { Link } from '@tanstack/react-router';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../config/msalConfig';
import { useState } from 'react';
import { InteractionRequiredAuthError } from '@azure/msal-browser';
import { getProducts } from '../services/api';
import '../App.css';


export default function ProductsPage() {
    const { instance } = useMsal();
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState(null);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const result = await getProducts();
            setProducts(result.data);
        } catch (error) {
            if (error instanceof InteractionRequiredAuthError) {
                await instance.loginRedirect(loginRequest);
            }
            console.error('Error obtaining products:', error);
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div className="app-container">
            <h1>Products</h1>
            <div className="auth-box logged-in">
                <h2>Now you are logged in!</h2>
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

                <div className="flex-row" style={{ marginTop: '1rem' }}>
                    <Link to="/dashboard" className="btn btn-navigate">
                        Go to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    )
}
