-- Tabla de Tableros: Define las reglas y puntuaciones de cada juego
CREATE TABLE IF NOT EXISTS public.boards (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name varchar(100) NOT NULL,
  description text,

  -- Puntuaciones por defecto basadas en las mecánicas de Cyberpatrol
  score_correct integer NOT NULL DEFAULT 3,
  score_incorrect integer NOT NULL DEFAULT -1,
  score_attack integer NOT NULL DEFAULT -5,
  score_challenge_winner integer NOT NULL DEFAULT 5,
  score_challenge_loser integer NOT NULL DEFAULT -3,
  score_challenge_draw_defender integer NOT NULL DEFAULT 1,
  score_challenge_draw_attacker integer NOT NULL DEFAULT -1,

  -- Relación con el profesor creador
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,

  -- Trazabilidad con NOT NULL
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,

  -- IA: Nombre de tablero único por cada profesor
  UNIQUE(name, user_id)
);