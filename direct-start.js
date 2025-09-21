const { exec } = require('child_process');
const path = require('path');

console.log('Starting Next.js server directly...');

// Set clean environment
const env = {
  PATH: '/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin',
  HOME: '/Users/sylasp',
  USER: 'sylasp',
  NODE_ENV: 'development'
};

// Start the server
const child = exec('npm run dev', {
  cwd: '/Users/sylasp/ask-ai-legal-work-4',
  env: env,
  stdio: 'inherit'
});

child.on('error', (err) => {
  console.error('Error starting server:', err);
});

child.on('exit', (code) => {
  console.log(`Server exited with code ${code}`);
});

// Keep the process alive
process.on('SIGINT', () => {
  child.kill();
  process.exit(0);
});

console.log('Server should be starting...');
