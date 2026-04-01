import { createFileRoute, Navigate } from '@tanstack/react-router'
import ProductsPage from '@/components/ProductsPage'
import { useIsAuthenticated } from '@azure/msal-react';
import { useMsal } from "@azure/msal-react";
import { requireAuth } from '@/auth/routeGuards';
import  LoadingScreen from '@/components/LoadingScreen';


export const Route = createFileRoute('/_app/products')({
      beforeLoad: ({context}) => {
        requireAuth(context);
    },
  component: ProductComponent,
})

function ProductComponent() {
  const isAuthenticated = useIsAuthenticated();
  const { inProgress } = useMsal();

  if (inProgress !== 'none') {
    return <LoadingScreen />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return <ProductsPage />;
}