-- Paso 3: Categorías y Preguntas
-- 1. Tabla de Categorías (Organización del contenido del profesor)
CREATE TABLE IF NOT EXISTS public.categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name varchar(50) NOT NULL,
  type category_type DEFAULT 'question' NOT NULL, -- Usa el Enum del Paso 1
  icon varchar(100) NOT NULL,
  description text,
  
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,

  UNIQUE(name, user_id) -- IA: Nombre único por profesor
);

-- 2. Tabla de Preguntas (El reto educativo)
CREATE TABLE IF NOT EXISTS public.questions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  text text NOT NULL,
  answer boolean NOT NULL, -- Verdadero o Falso
  justification text, -- Mejora pedagógica
  
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  category_id uuid NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
  
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,

  UNIQUE(text, user_id) -- IA: No repetir preguntas por profesor
);