-- Allow deleting a question tile to atomically delete its question bank.
-- Board layouts still use ON DELETE RESTRICT, so tiles assigned to boards remain protected.

BEGIN;

ALTER TABLE public.questions
  DROP CONSTRAINT IF EXISTS questions_tile_id_fkey;

ALTER TABLE public.questions
  ADD CONSTRAINT questions_tile_id_fkey
  FOREIGN KEY (tile_id)
  REFERENCES public.tiles(id)
  ON DELETE CASCADE;

COMMIT;
