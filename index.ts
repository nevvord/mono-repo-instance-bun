import { config } from '@mono-repo/core/config';

console.log('🚀 Mono Repo Starting...');
console.log(`📊 Environment: ${config.app.nodeEnv}`);
console.log(`🌐 Port: ${config.app.port}`);
console.log(
  `🗄️  Database: ${config.database.url.split('@')[1] || 'configured'}`
);
console.log(`🔐 JWT Secret: ${config.jwt.secret.length} characters`);

console.log('✅ Configuration loaded successfully!');
