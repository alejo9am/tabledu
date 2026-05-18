-- 1. Tabla de perfiles (creación segura)
-- Solo se crea si no existe; si ya existe, no dará error.
CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  username varchar(50) UNIQUE NOT NULL,
  name varchar(100) NOT NULL,
  surname varchar(100) NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- 2. Función para capturar los datos del registro
-- El OR REPLACE permite actualizar la lógica de la función si la vuelves a ejecutar.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, username, name, surname)
  VALUES (
    new.id, 
    -- Si no hay username, generamos uno temporal basado en su ID
    COALESCE(new.raw_user_meta_data->>'username', 'profesor_' || substr(new.id::text, 1, 8)),
    -- Si no hay nombre/apellido, ponemos valores genéricos
    COALESCE(new.raw_user_meta_data->>'name', 'Profesor'),
    COALESCE(new.raw_user_meta_data->>'surname', 'Invitado')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public;

-- 3. Trigger (borrado y creación para asegurar idempotencia)
-- PostgreSQL no soporta CREATE OR REPLACE TRIGGER, así que se limpia antes.
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();