import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: null as any, // ponytail: version mismatch, Stripe SDK pin to latest
  typescript: true,
})
