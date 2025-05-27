module.exports = {
  apps: [
    {
      name: 'liveness-mogrex-api',
      script: 'dist/index.js',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: true,
    },
  ],
};