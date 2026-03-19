import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useIsAuthenticated } from "@azure/msal-react";
import { useMsal } from "@azure/msal-react";
import LoginPage from "../components/LoginPage";
import { requireGuest } from '../auth/routeGuards';
import  LoadingScreen from '../components/LoadingScreen';

export const Route = createFileRoute('/login')({
        beforeLoad: ({context}) => {
            requireGuest(context);
        },
    component: LoginComponent,
});

function LoginComponent() {
    const isAuthenticated = useIsAuthenticated();
    const { inProgress } = useMsal();
    if (inProgress !== 'none') {
        return <LoadingScreen />
    }

    if (isAuthenticated) {
        return <Navigate to="/" />;
    }
    return <LoginPage />;
}