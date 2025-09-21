const { spawn } = require('child_process');
const path = require('path');

console.log('Starting Next.js development server...');

const server = spawn('npx', ['next', 'dev'], {
  cwd: __dirname,
  stdio: 'inherit',
  env: {
    ...process.env,
    PATH: '/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin'
  }
});

server.on('error', (err) => {
  console.error('Failed to start server:', err);
});

server.on('exit', (code) => {
  console.log(`Server exited with code ${code}`);
});

// Keep the process alive
process.on('SIGINT', () => {
  server.kill();
  process.exit(0);
});
