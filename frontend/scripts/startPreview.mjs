import { spawn } from 'node:child_process';

const port = process.env.PORT || '4173';
const args = ['vite', 'preview', '--host', '0.0.0.0', '--port', String(port)];

const child = spawn('npx', args, {
  stdio: 'inherit',
  shell: true,
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});
