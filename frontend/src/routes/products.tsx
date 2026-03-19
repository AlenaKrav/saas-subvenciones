import { createFileRoute, Navigate } from '@tanstack/react-router'
import ProductsPage from '../components/ProductsPage'
import { useIsAuthenticated } from '@azure/msal-react';
import { useMsal } from "@azure/msal-react";


export const Route = createFileRoute('/products')({
  component: ProductComponent,
})

function ProductComponent() {
  const isAuthenticated = useIsAuthenticated();
  const { inProgress } = useMsal();

  if (inProgress !== 'none') {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return <ProductsPage />;
}
