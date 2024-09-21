import type { RunnerArgs } from "../types"

export const name = 'reboot'
export const admin = true
export const run = async ({ message }: RunnerArgs) => {
  await message.reply('Rebooting...')
  process.exit(0)
}