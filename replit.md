# CasaVida - AI Growth & Marketing Intelligence Platform

## Overview

CasaVida is a full-stack web application serving as both a luxury home furniture brand website and an internal AI-powered marketing intelligence dashboard called "LivingMarket." The platform targets two distinct markets: Dubai (luxury/premium positioning) and India (modern + authentic positioning). The application combines a public-facing lifestyle brand experience with an internal dashboard for customer segmentation, CLV analysis, churn prediction, and AI-powered creative tools.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **Styling**: Tailwind CSS with custom theme variables supporting dark/light modes
- **UI Components**: shadcn/ui component library (New York style) built on Radix UI primitives
- **State Management**: TanStack React Query for server state
- **Animations**: Framer Motion for page transitions and micro-interactions
- **Fonts**: Playfair Display (luxury headings), Montserrat (body), Inter (dashboard UI)

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ESM modules
- **API Design**: RESTful endpoints under `/api/*` prefix
- **Build System**: Vite for frontend, esbuild for server bundling

### Database Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` (shared between client and server)
- **Validation**: Zod schemas generated from Drizzle schemas via drizzle-zod
- **Migrations**: Drizzle Kit with `db:push` command

### AI Integration
- **Provider**: OpenAI API (GPT for text, DALL-E for images, TTS for voice)
- **Features**: Marketing copy generation, product image generation, voice scripts
- **Fallback**: Mock data generation when API key is not configured

### Project Structure
```
client/           # React frontend
  src/
    pages/        # Route components (Home, Dubai, India, Login, dashboard/*)
    components/   # Reusable UI components
    context/      # React context providers (ThemeContext)
    hooks/        # Custom React hooks
    lib/          # Utilities and query client
server/           # Express backend
  routes.ts       # API route definitions
  storage.ts      # Database operations layer
  openai.ts       # AI service integration
  db.ts           # Database connection
shared/           # Shared code between client/server
  schema.ts       # Drizzle database schema + Zod types
```

### Key Design Patterns
- **Separation of concerns**: Public brand pages vs authenticated dashboard routes
- **Type safety**: End-to-end TypeScript with shared schema definitions
- **Component composition**: shadcn/ui primitives with project-specific styling
- **Theme system**: CSS custom properties with Tailwind for light/dark mode support

## External Dependencies

### Database
- **PostgreSQL**: Primary data store (requires DATABASE_URL environment variable)
- **connect-pg-simple**: Session storage for Express

### AI Services
- **OpenAI API**: Text generation (GPT), image generation (DALL-E), text-to-speech
- Requires OPENAI_API_KEY environment variable (optional - app works without it)

### Third-Party Libraries
- **@tanstack/react-query**: Server state management and caching
- **Radix UI**: Accessible component primitives (dialogs, dropdowns, tooltips, etc.)
- **Framer Motion**: Animation library
- **date-fns**: Date formatting utilities
- **Recharts/Plotly**: Data visualization (referenced in requirements)

### Development Tools
- **Vite**: Development server with HMR
- **Drizzle Kit**: Database schema management
- **Replit plugins**: Dev banner, cartographer, runtime error overlay