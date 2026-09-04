-- Applied 2026-09-04 (Khushi approved running the critical fixes).
-- 1. Mentor approval gate: new mentor signups start unapproved and cannot
--    see the mentee directory until approved. Existing mentors (curated by
--    hand) are grandfathered in as approved.
-- 2. OTP attempt counter: a 6-digit code dies after 5 wrong guesses, which
--    closes the brute-force window regardless of IP rate limiting.

ALTER TABLE mentors ADD COLUMN IF NOT EXISTS approved BOOLEAN NOT NULL DEFAULT false;
UPDATE mentors SET approved = true;

ALTER TABLE mentors ADD COLUMN IF NOT EXISTS otp_attempts INT NOT NULL DEFAULT 0;
ALTER TABLE mentees ADD COLUMN IF NOT EXISTS otp_attempts INT NOT NULL DEFAULT 0;
