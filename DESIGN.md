# Sistema de Diseño — Tabledu

## 1. Identidad de Marca y Filosofía

**Tabledu** es una plataforma web para la creación de juegos de mesa educativos en el aula. Está diseñada para que los profesores puedan transformar contenidos académicos en experiencias lúdicas de forma sencilla y profesional.

- **Claim Principal:** Aprender jugando nunca fue tan fácil.
- **Claim Secundario:** Haz de tu asignatura un juego de mesa.
- **Audiencia:** Profesores (creadores) y Alumnos (jugadores).
- **Personalidad:** Cercana, Divertida, Seria y Accesible.
- **Tono de Voz:** Directo y claro. Uso de verbos de acción (crea, lanza, configura, juega).

---

## 2. Tipografía (Estrategia 60-30-10)

Equilibrio entre la legibilidad de una herramienta de trabajo y la amigabilidad de un juego.

| Peso | Fuente | Clase Tailwind | Uso |
| :--- | :--- | :--- | :--- |
| **60% — UI & Body** | `Figtree Variable` | `font-sans` | Textos generales, párrafos, etiquetas, botones y formularios. Moderna, limpia y altamente legible. |
| **30% — Display** | `Fredoka Variable` | `font-display` | Títulos de sección (H1, H2), números de casillas, marcadores de puntuación y elementos destacados. Redondeada y juguetona. |
| **10% — Marca** | `Fredoka` *(provisional)* | — | Logotipo principal y titulares hero. Se reserva este espacio para una fuente de mayor impacto si se requiere (ej. DynaPuff). |

---

## 3. Paleta de Color (Sistema Semántico Triádico)

Colores vivos inspirados en los juegos de mesa clásicos, con variantes optimizadas para modo claro y oscuro.

### Colores de Acción

| Rol | Light | Dark | Notas |
| :--- | :--- | :--- | :--- |
| **Primary** | `#3f74c6` | `#4f83d4` | Color principal de marca (Azul). |
| **Destructive** | `#e65747` | `#ef6a5c` | Errores y respuestas incorrectas (Rojo). |
| **Warning** | `#f2d247` | `#f3d85d` | Alertas y elementos de atención (Amarillo). |
| **Success** | `#22c55e` | `#22c55e` | Aciertos y confirmaciones (Verde). |

### Escalas Técnicas de Color

Los tokens CSS exponen variantes claras, medias y oscuras de la triada para estados, fondos suaves, bordes y elementos interactivos.

| Familia | Tokens |
| :--- | :--- |
| **Primary** | `primary`, `primary-200`, `primary-350`, `primary-700`, `primary-850`, `primary-foreground` |
| **Warning** | `warning`, `warning-200`, `warning-350`, `warning-700`, `warning-850`, `warning-foreground` |
| **Destructive** | `destructive`, `destructive-200`, `destructive-350`, `destructive-700`, `destructive-850`, `destructive-foreground` |
| **Success** | `success`, `success-200`, `success-700`, `success-foreground` |

### Superficies y Neutros

| Rol | Light | Dark | Notas |
| :--- | :--- | :--- | :--- |
| **Background** | `#f8fafc` | `#0f172a` | Color de fondo principal. |
| **Foreground** | `#0f172a` | `#f8fafc` | Color base del texto. |
| **Card / Popover** | `#ffffff` | `#1e293b` | Superficies de componentes. |
| **Sketch Dot** | `#e2e8f0` | `#1e293b` | Color de la cuadrícula de puntos del fondo. |
| **Border** | `#e2e8f0` | `#243041` | Bordes sutiles de UI. |

### Tokens Semánticos Adicionales

Además de la triada principal, Tailwind expone los tokens `secondary`, `muted`, `accent`, `input`, `ring`, `border-dark`, `chart-1..5` y `sidebar-*`. Usar estos tokens antes de introducir nuevos colores evita duplicar valores y mantiene compatibilidad con modo claro/oscuro.

---

## 4. Iconografía

- **Librería:** `hugeicons`
- **Estilo:** Stroke / Outline (líneas).
- **Variante:** Rounded (esquinas redondeadas para suavizar la interfaz).
- **Grosor:** `2px` constante para garantizar visibilidad y cohesión con la tipografía.

---

## 5. Superficies y Estructura

### Estilo Visual "Libreta"

El fondo de la aplicación utiliza un patrón de puntos que fusiona el concepto de aula con el de tablero de juego.

```css
background-image: radial-gradient(var(--sketch-dot) 2px, transparent 0);
background-size: 28px 28px;
```

### Sistema de Radios

Basado en un multiplicador de `0.625rem`:

| Token | Valor | Uso |
| :--- | :--- | :--- |
| `sm` | 0.375rem | Elementos pequeños e insignias. |
| `md` | 0.5rem | Botones y tarjetas estándar. |
| `lg` | 0.625rem | Base. |
| `xl` | 0.875rem | Tarjetas y contenedores destacados. |
| `2xl` | 1.125rem | Superficies grandes y paneles de wizard. |
| `3xl` | 1.375rem | Contenedores visuales amplios. |
| `4xl` | 1.625rem | Botones o superficies muy redondeadas. |
| `tile` | 3.125rem | Casillas circulares/redondeadas del tablero. |

---

## 6. Integración Técnica (shadcn/ui)

- **Base:** `radix-maia` con personalización de variables CSS.
- **Herencia:** Los componentes de shadcn usan por defecto `font-sans` (Figtree).
- **Intervención:** `font-display` (Fredoka) se aplica solo en componentes de visualización de datos o elementos puramente interactivos del juego, para mantener el equilibrio entre herramienta y juego.
