import { Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { useMsal } from '@azure/msal-react';
import { useEffect } from 'react';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const { instance } = useMsal();

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
  return (
    <>
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  );
}