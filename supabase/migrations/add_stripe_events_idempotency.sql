-- F-005: idempotency table for Stripe webhook events.
--
-- Stripe retries webhook deliveries until we 200, so the same event_id
-- can arrive multiple times. We INSERT … ON CONFLICT DO NOTHING and
-- short-circuit the rest of the handler if the event was already seen.

BEGIN;

CREATE TABLE IF NOT EXISTS public.stripe_events (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  received_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.stripe_events IS
  'Idempotency table for Stripe webhook deliveries. Insert (id) before processing; ON CONFLICT means we''ve already handled this event.';

-- RLS not needed — only the Edge Function (service_role key) writes,
-- and nothing reads from the application side.
ALTER TABLE public.stripe_events ENABLE ROW LEVEL SECURITY;

-- Auto-purge events older than 30 days so the table doesn't grow
-- forever (Stripe's retry window is 72 hrs; anything older is safe to
-- drop). Index on received_at makes this cheap.
CREATE INDEX IF NOT EXISTS idx_stripe_events_received_at
  ON public.stripe_events (received_at);

COMMIT;
