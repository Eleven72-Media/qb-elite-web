-- Video playback telemetry.
--
-- Existing video_completions only records the explicit "Mark Complete"
-- tap — it doesn't tell us whether someone pressed play, watched 5
-- seconds vs 15 minutes, or completed organically. This table captures
-- one row per *play session* with a running watched_seconds counter
-- updated every ~5s while the user is actively watching.
--
-- Primary purpose: answer "of users who started a free trial, what
-- fraction actually watched videos and for how long?" The dashboard
-- joins this to profiles.subscription_status + tier_upgraded_at to
-- bucket play events into the trial window.
--
-- Schema notes:
--  - One row per play session (each tap on play = new row), so
--    multi-session viewing of the same video is preserved. Aggregate
--    with SUM(watched_seconds) GROUP BY (user_id, video_id) when you
--    want lifetime watch time per video.
--  - watched_seconds is cumulative *active* playback (paused time
--    doesn't accrue), measured by the client via Vimeo Player.js
--    timeupdate events. Capped at video_duration_seconds when known.
--  - source distinguishes web / ios / android so we can attribute
--    engagement back to the funnel that drove signup.
--  - completed = client reported the `ended` event (reached natural
--    end), not the same as "Mark Complete" tap stored in
--    video_completions. Both signals are useful: ended = consumed the
--    content; completed = self-attested progress.

BEGIN;

CREATE TABLE IF NOT EXISTS public.video_play_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  video_id TEXT NOT NULL,
  video_type TEXT NOT NULL,
  source TEXT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_event_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  watched_seconds INTEGER NOT NULL DEFAULT 0,
  video_duration_seconds INTEGER,
  completed BOOLEAN NOT NULL DEFAULT FALSE
);

COMMENT ON TABLE public.video_play_events IS
  'One row per video play session. watched_seconds accrues only during active playback (paused time excluded). Aggregate across rows for total watch time.';

CREATE INDEX IF NOT EXISTS idx_video_play_events_user_started
  ON public.video_play_events (user_id, started_at DESC);

CREATE INDEX IF NOT EXISTS idx_video_play_events_started
  ON public.video_play_events (started_at DESC);

ALTER TABLE public.video_play_events ENABLE ROW LEVEL SECURITY;

-- Users can insert their own play events
CREATE POLICY "users insert own play events"
  ON public.video_play_events
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own play events (for the running watched_seconds tick)
CREATE POLICY "users update own play events"
  ON public.video_play_events
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can read their own play events (resume position, history)
CREATE POLICY "users read own play events"
  ON public.video_play_events
  FOR SELECT
  USING (auth.uid() = user_id);

-- Admins read everything for the engagement dashboards
CREATE POLICY "admins read all play events"
  ON public.video_play_events
  FOR SELECT
  USING (public.is_admin());

COMMIT;
