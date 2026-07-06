import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import type { InteractionStatus } from '@azure/msal-browser';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { useMsal } from '@azure/msal-react';
import { useEffect } from 'react';

export interface RouterContext {
  isAuthenticated: boolean;
  inProgress: InteractionStatus;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
})

function RootComponent() {
  const { instance } = useMsal();

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        const response = await instance.handleRedirectPromise();
        if (response?.account) {
          instance.setActiveAccount(response.account)
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