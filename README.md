# ZedEvents Website

Customer website for ZedEvents — browse event services, message vendors, and run a shop.

API: `https://zedevents-production.up.railway.app`

The site is a PWA. On a phone, tap **Download** in the bottom bar (or **Install** on iPhone) to add ZedEvents to the home screen.

## Run locally

```bash
cd zedevents-website
npm install
npm start
```

Then open http://localhost:3000 (or set `PORT`).

## What’s in this app

- Home feed with search, categories, nearby, boosted services, verified shops, and top vendors
- Rate a vendor (stars + comment)
- Save a search to get notified of new matches
- Service detail: share (WhatsApp / copy), favorites, report, message
- Vendor profiles: follow, reviews, verified mark
- My Shop: two-column grid, insights, boost (Airtel/MTN K50 or free credit), edit shop name / photo / bio
- Wanted Board: post what you need for an event; vendors can reply in chat
- Login / signup / settings: square black-and-gold layout (underline fields, gold settings topbar)
- Settings: English / Bemba / Nyanja, dark mode, low-data, following, saved searches, referrals, contact support, test notification, privacy, terms
- Offline page when the network is down
