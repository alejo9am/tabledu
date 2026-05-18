-- 1. Creamos la función que hace de "bisturí automático"
CREATE OR REPLACE FUNCTION public.cleanup_user_data()
RETURNS trigger AS $$
BEGIN
  -- 1. Liberar las categorías borrando el layout del tablero (board_category)
  DELETE FROM public.board_category 
  WHERE board_id IN (SELECT id FROM public.boards WHERE user_id = OLD.id);

  -- 2. Liberar las categorías borrando sus preguntas (questions)
  DELETE FROM public.questions 
  WHERE user_id = OLD.id;

  -- 3. Liberar los tableros borrando sus partidas (games)
  -- Nota: Al borrar games, se borrarán en cascada teams y answers automáticamente
  DELETE FROM public.games 
  WHERE user_id = OLD.id;

  -- Ahora sí, el camino está totalmente despejado para que el DELETE CASCADE
  -- borre toda la informacion del user
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. Enganchamos la función al evento de borrado de la tabla users
DROP TRIGGER IF EXISTS trigger_cleanup_user_data ON public.users;
CREATE TRIGGER trigger_cleanup_user_data
BEFORE DELETE ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.cleanup_user_data();