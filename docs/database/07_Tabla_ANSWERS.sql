-- Tabla de Historial: Registro de interacciones en tiempo real
CREATE TABLE IF NOT EXISTS public.answers (
  question_id uuid NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  game_id uuid NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
  
  -- Equipo que dio la respuesta
  team_id uuid NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  
  -- Resultado de la respuesta
  is_correct boolean NOT NULL,

  -- La PK compuesta asegura que una pregunta no se repita en la misma partida
  PRIMARY KEY (question_id, game_id)
);