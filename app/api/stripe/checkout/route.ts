import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  return new Stripe(key);
}

export async function GET(req: NextRequest) {
  try {
    const stripe = getStripe();
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

    if (type === "single") {
      const singlePriceId = process.env.STRIPE_PRICE_SINGLE;

      let sessionConfig: Stripe.Checkout.SessionCreateParams;

      if (singlePriceId) {
        // Use pre-configured price ID
        sessionConfig = {
          mode: "payment",
          line_items: [{ price: singlePriceId, quantity: 1 }],
          success_url: `${baseUrl}/review-generator?payment=single`,
          cancel_url: `${baseUrl}/review-generator`,
        };
      } else {
        // Create price inline
        sessionConfig = {
          mode: "payment",
          line_items: [
            {
              price_data: {
                currency: "usd",
                unit_amount: 900,
                product_data: {
                  name: "Performance Review — Single",
                  description: "One additional performance review generation",
                },
              },
              quantity: 1,
            },
          ],
          success_url: `${baseUrl}/review-generator?payment=single`,
          cancel_url: `${baseUrl}/review-generator`,
        };
      }

      const session = await stripe.checkout.sessions.create(sessionConfig);

      if (!session.url) {
        return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
      }

      return NextResponse.redirect(session.url);
    }

    if (type === "subscription") {
      const subscriptionPriceId = process.env.STRIPE_PRICE_SUBSCRIPTION;

      let sessionConfig: Stripe.Checkout.SessionCreateParams;

      if (subscriptionPriceId) {
        sessionConfig = {
          mode: "subscription",
          line_items: [{ price: subscriptionPriceId, quantity: 1 }],
          success_url: `${baseUrl}/review-generator?payment=subscription`,
          cancel_url: `${baseUrl}/review-generator`,
        };
      } else {
        sessionConfig = {
          mode: "subscription",
          line_items: [
            {
              price_data: {
                currency: "usd",
                unit_amount: 2900,
                recurring: { interval: "month" },
                product_data: {
                  name: "Performance Review Generator — Unlimited",
                  description: "Unlimited performance review generations, billed monthly",
                },
              },
              quantity: 1,
            },
          ],
          success_url: `${baseUrl}/review-generator?payment=subscription`,
          cancel_url: `${baseUrl}/review-generator`,
        };
      }

      const session = await stripe.checkout.sessions.create(sessionConfig);

      if (!session.url) {
        return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
      }

      return NextResponse.redirect(session.url);
    }

    return NextResponse.json({ error: "Invalid type. Use ?type=single or ?type=subscription" }, { status: 400 });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    if (err instanceof Error && err.message === "STRIPE_SECRET_KEY is not set") {
      return NextResponse.json({ error: "Payment not configured." }, { status: 500 });
    }
    return NextResponse.json({ error: "Failed to create checkout session." }, { status: 500 });
  }
}
