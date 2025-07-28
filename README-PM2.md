# PM2 Deployment Guide

## Quick Start

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

## Monitoring

```bash
# Check status
bun run backend:status

# View logs
bun run backend:logs

# Open monitoring dashboard
bun run backend:monit
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

- ✅ **Hot Reload**: Watches for file changes in `packages/backend/` and `packages/core/`
- ✅ **Auto Restart**: Automatically restarts on crashes
- ✅ **Log Management**: Separate log files for output and errors
- ✅ **Memory Management**: Restarts if memory usage exceeds 1GB
- ✅ **Environment Support**: Development and production environments
- ✅ **Bun Integration**: Uses Bun as interpreter for TypeScript

## Log Files

- `logs/out.log` - Standard output
- `logs/error.log` - Error logs
- `logs/combined.log` - Combined logs

## Configuration

PM2 configuration is in `ecosystem.config.cjs`:

- **Watch Mode**: Automatically restarts on file changes
- **Memory Limit**: 1GB max memory usage
- **Logging**: Timestamped logs with rotation
- **Environment**: Separate dev/prod configurations

## API Testing

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
