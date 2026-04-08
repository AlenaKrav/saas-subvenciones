// import '../src/App.css';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { ThemeProvider } from "@/components/theme-provider"


const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  context: {
    isAuthenticated: false,
    inProgress: 'none' as const,
  }
});


declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function App() {
  const isAuthenticated = useIsAuthenticated();
  const { inProgress } = useMsal();
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider
        router={router}
        context={{ isAuthenticated, inProgress }}
      />
    </ThemeProvider>
  )
}
export default App;