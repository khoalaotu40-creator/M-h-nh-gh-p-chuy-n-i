# React 18+ Architecture Best Practices

## Context
Guidelines for building robust, scalable, and performant React applications.

## 1. Component Modularity
- Avoid monolithic components (like a 400+ line `App.tsx`).
- Extract distinct UI regions into separate files (e.g., `Sidebar.tsx`, `GlobeView.tsx`, `MapView.tsx`).
- Keep `App.tsx` as a "conductor" that manages global state and layout structure, passing state down as props.

## 2. Managing Effects (`useEffect`)
- **Avoid Cascading Renders**: DO NOT call `setState` synchronously within a `useEffect` body (e.g., resetting an array when a string becomes empty). This causes multiple render cycles and triggers ESLint errors (`react-hooks/set-state-in-effect`).
- **Better Pattern**: Handle state derivations directly in event handlers (`onChange`, `onClick`) so React can batch state updates efficiently.
  ```tsx
  // BAD:
  useEffect(() => { if (!query) setResults([]); }, [query]);
  
  // GOOD:
  onChange={(e) => {
    setQuery(e.target.value);
    if (!e.target.value) setResults([]);
  }}
  ```

## 3. Type Safety
- Centralize shared TypeScript interfaces and types in a `src/types.ts` file.
- Strictly type props for all components.
- Avoid using `any`. Use `unknown` for caught errors (`catch (err: unknown)`) and assert with `err instanceof Error` before accessing `.message`.
- Ensure library-specific objects are typed properly (e.g., extracting Leaflet boundary arrays).

## 4. UI/UX Polishing
- Implement smooth transitions (`transition-all duration-300`) for collapsible sidebars and responsive layouts.
- Provide visual feedback for asynchronous operations (Loading states, Error boundary banners).
