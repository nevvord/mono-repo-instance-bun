module.exports = {
  apps: [
    {
      name: "mono-repo-backend",
      script: "packages/backend/index.ts",
      interpreter: "bun",
      cwd: "./",
      env: {
        NODE_ENV: "development",
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      watch: ["packages/backend/**/*", "packages/core/**/*"],
      ignore_watch: ["node_modules", "logs", ".git"],
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_memory_restart: "1G",
      log_file: "./logs/combined.log",
      out_file: "./logs/out.log",
      error_file: "./logs/error.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
      time: true,
    },
  ],
};
