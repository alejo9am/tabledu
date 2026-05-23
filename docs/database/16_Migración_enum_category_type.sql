-- ============================================================
-- Migración: enum category_type + limpieza de provisioning
-- ============================================================
-- 1. Sustituye 'special' por 'attack'/'pipe'/'challenge' en el enum.
-- 2. Simplifica handle_new_user (elimina el clonado de templates).
-- 3. Elimina el schema templates, sustituido por public_boards.
-- ============================================================


-- 1. Nuevo enum con valores semánticos
-- (PostgreSQL no permite ALTER TYPE para añadir/eliminar valores en uso,
--  hay que crear uno nuevo y reemplazar)

CREATE TYPE category_type_new AS ENUM ('question', 'attack', 'pipe', 'challenge');

-- Eliminar DEFAULT antes del cast (el valor por defecto es del tipo antiguo)
ALTER TABLE public.categories    ALTER COLUMN type DROP DEFAULT;
ALTER TABLE templates.categories ALTER COLUMN type DROP DEFAULT;

-- Migrar public.categories: 'special' se mapea por name
ALTER TABLE public.categories
  ALTER COLUMN type TYPE category_type_new
  USING (
    CASE type::text
      WHEN 'question' THEN 'question'
      WHEN 'special' THEN
        CASE name
          WHEN 'Attack'    THEN 'attack'
          WHEN 'Pipe'      THEN 'pipe'
          WHEN 'Challenge' THEN 'challenge'
          ELSE NULL -- Forzará error si hay algún 'special' con name desconocido
        END
    END
  )::category_type_new;

-- Migrar templates.categories (misma lógica)
ALTER TABLE templates.categories
  ALTER COLUMN type TYPE category_type_new
  USING (
    CASE type::text
      WHEN 'question' THEN 'question'
      WHEN 'special' THEN
        CASE name
          WHEN 'Attack'    THEN 'attack'
          WHEN 'Pipe'      THEN 'pipe'
          WHEN 'Challenge' THEN 'challenge'
          ELSE NULL
        END
    END
  )::category_type_new;

DROP TYPE category_type;
ALTER TYPE category_type_new RENAME TO category_type;

-- Restaurar DEFAULT con el tipo ya renombrado
ALTER TABLE public.categories    ALTER COLUMN type SET DEFAULT 'question';
ALTER TABLE templates.categories ALTER COLUMN type SET DEFAULT 'question';


-- 2. Simplificar handle_new_user
-- El clonado automático desde templates.* ya no es necesario;
-- el usuario importará manualmente desde public_boards.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, username, name, surname)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', 'profesor_' || substr(new.id::text, 1, 8)),
    COALESCE(new.raw_user_meta_data->>'name', 'Profesor'),
    COALESCE(new.raw_user_meta_data->>'surname', 'Invitado')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
-- El trigger on_auth_user_created no necesita recrearse.


-- 3. Eliminar schema templates
-- CASCADE borra templates.boards, categories, questions y board_category.

DROP SCHEMA IF EXISTS templates CASCADE;