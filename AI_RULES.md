# AI Development Rules

This document provides guidelines for the AI developer to follow when working on this project. The goal is to maintain code quality, consistency, and predictability.

## Tech Stack

This project is built with a modern, type-safe, and component-based stack:

-   **Framework**: React with Vite for a fast development experience.
-   **Language**: TypeScript for static typing and improved code quality.
-   **UI Components**: shadcn/ui, a collection of beautifully designed, accessible, and reusable components.
-   **Styling**: Tailwind CSS for a utility-first styling approach. All styling should be done via Tailwind classes.
-   **Routing**: React Router (`react-router-dom`) for all client-side routing.
-   **Data Fetching & State**: TanStack Query (`@tanstack/react-query`) for managing server state, caching, and asynchronous operations.
-   **Forms**: React Hook Form (`react-hook-form`) for building performant and flexible forms, paired with Zod for schema validation.
-   **Icons**: Lucide React (`lucide-react`) is the exclusive icon library for this project.
-   **Notifications**: Sonner is used for displaying toast notifications for user feedback.

## Development Rules & Library Usage

1.  **UI Components**:
    -   **ALWAYS** use components from the `shadcn/ui` library (located in `src/components/ui`).
    -   If a required component does not exist in the library, create a new, reusable component in `src/components` following the existing style and structure.
    -   **DO NOT** introduce other UI libraries like Material UI, Ant Design, or Bootstrap.

2.  **Styling**:
    -   All styling **MUST** be done using Tailwind CSS utility classes.
    -   Use the `cn` utility function from `src/lib/utils.ts` to conditionally apply classes.
    -   Avoid writing custom CSS in `.css` files. The existing `index.css` is for global styles and variable definitions only.

3.  **File Structure**:
    -   **Pages**: Place all top-level page components in `src/pages`.
    -   **Components**: Place all reusable components in `src/components`. Create subdirectories for complex components if necessary.
    -   **Utilities**: Place general helper functions in `src/lib/utils.ts` or other files within `src/utils`.
    -   **Hooks**: Custom hooks should be placed in the `src/hooks` directory.

4.  **Routing**:
    -   All application routes are managed in `src/App.tsx` using `<BrowserRouter>`.
    -   When adding a new page, add a new `<Route>` entry in `App.tsx`.

5.  **State Management**:
    -   For server state, asynchronous data, caching, and mutations, **ALWAYS** use TanStack Query.
    -   For simple, local component state, use React's built-in `useState` and `useReducer` hooks.
    -   **DO NOT** add global state management libraries like Redux or Zustand without explicit instruction.

6.  **Forms**:
    -   Use `react-hook-form` for all form implementations.
    -   Define form schemas and validation rules using `zod`.

7.  **Icons**:
    -   Use icons **ONLY** from the `lucide-react` package.

8.  **Notifications**:
    -   Provide user feedback for actions (e.g., success, error) using the `sonner` toast component.