-- Practice attempts: what a mentee actually wrote when solving a question.
--
-- NOT YET RUN. Applying this is a change to the live Neon database and needs
-- Khushi's explicit go-ahead.
--
-- Why it exists: attempts currently live in the browser's localStorage, so they
-- are per-device, invisible to us, and lost when someone clears their browser.
-- Moving them here means a student's working follows them to their phone, a
-- mentor can read it before a call, and we can see which questions the pilot
-- cohort actually struggles with.
--
-- To apply:  psql "$DATABASE_URL" -f migrations/001_practice_attempts.sql

CREATE TABLE IF NOT EXISTS practice_attempts (
  id            SERIAL PRIMARY KEY,
  mentee_id     INTEGER     NOT NULL REFERENCES mentees(id) ON DELETE CASCADE,

  -- Track and question are the slugs from app/lib/practice, not foreign keys.
  -- Content ships with the deploy, so there is no questions table to join to.
  track         TEXT        NOT NULL,
  question      TEXT        NOT NULL,

  -- The three scratchpad fields, kept separate because that is how the answer
  -- is marked and how a mentor would want to read it.
  assumptions   TEXT,
  working       TEXT,
  answer        TEXT,

  -- Seconds actually spent, so we can see which questions run over their box.
  seconds_taken INTEGER,

  submitted_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- One row per mentee per question. Re-attempting updates the existing row
-- rather than accumulating history, which keeps "your answers" simple.
CREATE UNIQUE INDEX IF NOT EXISTS practice_attempts_unique
  ON practice_attempts (mentee_id, track, question);

-- Serves the mentee's own list and the mentor's pre-call view.
CREATE INDEX IF NOT EXISTS practice_attempts_by_mentee
  ON practice_attempts (mentee_id, submitted_at DESC);

-- Serves "which questions is the cohort struggling with", which is the
-- pain-point data the IIT Jodhpur pilot was meant to produce.
CREATE INDEX IF NOT EXISTS practice_attempts_by_question
  ON practice_attempts (track, question);
