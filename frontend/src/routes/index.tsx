import { createFileRoute, Navigate } from '@tanstack/react-router';
import { useIsAuthenticated } from '@azure/msal-react';
import { useMsal } from "@azure/msal-react";
import DashboardPage from '../components/DashboardPage';
import { requireAuth } from '../auth/routeGuards';
import  LoadingScreen from '../components/LoadingScreen';

export const Route = createFileRoute('/')({
    beforeLoad: ({ context }) => {
        requireAuth(context);
    },
    component: DashboardComponent,
});

function DashboardComponent() {
    const { inProgress } = useMsal();
    const isAuthenticated = useIsAuthenticated();

    if (inProgress !== 'none') {
        return <LoadingScreen />
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }
    return <DashboardPage />;
}
