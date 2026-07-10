-- F-006: idempotency table for Apple App Store Server Notifications V2.
--
-- Apple retries notification deliveries until we 200; the same
-- notificationUUID can arrive multiple times. Same pattern as
-- stripe_events: INSERT … ON CONFLICT short-circuits.

BEGIN;

CREATE TABLE IF NOT EXISTS public.apple_notifications (
  id TEXT PRIMARY KEY,                  -- notificationUUID from Apple
  notification_type TEXT NOT NULL,
  subtype TEXT,
  received_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.apple_notifications IS
  'Idempotency table for App Store Server Notifications V2. Insert (id) before processing; ON CONFLICT means we''ve already handled this notification.';

ALTER TABLE public.apple_notifications ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_apple_notifications_received_at
  ON public.apple_notifications (received_at);

COMMIT;
