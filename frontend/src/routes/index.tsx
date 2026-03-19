import { createFileRoute, Navigate } from '@tanstack/react-router';
import { useIsAuthenticated } from '@azure/msal-react';
import { useMsal } from "@azure/msal-react";
import DashboardPage from '../components/DashboardPage';
import '../App.css';

export const Route = createFileRoute('/')({
    component: DashboardComponent,
});


function DashboardComponent() {
    const { inProgress } = useMsal();
    const isAuthenticated = useIsAuthenticated();

    if (inProgress !== 'none') {
        return (
            <div className="app-container">
                <div className="auth-box">
                    <h2>Loading...</h2>
                    <p>Please wait...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }
    return <DashboardPage />;
}
