import { spawn } from 'node:child_process'
import { Signale } from 'signale'

const log = new Signale({ scope: 'app wrapper' })

function initialize() {
  const argv = process.argv
  return spawn('bun', ['run', argv[1].includes('.ts') ? 'src/core/app.ts' : 'build/core/app.js'], {
    stdio: ['inherit', 'inherit', 'inherit', 'ipc'],
    cwd: process.cwd()
  }).on('exit', (code: number) => {
    if (code === 999) {
      log.error('Bot exited with code', code)
      log.warn('Bot will not reboot.')
      process.exit(0)
    } else {
      log.warn('Bot exited with code', code)
      log.warn('Bot rebooting...')
      initialize()
    }
  }).on('error', log.error)
}

initialize()