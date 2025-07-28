# PM2 Deployment Guide

## Quick Start

### Backend Only

```bash
# Start development server with PM2
bun run backend:dev

# Start production server
bun run backend:start

# Stop server
bun run backend:stop

# Restart server
bun run backend:restart
```

### Web UI Only

```bash
# Start development server with PM2
bun run web-ui:dev

# Start production server
bun run web-ui:start

# Stop server
bun run web-ui:stop

# Restart server
bun run web-ui:restart
```

### All Services

```bash
# Start all services in development
bun run dev:all

# Start all services in production
bun run start:all

# Stop all services
bun run stop:all

# Restart all services
bun run restart:all
```

## Monitoring

### Backend

```bash
# Check status
bun run backend:status

# View logs
bun run backend:logs

# Open monitoring dashboard
bun run backend:monit
```

### Web UI

```bash
# Check status
pm2 status

# View logs
bun run web-ui:logs

# View all logs
bun run logs:all
```

### All Services

```bash
# Check status of all services
bun run status:all

# View logs of all services
bun run logs:all
```

## PM2 Commands

```bash
# Direct PM2 commands
pm2 start ecosystem.config.cjs --env development
pm2 stop mono-repo-backend
pm2 restart mono-repo-backend
pm2 delete mono-repo-backend
pm2 reload mono-repo-backend

# List all processes
pm2 list

# Monitor resources
pm2 monit

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
pm2 save
```

## Features

### Backend

- ✅ **Hot Reload**: Watches for file changes in `packages/backend/` and `packages/core/`
- ✅ **Auto Restart**: Automatically restarts on crashes
- ✅ **Log Management**: Separate log files for output and errors
- ✅ **Memory Management**: Restarts if memory usage exceeds 1GB
- ✅ **Environment Support**: Development and production environments
- ✅ **Bun Integration**: Uses Bun as interpreter for TypeScript

### Web UI

- ✅ **Hot Reload**: Watches for file changes in `packages/web-ui/` and `packages/core/`
- ✅ **Auto Restart**: Automatically restarts on crashes
- ✅ **Log Management**: Separate log files for output and errors
- ✅ **Memory Management**: Restarts if memory usage exceeds 1GB
- ✅ **Environment Support**: Development and production environments
- ✅ **Bun Integration**: Uses Bun as interpreter for TypeScript
- ✅ **Vite Integration**: Runs Vite dev server through PM2

## Log Files

### Backend

- `logs/out.log` - Standard output
- `logs/error.log` - Error logs
- `logs/combined.log` - Combined logs

### Web UI

- `packages/web-ui/logs/web-ui-out.log` - Standard output
- `packages/web-ui/logs/web-ui-error.log` - Error logs
- `packages/web-ui/logs/web-ui-combined.log` - Combined logs

## Configuration

PM2 configuration is in `ecosystem.config.cjs`:

- **Watch Mode**: Automatically restarts on file changes
- **Memory Limit**: 1GB max memory usage
- **Logging**: Timestamped logs with rotation
- **Environment**: Separate dev/prod configurations

## Service Testing

### Backend API

```bash
# Health check
curl http://localhost:3000/health

# Get users
curl http://localhost:3000/api/users

# Create user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com"}'
```

### Web UI

```bash
# Check if web UI is running
curl http://localhost:5173

# Check title
curl -s http://localhost:5173 | grep -o "<title>.*</title>"
```

### All Services

```bash
# Check both services
curl http://localhost:3000/health && echo "Backend OK" && \
curl -s http://localhost:5173 | grep -q "Mono Repo" && echo "Web UI OK"
```
