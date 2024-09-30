import logger, { loggerConfig, signaleConfig } from './utils/logger';
import { spawn } from 'node:child_process';
import { calcDuration } from './utils';
import { Signale } from 'signale';

const log = logger.scope('initialize');

let rebootCount = 0;
let message = '';

function initialize() {
  if (rebootCount > 10) {
    log.error('Bot has reset too many times.');
    log.error('Exiting...');
    process.exit(1);
  }
  const script = process.argv[1].includes('.ts') ? 'src/core/app.ts' : 'build/core/app.js';
  const child = spawn('bun', ['run', script], {
    stdio: ['inherit', 'inherit', 'inherit', 'ipc'],
    cwd: process.cwd(),
  });

  child.on('exit', async (code: number) => {
    if (code === 231) {
      log.warn('Bot exited with code', code);
      const _log = new Signale({ ...signaleConfig, scope: 'initialize', interactive: true });
      while (calcDuration(message).durationTime! > 0) {
        _log.config(loggerConfig);
        _log.info('Max sessions reached, bot cannot log in for %d seconds.', calcDuration(message).durationTimeInSeconds!);
        await new Promise((resolve) => setTimeout(resolve, 1e3));
      }
    }
    if (code === 0) {
      log.warn('Bot exited with code', code);
      log.warn('Bot rebooting...');
      rebootCount++;
      return initialize();
    }

    log.error('Bot exited with code', code);
    log.warn('Bot will not reboot.');
    process.exit(0);
  });

  child.on('message', (msg: string) => {
    message = msg;
  })

  child.on('error', log.error);
}

initialize();
