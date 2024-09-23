import type { CommandArgs } from "../types"

export const name = 'reboot'
export const aliases = ['restart']
export const description = 'Reboot the bot'
export const category = 'Admin'

export const admin = true
export const run = async ({ message }: CommandArgs) => {
  await message.reply('Rebooting...')
  process.exit(0)
}