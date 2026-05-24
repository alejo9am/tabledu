-- Allow teachers to reuse identical question text across different tiles.
ALTER TABLE public.questions
  DROP CONSTRAINT IF EXISTS questions_text_user_id_key;

-- Allow repeated answers for the same question within a game.
-- Replaces composite PK (question_id, game_id) with surrogate id PK.
ALTER TABLE public.answers
  DROP CONSTRAINT IF EXISTS answers_pkey;

ALTER TABLE public.answers
  ADD COLUMN IF NOT EXISTS id uuid DEFAULT uuid_generate_v4();

UPDATE public.answers
SET id = uuid_generate_v4()
WHERE id IS NULL;

ALTER TABLE public.answers
  ADD CONSTRAINT answers_pkey PRIMARY KEY (id);

CREATE INDEX IF NOT EXISTS idx_answers_game_id ON public.answers (game_id);
