import { spawn } from 'node:child_process';
import { logger } from './utils';

const log = logger.scope('initialize');

function initialize() {
  const script = process.argv[1].includes('.ts') ? 'src/core/app.ts' : 'build/core/app.js';
  const child = spawn('bun', ['run', script], {
    stdio: ['inherit', 'inherit', 'inherit', 'ipc'],
    cwd: process.cwd(),
  });

  child.on('exit', (code: number) => {
    if (code === 1) {
      log.error('Bot exited with code', code);
      log.warn('Bot will not reboot.');
      process.exit(0);
    }
    log.warn('Bot exited with code', code);
    log.warn('Bot rebooting...');
    initialize();
  });

  child.on('error', log.error);
}

initialize();
