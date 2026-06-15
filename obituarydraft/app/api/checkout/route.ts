import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PLAN_NAME = "ObituaryDraft — Unlimited Cases";
const PLAN_AMOUNT_CENTS = 4900; // $49.00 / month

/**
 * Creates a Stripe Checkout session for the $49/month subscription. If Stripe
 * is not configured we return a clear message so the paywall can fall back
 * gracefully (this keeps the MVP runnable without Stripe keys).
 */
export async function POST(req: Request) {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return NextResponse.json(
      { error: "Stripe is not configured yet. Add STRIPE_SECRET_KEY to enable checkout." },
      { status: 503 },
    );
  }

  const stripe = new Stripe(secret);
  const origin =
    req.headers.get("origin") ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000";

  // Use a pre-created Price if supplied, otherwise build an inline one.
  const priceId = process.env.STRIPE_PRICE_ID;
  const lineItem: Stripe.Checkout.SessionCreateParams.LineItem = priceId
    ? { price: priceId, quantity: 1 }
    : {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: PLAN_AMOUNT_CENTS,
          recurring: { interval: "month" },
          product_data: { name: PLAN_NAME },
        },
      };

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [lineItem],
      success_url: `${origin}/?subscribed=true`,
      cancel_url: `${origin}/?checkout=cancelled`,
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout failed:", err);
    return NextResponse.json(
      { error: "Could not start checkout. Please try again." },
      { status: 502 },
    );
  }
}
