# AI Image Generator Development Guide

## Build & Development Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production (runs TypeScript compiler then Vite build)
- `npm run lint` - Run ESLint on codebase
- `npm run preview` - Preview production build locally

## Project Structure
- `/src/components` - Reusable UI components
- `/src/pages` - Page components for routing
- `/src/services` - API services and data fetching
- `/src/types` - TypeScript type definitions
- `/src/hooks` - Custom React hooks

## Code Style Guidelines

### TypeScript & React
- Use functional components with TypeScript: `React.FC<Props>`
- Define explicit interfaces for all props, state, and functions
- Props interfaces should be named `ComponentNameProps`
- Optional properties should use `?:` notation
- Use destructured props with clean formatting
- Export components as default at end of file
- Use React hooks for state management
- Follow React best practices with proper dependency arrays

### Formatting & Organization
- Use 2-space indentation
- Organize imports in sections: React, external libraries, internal modules
- Group related state values and handlers together
- Use named exports for utility functions and types
- Prefer const over let where possible
- Maintain consistent naming between related files and components

### Styling
- Use Tailwind CSS for styling components
- Leverage dark mode with `dark:` variants
- Follow mobile-first responsive design
- Use Framer Motion for animations
- Apply consistent spacing and typography

### Error Handling
- Use try/catch for async operations
- Return typed error responses: `{data: T, error?: string}`
- Log errors to console with descriptive messages
- Provide user-friendly error messages