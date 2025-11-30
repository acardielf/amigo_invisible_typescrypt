die# Secret Santa App

Modern Secret Santa gift exchange application built with React, TypeScript, and Tailwind CSS.

## Features

- Participant management with names, emails, and wishlists
- Exclusion rules (couples, siblings shouldn't gift each other)
- Fair drawing algorithm with ring-structure assignment
- Automated email sending via EmailJS
- Privacy-focused (assignments only sent via email, never displayed)
- Bilingual support (German/English)
- Persistent localStorage

## Quick Start

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # Production build
```

## EmailJS Setup

Required for email functionality:

1. Create account at [EmailJS.com](https://www.emailjs.com/)
2. Create email service and template with variables:
   - `{{to_name}}` - Recipient's name
   - `{{recipient_name}}` - Secret Santa assignment
   - `{{recipient_wishes}}` - Wishlist
3. Create `.env` file:

```env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

## Deployment

```bash
npm run build
```

Deploy `/dist` folder to Vercel, Netlify, or GitHub Pages.

Environment variables needed in production:
- `VITE_EMAILJS_SERVICE_ID`
- `VITE_EMAILJS_TEMPLATE_ID`
- `VITE_EMAILJS_PUBLIC_KEY`

---

Built with React 19, TypeScript, Vite, Zustand, and Tailwind CSS.
