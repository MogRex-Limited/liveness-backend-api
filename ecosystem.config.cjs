module.exports = {
  apps: [
    {
      name: 'liveness-mogrex-api',
      script: 'dist/index.ts',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: true,
    },
  ],
};