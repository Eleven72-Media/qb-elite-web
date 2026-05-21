import { NextResponse, type NextRequest } from "next/server";

import { getStripe } from "@/lib/stripe/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Returns a one-time Stripe Customer Portal URL the user can visit to
 * update their card, cancel, swap plans, or view invoices.
 *
 * Body: empty. The session cookie identifies the user.
 * Returns: { url: string }
 *
 * Portal is configured in https://dashboard.stripe.com/test/settings/billing/portal —
 * what features the user can change there (cancel, update card, etc.)
 * is set in that UI, not here.
 */
export async function POST(req: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { data } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .maybeSingle();
  const customerId = (data as { stripe_customer_id: string | null } | null)
    ?.stripe_customer_id;

  if (!customerId) {
    return NextResponse.json(
      { error: "No Stripe customer for this user yet" },
      { status: 404 }
    );
  }

  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ??
    req.headers.get("origin") ??
    `https://${req.headers.get("host") ?? "qb-elite-web.vercel.app"}`;

  const stripe = getStripe();
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${origin}/profile`,
  });

  return NextResponse.json({ url: session.url });
}
