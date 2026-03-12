# Microsoft Entra ID Authentication with MSAL, React and Fastify
This project demonstrates how to authenticate users using **Microsoft Entra ID**, **MSAL React**, and a **Fastify backend API**.
In this case the frontend handles user authentication with  MSAL and then sends access tokens to the backend.  
The backend verifies tokens and allows access to protected routes.

This type of architecture implements Authorization Code Flow with PKCE (Public Client), with the following features:
- can't store secrets, because user could check them with F12
- tokens are stored in browser

As we can't store secrets in our client, Microsoft does the following:
- when we call instance.loginRedirect(), MSAL internally:
generates code_verifier (random string)
generates code_challenge = SHA256(code_verifier)
store code_verifier
send code_challenge
- when we call handleRedirectPromise(), uses code_verifier to ask for token


Diagram of the flow:
React SPA
   │
   │ 1 login request
   │   + code_challenge
   ▼
Azure AD
   │
   │ 2 login user
   ▼
Azure AD
   │
   │ 3 authorization code
   ▼
React SPA
   │
   │ 4 send to token endpoint:
   │   authorization_code
   │   code_verifier
   ▼
Azure AD
   │
   │ 5 verifies:
   │   SHA256(code_verifier) == code_challenge
   ▼
Azure AD
   │
   │ 6 access token
   ▼
React SPA


----

# Steps for the implementation
# 1. Dependencies
## Frontend
Install the following packages:
npm install @azure/msal-browser @azure/msal-react axios

## Backend
npm install @fastify/cors

# 2. Register the Application and API Scope

1. Case 1 - Existing App Registration
If you have already have a registered App in ENTRA ID, the only change you should make is the following:
1. Go to your Registered App
2. Authentication Preview Section
3. Redirection URI Configuration Tab
4. Add or edit redirect URI of "Single Page Application" to your frontend URI
Example: http://localhost:5173


2. Case 2 - Register a new App
Follow the instructions described in ![Backend README.md](../backend/README.md).

# 3 Frontend .env file configuration
Once you have your ENTRA ID application, you should copy the following values from "General Information" Dashboard of your application or from your backend .env file, as you will need the exact same values.

**Remember, if your are using VITE you must name your variables using the prefix "VITE_"**
VITE_AZURE_TENANT_ID=your_tenant_id
VITE_AZURE_CLIENT_ID=your_client_id
VITE_AZURE_AUTHORITY=https://login.microsoftonline.com/[YOUR_TENANT_ID]/v2.0
VITE_AZURE_SCOPE=api://[YOUR_CLIENT_ID]/[your_custom_scope_name]
VITE_AZURE_REDIRECT_URI=your_frontend_uri
VITE_API_URL=your_backend_uri


# 4 MSAL Client Configuration
Create a configuration file, for example:
config/msalConfig.ts
It is necessary to instantiate a ConfidentialClientApplication, which will handle all authentication flow securely.
With auth property we identify our application in Microsoft.
Auth property admits the following parameters, as showed in the following example:

```javascript
    auth: {
        clientId: import.meta.env.VITE_AZURE_CLIENT_ID!,
        authority: import.meta.env.VITE_AZURE_AUTHORITY,
        redirectUri: import.meta.env.VITE_AZURE_REDIRECT_URI
    },
```
Also you will have to add cache property, defining the location of your cache storage, for example:

```javascript
    cache: {
        cacheLocation: "localStorage",
    }
```
Finally you will need to define an object loginRequest of RedirectRequest type that will include your custom scope created in ENTRA ID.

# 5 MSAL Initialization in main.tsx
Create a central instance of MSAL Browser with our specific configuration from msalConfig.ts:

```javascript
const msalInstance = new PublicClientApplication(msalConfig);
```
Use initialize with msalInstance to ensure it is ready before rendering with React:

```javascript
msalInstance.initialize()
```
Its crucial to wrap our App component with MsalProvider in order to make msalInstance available in the entire App

```javascript
<MsalProvider instance={msalInstance}>
        <App />
</MsalProvider>
```

## 6 App.tsx
You will need to import the following templates from msal-react module:
**AuthenticatedTemplate** - renders content if user is authenticated
**UnauthenticatedTemplate**  - renders content if user is not authenticated

Also you will to import need msal-react hooks:
**useMsal()** - hook that allows us to use MSAL context and obtain the following data:
  - *instance* = MSAL object to manage login, token y etc
  - *accounts* = authenticated accounts
  - *inProgress* = login state
  
**useIsAuthenticated()** - hook that returns true o false depending if we have session (uses useState hook internally)

**handleRedirect()** 
- this function finishes OAuth flow after loginRedirect
- is used inside useEffect hook in order to execute it every time the app component is mounted (after a login redirect for example), and everytime [instance] dependency is changed (however this instance is actually stable)
- according to Microsoft official docs, if need to invoke it if we use redirect flows in our app:
[link](https://learn.microsoft.com/en-us/entra/identity-platform/msal-js-initializing-client-applications)
- according to other sources, we don't need it explicitly as we are using MSAL Provider, that handles it internally in newer versions of MSAL.

  - *handleRedirectPromise()* the purpose of this function is to:
      1. Check the redirect url for temporary code http://localhost:5173/#code=ABC123&state=xyz
      2. Detect the temporary code, that will be exchanged for a token 
      3. When the page is loaded normally and the application isn't returning from a redirect operation and there is no temporary code - the function will return null
      4. Stores the token in localstorage
      5. Clean up the url http://localhost:5173/#code=ABC123&state=xyz -> http://localhost:5173/
      6. If we are redirected from Microsoft but there is no temporary code, it will be intercepted by catch block

**handleLogin()** 
*loginRedirect(loginRequest)*
- redirects us to Microsoft Login page, where we authenticate with our Microsoft credentials
- loginRequest object defines our custom scopes, in order to tell Microsoft that we will need a token with these exact scopes

**handleLogout()** 
*logoutRedirect()* 
- receives an object postLogoutRedirectUri: window.location.origin to redirect us to the origin URL of the current page
- cleans up localStorage (cached tokens for activeAccount)

**fetchMe/fetchProducts** functions that allows us to access protected routes in our backend
*acquireTokenSilent* 
- receives scopes in order to verify if the generated token has the same scopes
- receives a Microsoft account that we need our token for
- retrieves token from cache, avoiding user interaction
- silently tries to renew the token if expired
- if failed request user to login again

*axios.get* 
- sends request to a protected route
- includes headers with access token


# 7 Modify backend app.ts importing and registering CORS plugin
It allows requests from our frontend to our backend

```javascript
import cors from '@fastify/cors'; 

app.register(cors, {
    origin: 'http://[YOUR_FRONTEND_URL]', 
    credentials: true 
});
```
# Guide to verify the flow functionality:
- Start your backend and your frontend (npm run dev)
- Open your frontend url
- Click "Login"
- Login with your Microsoft Account
- If login is successful, you will see "Now you are logged in!" and a panel with different buttons to retrieve info from protected routes:
1. "Check protected user info" - will return userId of your Microsoft Account (protected backend route /auth/msal/me)
2. "Get products" - will return you all products from our database in JSON format (protected backend route /products)
- In order to logout, click the "Logout" button.

## Authentication Flows
[Case 1 -  Initial App Load](docs/Authentication%20Flow%20Frontend%20(React)%20-%20Backend%20(Fastify)%20-%20Case-1.png)
[Case 2 - User Logs In](docs/Authentication%20Flow%20Frontend%20(React)%20-%20Backend%20(Fastify)%20-%20Case-2.png)
[Case 3 - User retrieves info from protected routes](docs/Authentication%20Flow%20Frontend%20(React)%20-%20Backend%20(Fastify)%20-%20%20Case-3.png)
[Case 4 - User logs out](docs/Authentication%20Flow%20Frontend%20(React)%20-%20Backend%20(Fastify)%20-%20%20Case-4.png)