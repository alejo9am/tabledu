-- ============================================================
-- Migracion combinada:
-- 1) Enum category_type -> valores genericos de tiles
-- 2) Seed automatico de tiles especiales por usuario nuevo
-- ============================================================
-- Cambios de enum:
-- - attack    -> penalty
-- - pipe      -> reroll
-- - challenge -> duel
-- ============================================================

BEGIN;

-- 1) Crear enum temporal con nuevos valores
CREATE TYPE category_type_new AS ENUM ('question', 'penalty', 'reroll', 'duel');

-- 2) Quitar default para poder castear el tipo
ALTER TABLE public.tiles ALTER COLUMN type DROP DEFAULT;

-- 3) Migrar valores existentes
ALTER TABLE public.tiles
  ALTER COLUMN type TYPE category_type_new
  USING (
    CASE type::text
      WHEN 'question' THEN 'question'
      WHEN 'attack' THEN 'penalty'
      WHEN 'pipe' THEN 'reroll'
      WHEN 'challenge' THEN 'duel'
      ELSE NULL
    END
  )::category_type_new;

-- 4) Reemplazar enum anterior
DROP TYPE category_type;
ALTER TYPE category_type_new RENAME TO tile_type;

-- 5) Restaurar default
ALTER TABLE public.tiles ALTER COLUMN type SET DEFAULT 'question';

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, username, name, surname)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'profesor_' || substr(NEW.id::text, 1, 8)),
    COALESCE(NEW.raw_user_meta_data->>'name', 'Profesor'),
    COALESCE(NEW.raw_user_meta_data->>'surname', 'Invitado')
  );

  INSERT INTO public.tiles (name, type, icon, description, user_id)
  VALUES
    ('Penalty', 'penalty', 'system/hacker.png', 'Penalty! Your team loses points.', NEW.id),
    ('Reroll', 'reroll', 'system/pipe.png', 'Lucky break! Roll the dice again.', NEW.id),
    ('Duel', 'duel', 'system/swords.png', 'Duel time. Challenge a rival team.', NEW.id)
  ON CONFLICT (name, user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- El trigger on_auth_user_created sigue siendo el mismo y
-- no necesita recrearse.

COMMIT;
