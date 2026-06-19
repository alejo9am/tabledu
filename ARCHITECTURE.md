# Convenciones de Arquitectura Frontend

Este documento define la estructura de carpetas y los límites de responsabilidad del código React en `src/`.

## 1. Objetivos

- Mantener las features autónomas y fáciles de escalar.
- Hacer explícita la propiedad de cada ruta.
- Evitar mezcla de responsabilidades en carpetas genéricas.

## 2. Principio Central

Organizar por **feature**, luego por **ruta**.

```text
src/features/
  <feature>/
    routes/
      <RouteName>/
        <RouteName>.route.jsx
        components/
        hooks/
    components/
    hooks/
    utils/
    constants/
    context/
```

## 3. Reglas de Propiedad

- Si un componente o hook es usado por una sola ruta, vive dentro de esa carpeta de ruta.
- Si es usado por varias rutas de la misma feature, sube a la raíz de la feature.
- Si se usa en varias features, pasa a las carpetas globales compartidas:
  - `src/components`
  - `src/lib`
  - `src/services`

## 4. Convenciones de Nomenclatura

- Archivos de entrada de ruta: `*.route.jsx`
- Pantallas internas de una ruta: `*.page.jsx`, nombradas por responsabilidad cuando el contexto de la carpeta ya identifica la ruta (por ejemplo, `SpecialTiles.page.jsx`, `QuestionTiles.page.jsx`).
- Secciones o fragmentos específicos de ruta: `*.step.jsx` o nombres por responsabilidad
- Hooks de ruta o feature: `*.hook.js|jsx` (por ejemplo, `useTeamsSetup.hook.js`)

## 6. Anti-patrones a Evitar

- Carpetas de feature planas donde piezas de rutas no relacionadas se acumulan en un único `components/`.
- Imports profundos cruzados entre features hacia archivos locales de una ruta.
- Copiar lógica de ruta en lugar de extraer hooks o componentes compartidos de feature.
