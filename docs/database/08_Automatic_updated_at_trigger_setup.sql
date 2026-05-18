-- 1. Crear la función que actualiza el timestamp de forma segura
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER -- Ejecuta con los permisos del creador (admin)
SET search_path = public; -- Evita vulnerabilidades de búsqueda de esquemas

-- 2. Aplicar el trigger a cada tabla (idempotente)

-- Tabla de usuarios (profesores)
DROP TRIGGER IF EXISTS set_updated_at ON public.users;
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

-- Tabla de categorías
DROP TRIGGER IF EXISTS set_updated_at ON public.categories;
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.categories
    FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

-- Tabla de preguntas
DROP TRIGGER IF EXISTS set_updated_at ON public.questions;
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.questions
    FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

-- Tabla de tableros
DROP TRIGGER IF EXISTS set_updated_at ON public.boards;
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.boards
    FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

-- Tabla de partidas
DROP TRIGGER IF EXISTS set_updated_at ON public.games;
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.games
    FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

-- Tabla de equipos
DROP TRIGGER IF EXISTS set_updated_at ON public.teams;
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.teams
    FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();