# Proventus Finance

A complete static brand and credibility website for an accounting and financial operations firm.

## Included

- Custom SVG mark and horizontal lockup
- Animated, responsive hero and financial-control interface
- Service, process, reporting, fit, FAQ and contact sections
- Privacy and branded 404 pages
- Responsive navigation, keyboard states and reduced-motion support
- Cloudflare security headers and cache rules

## Local development

```powershell
npm install
npm run dev
```

Open `http://localhost:4287`.

## Verification

```powershell
npm run check
```

## Deployment

The deployment target is Cloudflare Pages project `proventus-finance` in the `flori@ai-rise.ai` account, serving the `public/` directory directly.

The deployment command is account-guarded. It uses a repo-local, ignored Wrangler login so the machine's other Cloudflare session cannot receive this site by mistake:

```powershell
$env:XDG_CONFIG_HOME = "$PWD\.cf-wrangler"
npx wrangler login --browser=false --scopes account:read user:read pages:write
npm run deploy
```

Live preview: [proventus-finance.pages.dev](https://proventus-finance.pages.dev/)

The public contact email in this preview is provisional and must be confirmed before a client production launch.
