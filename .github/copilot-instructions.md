# GitHub Copilot Instructions for Eureka System (Pano)

## Project Overview

Eureka System is a comprehensive graduation services management platform that automates sales, production, inventory, and delivery workflows. The system is designed with an **offline-first architecture** to support vendors and production staff working in environments with limited or no internet connectivity.

## Technology Stack

### Frontend
- **Framework**: Next.js 15 (React 19)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query (React Query)
- **Offline Storage**: Dexie.js (IndexedDB wrapper)
- **API Communication**: tRPC (type-safe RPC)

### Backend
- **Framework**: Next.js API Routes
- **Database**: MySQL
- **ORM**: Drizzle ORM
- **Authentication**: NextAuth.js v5
- **Password Hashing**: bcryptjs

### Additional Libraries
- PDF Generation: @react-pdf/renderer
- Image Compression: browser-image-compression
- Signature Capture: react-signature-canvas
- Validation: Zod schemas

## Architecture Principles

### 1. Offline-First Design
- **All data operations must support offline mode**
- Use IndexedDB (via Dexie.js) for local storage
- Implement optimistic UI updates
- Queue operations for later synchronization
- Handle conflict resolution gracefully

### 2. Type Safety
- Use TypeScript for all code
- Define Zod schemas for validation
- Leverage tRPC for end-to-end type safety
- Never use `any` type unless absolutely necessary

### 3. Database Schema
The system uses a normalized MySQL database (3NF) with the following main entities:
- `events`: Graduation events
- `orders`: Customer orders
- `products`: Product catalog
- `customers`: Student/customer information
- `inventory`: Stock management
- `vendors`: Sales representatives
- `payments`: Payment records
- `commissions`: Vendor commission tracking

Refer to `ARQUITECTURA.md` for complete database schema.

## Coding Standards

### File Organization
- **Components**: Place in `/src/components` with descriptive names
- **Pages**: Use Next.js App Router in `/src/app`
- **Database**: Schema in `/src/db/schema`, queries in appropriate files
- **Utilities**: Place in `/src/lib/utils`
- **Hooks**: Custom hooks in `/src/hooks`
- **Offline Logic**: All offline-related code in `/src/lib/offline`

### Naming Conventions
- **Files**: Use kebab-case for file names (e.g., `sync-manager.ts`)
- **Components**: Use PascalCase (e.g., `OrderForm.tsx`)
- **Functions**: Use camelCase (e.g., `createOrder`)
- **Constants**: Use UPPER_SNAKE_CASE (e.g., `MAX_RETRY_ATTEMPTS`)
- **Types/Interfaces**: Use PascalCase with descriptive names

### React/Next.js Best Practices
- Use Server Components by default
- Add `"use client"` directive only when needed (state, effects, browser APIs)
- Prefer composition over prop drilling
- Use TypeScript function components with explicit return types
- Implement proper error boundaries
- Use React Suspense for async operations

### Database & ORM
- Use Drizzle ORM for all database operations
- Define schema in `/src/db/schema/index.ts`
- Use transactions for operations that modify multiple tables
- Implement proper indexes for frequently queried fields
- Use prepared statements to prevent SQL injection

### Offline Sync Implementation
When implementing offline features:
1. Save data to IndexedDB first
2. Add operation to sync queue
3. Update UI optimistically
4. Sync when connection is available
5. Handle conflicts with appropriate strategy:
   - `server-wins`: Server data takes precedence
   - `client-wins`: Local changes take precedence
   - `auto-merge`: Merge non-conflicting fields
   - `manual`: Prompt user for resolution

### State Management
- Use React Query for server state
- Use React hooks (useState, useReducer) for UI state
- Implement custom hooks for reusable logic
- Cache frequently accessed data
- Invalidate cache appropriately after mutations

### Error Handling
- Always handle errors gracefully
- Provide user-friendly error messages
- Log errors for debugging
- Use try-catch blocks for async operations
- Implement retry logic for network requests

### Security
- Never commit sensitive data (API keys, passwords)
- Use environment variables for configuration
- Sanitize user inputs to prevent XSS attacks
- Validate all inputs with Zod schemas before processing
- Implement proper authentication checks using NextAuth.js
- Enforce role-based access control (RBAC)
- Use HTTPS in production
- Hash passwords with bcryptjs (never store plain text)
- Implement CSRF protection
- Use secure session management

### Performance
- Optimize images before upload
- Implement pagination for large datasets
- Use lazy loading for components
- Minimize bundle size
- Cache static assets
- Use IndexedDB for offline data storage

## Common Workflows

### Creating a New Feature
1. Define data schema in Drizzle if needed
2. Create tRPC router/procedure
3. Implement offline support (IndexedDB schema, sync logic)
4. Create UI components
5. Add validation with Zod
6. Test offline/online scenarios
7. Handle error cases

### Adding a Database Table
1. Define schema in `/src/db/schema/index.ts`
2. Run `npm run db:generate` to create migration
3. Run `npm run db:migrate` or `npm run db:push`
4. Add corresponding IndexedDB table in `/src/lib/offline/db.ts`
5. Update sync manager if needed

### Implementing Offline Sync
1. Add operation to sync queue using `syncQueueManager.addToQueue()`
2. Implement conflict resolution strategy
3. Test sync with network throttling
4. Handle edge cases (partial sync, errors)

## Development Commands

```bash
# Development
npm run dev              # Start development server

# Database
npm run db:generate      # Generate Drizzle migrations
npm run db:migrate       # Run migrations
npm run db:push          # Push schema changes directly
npm run db:studio        # Open Drizzle Studio
npm run db:seed          # Seed database with test data

# Build & Deploy
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
```

## Testing Guidelines

### Manual Testing
- Test both online and offline scenarios
- Verify sync functionality with network throttling
- Test conflict resolution
- Validate form inputs
- Test error handling
- Verify responsive design

### Browser DevTools
- Use Network tab → Throttling → Offline to simulate offline mode
- Check Application → IndexedDB → EurekaDB to inspect local data
- Monitor console for errors and warnings

## Key Files to Reference

- `ARQUITECTURA.md`: Complete system architecture and database schema
- `OFFLINE_ARCHITECTURE.md`: Offline-first implementation details
- `/src/db/schema/index.ts`: Database schema definitions
- `/src/lib/offline/`: Offline sync implementation
- `drizzle.config.ts`: Database configuration

## Common Pitfalls to Avoid

1. **Don't bypass offline support**: All CRUD operations must work offline
2. **Don't ignore TypeScript errors**: Fix type issues, don't use `any`
3. **Don't forget validation**: Always validate inputs with Zod
4. **Don't skip error handling**: Handle all error cases gracefully
5. **Don't commit `.env` files**: Use `.env.example` for documentation
6. **Don't modify working code unnecessarily**: Make minimal, focused changes
7. **Don't ignore sync conflicts**: Implement proper resolution strategies

## Additional Notes

- The system is designed for Spanish-speaking users (UI may contain Spanish text)
- Focus on reliability and offline capability
- Prioritize data integrity and consistency
- Consider low-bandwidth scenarios
- Support multiple user roles (admin, vendor, production staff)

## Questions or Issues?

When unsure about implementation details:
1. Check existing patterns in the codebase
2. Refer to architecture documentation
3. Follow TypeScript and React best practices
4. Maintain consistency with existing code style
5. Ask for clarification before making significant architectural changes
