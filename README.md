# Mono Repo Instance with Bun

A modern monorepo setup using Bun as the package manager and runtime, with Prisma for database management, Svelte for web UI, and authentication models.

## 🚀 Features

- **Bun Runtime**: Fast JavaScript runtime and package manager
- **Prisma ORM**: Type-safe database access with PostgreSQL
- **Svelte 5**: Modern web framework for UI
- **Melt UI**: Headless UI components for Svelte
- **Authentication System**: User and session management
- **TypeScript**: Full type safety throughout the project
- **Monorepo Structure**: Organized packages for multiple applications

## 📁 Project Structure

```
mono-repo/
├── packages/           # All applications and packages
│   ├── core/          # Shared types, config, and utilities
│   ├── backend/       # API server with Hono
│   └── web-ui/        # Svelte 5 web interface
├── prisma/            # Database schema and migrations
│   └── schema/        # Multi-file Prisma schema
│       ├── base.prisma   # Main config (generator, datasource)
│       ├── user.prisma   # User model
│       ├── session.prisma # Session model
│       └── enums.prisma  # Enums
├── config/            # Configuration files
│   ├── index.ts          # Re-exports only (entry point)
│   ├── validate-config.ts # Config validation function
│   ├── types/config.ts   # Type definitions
│   └── README.md         # Configuration documentation
├── .env.example          # Environment variables example
└── package.json          # Root package configuration
```

## 🗄️ Database Models

### User Model

- `id`: Unique identifier (CUID)
- `email`: Unique email address
- `username`: Unique username
- `password`: Hashed password
- `firstName`, `lastName`: Optional name fields
- `avatar`: Optional avatar URL
- `isActive`: Account status
- `isVerified`: Email verification status
- `role`: User role (USER, ADMIN, MODERATOR)
- `createdAt`, `updatedAt`: Timestamps

### Session Model

- `id`: Unique identifier (CUID)
- `userId`: Reference to user
- `token`: Unique session token
- `expiresAt`: Session expiration date
- `userAgent`: Browser/device info
- `ipAddress`: Client IP address
- `isActive`: Session status
- `createdAt`, `updatedAt`: Timestamps

## 🛠️ Setup Instructions

1. **Clone the repository**

   ```bash
   git clone git@github.com:nevvord/mono-repo-instance-bun.git
   cd mono-repo-instance-bun
   ```

2. **Install dependencies**

   ```bash
   bun install
   ```

3. **Setup environment variables**

   ```bash
   cp config/database.example.env .env
   # Edit .env with your database credentials
   ```

4. **Setup database**

   ```bash
   # Generate Prisma client
   bunx prisma generate

   # Run database migrations
   bunx prisma migrate dev --name init
   ```

5. **Start development**
   ```bash
   bun run index.ts
   ```

## 📦 Available Scripts

### Backend

- `bun run backend:dev` - Start backend development server with PM2
- `bun run backend:start` - Start backend production server
- `bun run backend:stop` - Stop backend server
- `bun run backend:restart` - Restart backend server
- `bun run backend:logs` - View backend logs
- `bun run backend:status` - Check backend status

### Web UI

- `bun run web-ui:dev` - Start web UI development server
- `bun run web-ui:build` - Build web UI for production
- `bun run web-ui:preview` - Preview production build
- `bun run web-ui:check` - Type check web UI
- `bun run web-ui:format` - Format web UI code
- `bun run web-ui:lint` - Lint web UI code

### Database

- `bunx prisma generate --schema=prisma/schema` - Generate Prisma client
- `bunx prisma migrate dev --schema=prisma/schema` - Run database migrations
- `bunx prisma studio --schema=prisma/schema` - Open Prisma Studio

## 🔧 Development

### Adding New Packages

1. Create a new directory in `packages/`
2. Initialize with `bun init`
3. Add shared dependencies to root `package.json`
4. Update workspace configuration

### Database Changes

1. Modify files in `prisma/schema/`
2. Run `bunx prisma migrate dev --schema=prisma/schema --name <migration-name>`
3. Update types if needed

### Web UI Development

1. Start development server: `bun run web-ui:dev`
2. Open http://localhost:5173
3. Use Melt UI components for consistent design
4. Follow Svelte 5 best practices

### Backend Development

1. Start development server: `bun run backend:dev`
2. API available at http://localhost:3000
3. Use PM2 for process management
4. Check logs: `bun run backend:logs`

## 🔐 Authentication

The project includes a complete authentication system with:

- User registration and login
- Session management
- Password hashing with bcrypt
- Role-based access control

## 📝 License

MIT License - feel free to use this project as a starting point for your own applications.
