-- Migration: board_category only stores playable board tiles.
-- Start (0) and goal (30) are rendered by the app and are not stored here.
ALTER TABLE public.board_category
  DROP CONSTRAINT IF EXISTS valid_square_position;

ALTER TABLE public.board_category
  ADD CONSTRAINT valid_square_position CHECK (position > 0 AND position < 30);
