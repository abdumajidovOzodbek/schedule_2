# replit.md

## Overview

This is a university class schedule viewer application built for students at TIFT (Tashkent Institute of Finance and Technology). The app fetches lesson schedules from the HEMIS student portal API and displays them in a clean, organized interface with weekly and daily views. The application supports Uzbek language formatting for dates and lesson information.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack React Query for server state and caching
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style)
- **Animations**: Framer Motion for smooth UI transitions
- **Build Tool**: Vite with path aliases (@/ for client/src, @shared/ for shared)

### Backend Architecture
- **Runtime**: Node.js with Express (server/index.ts is currently empty)
- **Language**: TypeScript with ES modules
- **Build**: Custom esbuild script for production bundling with dependency optimization

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: shared/schema.ts (lessons table with subject, times, location, instructor)
- **Validation**: Zod with drizzle-zod for type-safe schema validation
- **Migrations**: Drizzle Kit with migrations stored in /migrations

### API Integration
- **Primary Data Source**: HEMIS student portal API (https://student.tift.uz/rest/v1/education/schedule)
- **Authentication**: Bearer token for HEMIS API calls
- **Fallback Strategy**: Local JSON file (client/src/hooks/data.json) when API fails
- **Data Transformation**: Raw HEMIS response mapped to internal Lesson schema in use-lessons hook

### Project Structure
```
client/           # React frontend
  src/
    components/   # UI components (shadcn + custom schedule components)
    hooks/        # Custom hooks (useLessons, useMobile, useToast)
    pages/        # Route pages (SchedulePage, NotFound)
    lib/          # Utilities (queryClient, cn helper)
server/           # Express backend (currently empty)
shared/           # Shared types/schemas between frontend and backend
script/           # Build scripts
```

## External Dependencies

### Database
- **PostgreSQL**: Connected via DATABASE_URL environment variable
- **Session Store**: connect-pg-simple for Express sessions (configured but not currently used)

### External APIs
- **HEMIS API**: University student portal for schedule data
  - Endpoint: https://student.tift.uz/rest/v1/education/schedule
  - Requires Bearer token authentication
  - Returns lesson data including subjects, times, rooms, and instructors

### UI Libraries
- **Radix UI**: Full suite of accessible primitive components
- **Lucide React**: Icon library
- **Embla Carousel**: Carousel component
- **date-fns**: Date formatting with Uzbek locale support

### Deployment
- **Vercel**: Configured via vercel.json with API rewrites and SPA fallback
- **Build Output**: dist/public for frontend, dist/index.cjs for backend