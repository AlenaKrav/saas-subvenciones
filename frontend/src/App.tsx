// import '../src/App.css';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';

// Create Router Instance
const router = createRouter({ 
  routeTree, //use automatically generated route tree
  defaultPreload: 'intent', //preload data if user shows intent to navigate (mouse over a link, focus) = instant navigation
  context: {
    isAuthenticated: false,
    inProgress: 'none' as const, //initial strictly typed value, not a generic string
  }
});

// Register our own router for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function App() {
  const isAuthenticated = useIsAuthenticated();
  const { inProgress } = useMsal();
  // Provide global context of our router
    return <RouterProvider 
    router={router}
    context={{isAuthenticated, inProgress }} 
    />;
    
}
export default App;