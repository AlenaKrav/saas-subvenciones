import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from './config/msalConfig.ts';

// Create a central instance of MSAL Browser with our specific configuration
// It will allow us to carry out: login, token managing,  logout etc
const msalInstance = new PublicClientApplication(msalConfig);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* MsalProvider is React Context Provider that allows our SPA to use MSAL with React Hooks and it injects in entire React App */}
    <MsalProvider instance={msalInstance}>
    <App />
    </MsalProvider>
  </StrictMode>,
)
