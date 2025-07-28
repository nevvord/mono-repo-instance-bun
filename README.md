# Mono Repo Instance with Bun

A modern monorepo setup using Bun as the package manager and runtime, with Prisma for database management and authentication models.

## 🚀 Features

- **Bun Runtime**: Fast JavaScript runtime and package manager
- **Prisma ORM**: Type-safe database access with PostgreSQL
- **Authentication System**: User and session management
- **TypeScript**: Full type safety throughout the project
- **Monorepo Structure**: Organized packages for multiple applications

## 📁 Project Structure

```
mono-repo/
├── packages/           # All applications will be here
├── lib/               # Shared libraries
│   └── prisma.ts      # Prisma client singleton
├── services/          # Business logic services
│   ├── userService.ts # User management
│   └── sessionService.ts # Session management
├── types/             # TypeScript type definitions
│   └── auth.ts        # Authentication types
├── prisma/            # Database schema and migrations
│   └── schema.prisma  # Database models
├── config/            # Configuration files
│   └── database.example.env # Environment variables example
└── package.json       # Root package configuration
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

- `bun run index.ts` - Run the main application
- `bunx prisma generate` - Generate Prisma client
- `bunx prisma migrate dev` - Run database migrations
- `bunx prisma studio` - Open Prisma Studio for database management

## 🔧 Development

### Adding New Packages

1. Create a new directory in `packages/`
2. Initialize with `bun init`
3. Add shared dependencies to root `package.json`

### Database Changes

1. Modify `prisma/schema.prisma`
2. Run `bunx prisma migrate dev --name <migration-name>`
3. Update types if needed

## 🔐 Authentication

The project includes a complete authentication system with:

- User registration and login
- Session management
- Password hashing with bcrypt
- Role-based access control

## 📝 License

MIT License - feel free to use this project as a starting point for your own applications.
