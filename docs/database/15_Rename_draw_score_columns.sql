-- 14_Migration_v1_column_renames_and_descriptions.sql
-- Apply V1 STRUCTURE updates on ALREADY EXISTING databases.
-- Safe to run multiple times.

BEGIN;

-- 1) Ensure renamed draw-score columns exist in public.boards
ALTER TABLE public.boards
  ADD COLUMN IF NOT EXISTS score_challenge_draw_defender integer NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS score_challenge_draw_attacker integer NOT NULL DEFAULT -1;

-- 2) Ensure renamed draw-score columns exist in templates.boards
ALTER TABLE templates.boards
  ADD COLUMN IF NOT EXISTS score_challenge_draw_defender integer NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS score_challenge_draw_attacker integer NOT NULL DEFAULT -1;

-- 3) If old columns exist, copy data into new columns (when present)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'boards'
      AND column_name = 'score_challenge_draw_winner'
  ) THEN
    EXECUTE 'UPDATE public.boards
             SET score_challenge_draw_defender = score_challenge_draw_winner
             WHERE score_challenge_draw_winner IS NOT NULL';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'boards'
      AND column_name = 'score_challenge_draw_loser'
  ) THEN
    EXECUTE 'UPDATE public.boards
             SET score_challenge_draw_attacker = score_challenge_draw_loser
             WHERE score_challenge_draw_loser IS NOT NULL';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'templates'
      AND table_name = 'boards'
      AND column_name = 'score_challenge_draw_winner'
  ) THEN
    EXECUTE 'UPDATE templates.boards
             SET score_challenge_draw_defender = score_challenge_draw_winner
             WHERE score_challenge_draw_winner IS NOT NULL';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'templates'
      AND table_name = 'boards'
      AND column_name = 'score_challenge_draw_loser'
  ) THEN
    EXECUTE 'UPDATE templates.boards
             SET score_challenge_draw_attacker = score_challenge_draw_loser
             WHERE score_challenge_draw_loser IS NOT NULL';
  END IF;
END
$$;

-- 4) Drop old column names if they still exist
ALTER TABLE public.boards
  DROP COLUMN IF EXISTS score_challenge_draw_winner,
  DROP COLUMN IF EXISTS score_challenge_draw_loser;

ALTER TABLE templates.boards
  DROP COLUMN IF EXISTS score_challenge_draw_winner,
  DROP COLUMN IF EXISTS score_challenge_draw_loser;

COMMIT;
