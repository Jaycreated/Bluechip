# Bluechip Exchange — React website

A React + Vite rebuild of the supplied Bluechip Crypto demo website.

## Run locally

1. Install Node.js 20 or newer.
2. In this folder run `npm install`.
3. Run `npm run dev` and open the local URL printed by Vite.
4. Run `npm run build` to create a production build in `dist/`.

## Included updates

- React application structure (Vite + React).
- Supplied Bluechip logo image used in the header and footer.
- Header-adjacent light/dark mode toggle with saved preference.
- USD / Nigerian naira price display using CoinGecko's USD and NGN quote currencies.
- CoinGecko market data cached locally for three minutes; saved prices remain available during API errors/rate limits.
- Market status labels for live, cached, rate-limited, and unavailable data, plus a manual Refresh control.
- Contact email updated to `support@thebluechipexchange.com`.
- Premium, deeper blue palette.

## Before publishing

Point your paid domain's DNS to your hosting provider and deploy the contents of the production `dist/` directory. The current market data uses CoinGecko's public API from the browser, so API availability and CORS/rate limits are controlled by CoinGecko. A production deployment with more traffic should use a small server-side proxy/cache. Confirm the business's actual WhatsApp number and all contact details before launch; the number and Instagram account were retained from the provided demo.
