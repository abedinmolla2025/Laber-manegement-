# Labor Management System

## Overview

A web-based labor management application designed to track worker duties, advance payments, and automatically calculate net payable amounts. The system provides a clean, data-focused interface for managing daily labor records with support for Bengali language users.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System:**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server with HMR support
- Client-side routing using Wouter (lightweight alternative to React Router)
- Path aliases configured for clean imports (`@/`, `@shared/`, `@assets/`)

**UI Component Strategy:**
- Radix UI primitives for accessible, unstyled components
- shadcn/ui design system following "new-york" style variant
- Tailwind CSS for utility-first styling with custom design tokens
- Theme system supporting light/dark modes with CSS variables
- Component library includes dialogs, tables, forms, toasts, and data displays

**State Management:**
- TanStack Query (React Query) for server state management
- Local state with React hooks for UI interactions
- No global state library - relying on composition and prop drilling

**Design System:**
- Professional SaaS aesthetic inspired by Linear and Notion
- Neutral color palette with semantic color variables
- Inter font family with Noto Sans Bengali for multilingual support
- Consistent spacing scale (2, 4, 6, 8, 12, 16, 20 units)
- Custom elevation system with hover/active states

### Backend Architecture

**Server Framework:**
- Express.js with TypeScript for API routes
- HTTP server creation with native Node.js `http` module
- Custom middleware for request/response logging
- Error handling middleware for consistent error responses

**Development Setup:**
- Vite middleware integration for development HMR
- Separate build process for client (Vite) and server (esbuild)
- Environment-based configuration (development vs production)

**Data Storage Strategy:**
- In-memory storage implementation (`MemStorage`) for development
- Interface-based storage abstraction (`IStorage`) for easy swapping
- Designed to support future PostgreSQL integration via Drizzle ORM
- UUID-based entity identification

**API Design:**
- RESTful API pattern with `/api` prefix for all routes
- JSON request/response format
- Session-based authentication ready (connect-pg-simple configured)
- CRUD operations defined through storage interface

### Data Storage Solutions

**Current Implementation:**
- In-memory Map-based storage for users and entities
- Synchronous operations wrapped in async interface for consistency

**Planned Database Architecture:**
- PostgreSQL as primary database (Neon serverless driver configured)
- Drizzle ORM for type-safe database queries
- Schema-first approach with Zod validation integration
- Migration system configured in `drizzle.config.ts`

**Schema Design:**
- Users table with username/password authentication
- Labor entities with daily rates
- Duty entries tracking work performed (date, multiplier, calculated amount)
- Advance payment records (date, amount)
- All tables use UUID primary keys with PostgreSQL `gen_random_uuid()`

### Authentication & Authorization

**Authentication Setup:**
- User model with username/password fields
- Schema validation using drizzle-zod
- Session management infrastructure ready (connect-pg-simple)
- Cookie-based sessions planned for production

**Current State:**
- Basic user CRUD operations defined in storage interface
- Authentication middleware not yet implemented
- Frontend has no login/signup flows (to be added)

## External Dependencies

### Core Runtime Dependencies
- **React Ecosystem:** react, react-dom, @tanstack/react-query for UI and data fetching
- **UI Components:** Complete Radix UI suite for accessible primitives
- **Form Handling:** react-hook-form with @hookform/resolvers and Zod for validation
- **Styling:** tailwindcss, clsx, tailwind-merge for utility styling
- **Date Handling:** date-fns for date manipulation and formatting
- **PDF Generation:** jspdf and jspdf-autotable for generating labor reports

### Backend Dependencies
- **Framework:** express for HTTP server
- **Database:** @neondatabase/serverless (Neon PostgreSQL driver)
- **ORM:** drizzle-orm with drizzle-zod for schema validation
- **Session Store:** connect-pg-simple for PostgreSQL-backed sessions
- **Utilities:** nanoid for ID generation

### Development Dependencies
- **Build Tools:** vite, esbuild, @vitejs/plugin-react
- **TypeScript:** Full TypeScript setup with strict mode enabled
- **Replit Integration:** Custom Replit plugins for development experience
- **Type Checking:** TypeScript compiler for static analysis

### Database Configuration
- Drizzle Kit configured for PostgreSQL dialect
- Migration output directory: `./migrations`
- Schema location: `./shared/schema.ts`
- Database URL from environment variable `DATABASE_URL`

### Styling & Theming
- Tailwind CSS with custom configuration
- CSS variables for theme tokens (light/dark mode)
- PostCSS with autoprefixer for vendor prefixing
- Custom border radius values (9px, 6px, 3px)
- Elevation system using RGBA overlays