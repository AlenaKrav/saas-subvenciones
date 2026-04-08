import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from './config/msalConfig.ts';
import { setupInterceptors } from './services/apiClient.ts';

const msalInstance = new PublicClientApplication(msalConfig);

//Configure interceptors
setupInterceptors(msalInstance);

msalInstance.initialize().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <MsalProvider instance={msalInstance}>
        <App />
      </MsalProvider>
    </StrictMode>
  )
})
