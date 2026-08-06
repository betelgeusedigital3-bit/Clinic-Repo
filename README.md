# BrightNest Pediatric Clinic

A responsive, single-page pediatric clinic website built with the Next.js App Router, TypeScript, Tailwind CSS, GSAP, React Three Fiber, React Hook Form, Zod, and Resend.

## Run locally

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and add your Resend credentials before testing booking or inquiry emails.

## Email configuration

- `RESEND_API_KEY`: Resend API key.
- `CLINIC_EMAIL`: inbox that receives appointment and inquiry notifications.
- `RESEND_FROM_EMAIL`: sender on a domain verified in Resend.

Both the booking and inquiry endpoints validate request data server-side. Each successful request sends a clinic notification and a parent confirmation.

## Production

The project keeps environment-specific values out of source control and is ready for a standard Vercel deployment. Add the three environment variables in the deployment dashboard before going live.
