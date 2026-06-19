-- ============================================================
-- MIGRATION: games.board_id RESTRICT -> CASCADE
-- Boards can be deleted and take their games with them.
-- Based on current production schema.
-- ============================================================

BEGIN;

ALTER TABLE public.games
  DROP CONSTRAINT IF EXISTS games_board_id_fkey;

ALTER TABLE public.games
  ADD CONSTRAINT games_board_id_fkey
  FOREIGN KEY (board_id)
  REFERENCES public.boards(id)
  ON DELETE CASCADE;

COMMIT;
