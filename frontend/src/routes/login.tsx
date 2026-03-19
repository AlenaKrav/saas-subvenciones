import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useIsAuthenticated } from "@azure/msal-react";
import { useMsal } from "@azure/msal-react";
import LoginPage from "../components/LoginPage";
import '../App.css';

export const Route = createFileRoute('/login')({
    component: LoginComponent,
});

function LoginComponent() {
    const isAuthenticated = useIsAuthenticated();
    const { inProgress } = useMsal();
    if (inProgress !== 'none') {
        return <div>Loading...</div>;
    }

    if (isAuthenticated) {
        return <Navigate to="/" />;
    }
    return <LoginPage />;
}