# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# DreamCanvas AI Image Generator Development Guide

## Build & Development Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production (runs TypeScript compiler then Vite build)
- `npm run lint` - Run ESLint on codebase
- `npm run preview` - Preview production build locally

## Project Architecture

### Tech Stack
- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **State Management**: Redux Toolkit + React Query
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with custom styling
- **Animations**: Framer Motion
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **API Client**: Axios with interceptors

### Directory Structure
- `/src/components` - Reusable UI components
  - `/ui` - Base UI components (Button, Card, Input, etc.)
  - `/layout` - Layout components (Header, Footer)
  - `/generation` - Image generation related components
  - `/gallery` - Image gallery components
- `/src/pages` - Page components for routing
- `/src/services` - API services and data fetching
- `/src/store` - Redux store and slices
- `/src/types` - TypeScript type definitions
- `/src/hooks` - Custom React hooks
- `/src/lib` - Utility functions and helpers

### Design System
- **Colors**: Custom primary palette with semantic colors
- **Typography**: Inter for UI, JetBrains Mono for code
- **Spacing**: 8px base unit system
- **Components**: Consistent variants (default, secondary, ghost, gradient)
- **Dark Mode**: Full dark mode support with system preference

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

### State Management
- Use Redux Toolkit for global state (auth, images, UI, generation)
- Use React Query for server state and caching
- Local component state with useState for UI-only state
- Custom hooks for reusable stateful logic

### Formatting & Organization
- Use 2-space indentation
- Organize imports in sections: React, external libraries, internal modules
- Group related state values and handlers together
- Use named exports for utility functions and types
- Prefer const over let where possible
- Maintain consistent naming between related files and components

### Styling
- Use Tailwind CSS utility classes
- Leverage custom design system classes (transition-smooth, gradient-primary, etc.)
- Dark mode with `dark:` variants
- Mobile-first responsive design
- Use Framer Motion for animations
- Apply consistent spacing and border radius

### Performance
- Lazy load routes with React.lazy()
- Use React.memo for expensive components
- Implement virtual scrolling for large lists
- Optimize images with lazy loading
- Debounce user inputs where appropriate

### Error Handling
- Use try/catch for async operations
- Return typed error responses: `{data: T, error?: string}`
- Implement error boundaries for component errors
- Show user-friendly error messages with toast notifications
- Log errors to console with descriptive context

### API Integration
- Use centralized API client with interceptors
- Implement automatic retry logic for failed requests
- Handle auth token refresh automatically
- Type-safe API calls with Zod validation
- Proper loading and error states