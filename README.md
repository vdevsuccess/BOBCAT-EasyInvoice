# Bobcat Dealer Invoice Portal

A multi-dealer invoice preparation portal for Wells Fargo Booking & Funding.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel

1. Push this project to GitHub
2. Import into Vercel at https://vercel.com/new
3. Deploy — no configuration needed

## Credentials (demo)

| Dealer Name | Password |
|---|---|
| demo dealer | demo123 |
| test | test |
| bobcat connecticut | bobcat2026 |

To add real dealers, edit `app/lib/dealers.ts`

## Structure

```
app/
  page.tsx          — Login / welcome page
  portal/
    page.tsx        — Main invoice form (5 steps)
  lib/
    dealers.ts      — Dealer credentials
    types.ts        — TypeScript types
    calc.ts         — Calculation helpers
  components/
    StepDealer.tsx
    StepBuyer.tsx
    StepLineItems.tsx
    StepTotals.tsx
    StepInvoice.tsx
    LineItemCard.tsx
    InvoiceDoc.tsx
public/
  logo.png          — Bobcat logo
```
