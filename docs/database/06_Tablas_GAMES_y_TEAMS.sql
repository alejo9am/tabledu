-- 1. Tabla de Partidas
CREATE TABLE IF NOT EXISTS public.games (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  pin varchar(10) UNIQUE NOT NULL,
  status game_status NOT NULL DEFAULT 'lobby',
  
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  board_id uuid NOT NULL REFERENCES public.boards(id) ON DELETE RESTRICT,
  
  -- Referencia al equipo que tiene el turno
  current_team_id uuid, 

  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- 2. Tabla de Equipos
CREATE TABLE IF NOT EXISTS public.teams (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name varchar(50) NOT NULL,
  score integer NOT NULL DEFAULT 0,
  position integer NOT NULL DEFAULT 0, -- Casilla actual del 0 al 30
  
  -- Lista flexible de miembros
  members jsonb NOT NULL, 
  
  game_id uuid NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,

  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,

  UNIQUE(name, game_id)
);

-- 3. Vinculamos el turno (FK circular)
-- Borramos si existe para que el script sea ejecutable varias veces
ALTER TABLE public.games DROP CONSTRAINT IF EXISTS games_current_team_id_fkey;

ALTER TABLE public.games 
ADD CONSTRAINT games_current_team_id_fkey 
FOREIGN KEY (current_team_id) REFERENCES public.teams(id) ON DELETE SET NULL;