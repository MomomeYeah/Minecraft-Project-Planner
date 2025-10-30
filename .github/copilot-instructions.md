# AI Agent Instructions for Minecraft Project Planner

## Project Overview
This is a Next.js application for planning Minecraft projects, built with React and TypeScript. It uses Drizzle ORM with PostgreSQL for data management and Tailwind CSS with Radix UI components for styling.

## Key Architecture Components

### Database Layer
- Uses Drizzle ORM with PostgreSQL
- Schema definitions in `app/lib/db/schema/*.ts`
- Database connection configured in `app/lib/db/drizzle.ts`
- Environment variables expected in `.env` (POSTGRES_URL)

### Frontend Architecture
- Next.js App Router architecture (`app/` directory)
- Pages:
  - Home (`app/page.tsx`)
  - Items (`app/items/page.tsx`)
  - Builds (`app/builds/page.tsx`)
  - Farms (`app/farms/page.tsx`)
- Shared UI components in `components/ui/`
- Theme handling via `next-themes` with dark mode support

## Development Workflow

### Database Migrations
```bash
# Generate new migration
npx drizzle-kit generate

# Apply migrations to database
npx drizzle-kit migrate

# Quick updates during development
npx drizzle-kit push
```

### Local Development
```bash
# Start development server
npm run dev
```

## Project Conventions

### Component Organization
- Core UI components in `components/ui/` are based on ShadCN components
- Page-specific components in `app/ui/`
- Shared hooks in `hooks/` directory

### Styling Patterns
- Uses Tailwind CSS with ShadCN components
- Component variants defined using `class-variance-authority`
- Dark mode support via `next-themes`
- ShadCN components extend Radix UI primitives
- Custom modifications to ShadCN components:
  - Pagination component uses Next.js Link instead of anchor tags
  - Other components maintain ShadCN's base functionality with minor tweaks

### Data Management
- Database schema defined using Drizzle ORM
- Each table has a corresponding schema file in `app/lib/db/schema/`
- Type inference using `$inferSelect` from Drizzle

## Integration Points
- Database: PostgreSQL via Drizzle ORM
- UI Components: Radix UI primitives
- Styling: Tailwind CSS with custom components
- Theme: `next-themes` for dark/light mode

## Common Patterns
- Use `"use client"` directive for client-side components
- Pages follow Next.js 13+ App Router conventions
- Reusable UI components are built on Radix UI primitives
- Database operations use Drizzle ORM's type-safe queries

## Examples

### Creating a New Page
See `app/items/page.tsx` for page structure example:
```tsx
"use client";
// Import components and data hooks
// Define page component with proper type safety
```

### Adding UI Components
See `components/ui/button.tsx` for component patterns:
- Use `class-variance-authority` for variants
- Extend Radix UI primitives when needed
- Include proper TypeScript types

### Database Operations
See `app/lib/db/schema/items.ts` for schema definition:
```typescript
import { uuid, text, pgTable } from "drizzle-orm/pg-core";
export const Item = pgTable("items", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("text").notNull(),
  item_id: text("item_id").notNull(),
});
```