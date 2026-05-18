-- 1. ACTIVAR RLS EN TODAS LAS TABLAS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.board_category ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;

-- 2. POLÍTICAS PARA TABLAS CON USER_ID DIRECTO
-- El profesor solo gestiona sus propios datos

CREATE POLICY "Los profesores gestionan sus propios perfiles" 
ON public.users FOR ALL USING (auth.uid() = id);

CREATE POLICY "Los profesores gestionan sus propias categorías" 
ON public.categories FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Los profesores gestionan sus propias preguntas" 
ON public.questions FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Los profesores gestionan sus propios tableros" 
ON public.boards FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Los profesores gestionan sus propias partidas" 
ON public.games FOR ALL USING (auth.uid() = user_id);

-- 3. POLÍTICAS PARA TABLAS RELACIONADAS (Sin user_id directo)
-- Usamos subconsultas para verificar que el profesor es dueño del recurso padre

CREATE POLICY "Los profesores gestionan el layout de sus tableros" 
ON public.board_category FOR ALL USING (
  EXISTS (SELECT 1 FROM public.boards WHERE id = board_id AND user_id = auth.uid())
);

CREATE POLICY "Los profesores gestionan los equipos de sus partidas" 
ON public.teams FOR ALL USING (
  EXISTS (SELECT 1 FROM public.games WHERE id = game_id AND user_id = auth.uid())
);

CREATE POLICY "Los profesores gestionan las respuestas de sus partidas" 
ON public.answers FOR ALL USING (
  EXISTS (SELECT 1 FROM public.games WHERE id = game_id AND user_id = auth.uid())
);