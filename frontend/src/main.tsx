import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from './config/msalConfig.ts';
import { setupInterceptors } from './services/apiClient.ts';

// Create a central instance of MSAL Browser with our specific configuration
// It will allow us to carry out: login, token managing, logout etc
const msalInstance = new PublicClientApplication(msalConfig);

//Configure interceptors
setupInterceptors(msalInstance);

// Use initilize with msalInstance to ensure that its ready and after we start rendering with React
// It allows us to load cache, accounts, pending redirects and avoid some bugs
msalInstance.initialize().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <MsalProvider instance={msalInstance}>
        <App />
      </MsalProvider>
    </StrictMode>
  )
})
