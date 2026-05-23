-- ============================================================
-- Migracion: refactor del cleanup de usuario
-- Alineado con el nuevo modelo tiles / board_layouts
-- ============================================================

-- 1) Reemplazar la funcion de limpieza previa al borrado de users
CREATE OR REPLACE FUNCTION public.cleanup_user_data()
RETURNS trigger AS $$
BEGIN
  -- 1. Liberar los tiles borrando primero el layout de tableros del usuario
  DELETE FROM public.board_layouts
  WHERE board_id IN (SELECT id FROM public.boards WHERE user_id = OLD.id);

  -- 2. Liberar los tiles borrando sus preguntas
  DELETE FROM public.questions
  WHERE user_id = OLD.id;

  -- 3. Liberar los tableros borrando sus partidas
  -- Nota: al borrar games, se borran en cascada teams y answers
  DELETE FROM public.games
  WHERE user_id = OLD.id;

  -- Con esto, el DELETE CASCADE puede eliminar el resto de datos del user
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2) Reafirmar el trigger (idempotente)
DROP TRIGGER IF EXISTS trigger_cleanup_user_data ON public.users;

CREATE TRIGGER trigger_cleanup_user_data
BEFORE DELETE ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.cleanup_user_data();
