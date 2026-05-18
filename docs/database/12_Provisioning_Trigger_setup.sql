CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- 1. Crear el perfil del profesor en public.users
  INSERT INTO public.users (id, username, name, surname)
  VALUES (
    new.id, 
    -- Si no hay username, generamos uno temporal basado en su ID
    COALESCE(new.raw_user_meta_data->>'username', 'profesor_' || substr(new.id::text, 1, 8)),
    -- Si no hay nombre/apellido, ponemos valores genéricos
    COALESCE(new.raw_user_meta_data->>'name', 'Profesor'),
    COALESCE(new.raw_user_meta_data->>'surname', 'Invitado')
  );

  -- 2. Clonar Categorías (Incluyendo el campo icon para futura compatibilidad)
  INSERT INTO public.categories (name, type, description, icon, user_id)
  SELECT name, type, description, icon, new.id
  FROM templates.categories;

  -- 3. Clonar Tableros
  INSERT INTO public.boards (
    name, description, score_correct, score_incorrect, 
    score_attack, score_challenge_winner, score_challenge_loser, 
    score_challenge_draw_defender, score_challenge_draw_attacker, user_id
  )
  SELECT 
    name, description, score_correct, score_incorrect, 
    score_attack, score_challenge_winner, score_challenge_loser, 
    score_challenge_draw_defender, score_challenge_draw_attacker, new.id
  FROM templates.boards;

  -- 4. Clonar Preguntas (Vinculando con las nuevas categorías de public del usuario)
  INSERT INTO public.questions (text, answer, category_id, user_id)
  SELECT 
    t_q.text, 
    t_q.answer, 
    p_c.id, -- El UUID recién generado en public.categories
    new.id
  FROM templates.questions t_q
  JOIN templates.categories t_c ON t_q.category_id = t_c.id
  JOIN public.categories p_c ON p_c.name = t_c.name AND p_c.user_id = new.id;

  -- 5. Clonar Layout del Tablero (board_category)
  INSERT INTO public.board_category (board_id, category_id, position)
  SELECT 
    p_b.id, -- El UUID del tablero clonado
    p_c.id, -- El UUID de la categoría clonada
    t_bc.position
  FROM templates.board_category t_bc
  JOIN templates.boards t_b ON t_bc.board_id = t_b.id
  JOIN templates.categories t_c ON t_bc.category_id = t_c.id
  -- Hacemos el puente con los registros de este usuario específico
  JOIN public.boards p_b ON p_b.name = t_b.name AND p_b.user_id = new.id
  JOIN public.categories p_c ON p_c.name = t_c.name AND p_c.user_id = new.id;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;