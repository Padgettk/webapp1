# Azure AI Foundry – School Faculty Assistant (Next.js Starter)

A production‑ready starter repo for a secure web frontend that:

- Authenticates **faculty** via Microsoft Entra ID (Azure AD) using **NextAuth**
- Accepts **file uploads** directly to **Azure Blob Storage** using short‑lived **SAS** URLs
- Proxies requests to your **Azure AI Foundry Agent Service** via server route handlers
- Stores small app/user/session data in **Azure SQL (serverless)** via **Prisma**
- Runs over **HTTPS** on Azure (App Service or Static Web Apps)

## Quick Start

```bash
# 1) Install
npm install

# 2) Set environment
cp .env.example .env.local
# Fill in AZURE_AD_*, DATABASE_URL, AZURE_STORAGE_*, AI_FOUNDRY_*

# 3) Initialize DB
npx prisma generate
npx prisma migrate dev --name init

# 4) Run
npm run dev
```

## Azure configuration

- **SSO (Entra ID)**: Register a Web app, add redirect URI `http://localhost:3000/api/auth/callback/azure-ad`, copy Client ID/Secret and Tenant ID. (Docs: NextAuth Azure AD provider; MSAL React/Entra ID)  
  References: NextAuth Azure AD docs; MSAL React guide.  
- **Blob Storage uploads**: This app mints **SAS** in `/api/upload/sas` and uploads directly from the browser with `PUT`. Ensure the Storage account **CORS** allows your domain for `PUT` and `OPTIONS`.  
  References: Azure tutorial on browser→Blob SAS uploads.  
- **Malware scanning (recommended)**: Enable **Microsoft Defender for Storage on‑upload malware scanning** on the storage account.  
  References: Defender for Storage malware scanning overview.  
- **HTTPS**: Azure App Service and Azure Static Web Apps issue and renew TLS certs for custom domains automatically.  
  References: App Service TLS docs; Static Web Apps custom domain & SSL.

## Environment variables
See `.env.example` for all required keys.

## Project structure
```
app/
  api/
    agent/route.ts        # Proxy to Azure AI Foundry Agent Service
    auth/[...nextauth]/route.ts  # NextAuth with Azure AD provider
    upload/sas/route.ts   # Returns short-lived SAS for uploads
  layout.tsx
  page.tsx               # Simple UI: sign-in, upload, chat to agent
components/
  Navbar.tsx
  UploadForm.tsx
  AgentForm.tsx
lib/
  auth.ts                # NextAuth options
  prisma.ts              # Prisma client
  blob.ts                # Shared blob helpers
prisma/
  schema.prisma          # NextAuth models (SQL Server)
```

## Notes
- For very large files, use **block blob** upload with chunking.  
- Keep SAS validity short (e.g., 15 min) and **never** expose account keys in the browser.  
- In production, set `NEXTAUTH_URL` to your public URL and configure cookies accordingly.

## References
- Azure AI Foundry Agent Service API (agents, threads, runs)  
- Next.js App Router route handlers  
- NextAuth Azure AD provider  
- MSAL React (general Entra ID patterns)  
- Browser→Blob Storage SAS tutorial  
- Defender for Storage malware scanning  
- HTTPS on Azure App Service and Static Web Apps  
```
[1] https://learn.microsoft.com/en-us/rest/api/aifoundry/aiagents/
[2] https://nextjs.org/docs/app/building-your-application/routing/route-handlers
[3] https://next-auth.js.org/providers/azure-ad
[4] https://learn.microsoft.com/en-us/entra/msal/javascript/react/getting-started
[5] https://learn.microsoft.com/en-us/azure/developer/javascript/tutorial/browser-file-upload-azure-storage-blob
[6] https://learn.microsoft.com/en-us/azure/defender-for-cloud/on-upload-malware-scanning
[7] https://learn.microsoft.com/en-us/azure/app-service/configure-ssl-certificate
[8] https://learn.microsoft.com/en-us/azure/static-web-apps/custom-domain
```
