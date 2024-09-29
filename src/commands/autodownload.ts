import type { CommandArgs } from "../types"
import { matchMedia } from "../utils"
import { socialPublicMedia, tiktokPublicMedia, type File } from "../utils"

export const name = "autodownload"
export const description = "Automatically download videos/photos from TikTok and Facebook"
export const aliases = ["ad"]
export const admin = false
export const category = "Utility"

export async function run({ message, args, client }: CommandArgs) {
  if (!client.config.autodownload) return
  const match = matchMedia(args[0])
  if (!match) return
  const { platform, id } = match
  let files: File[] = []
  if (platform === "tiktok") files = await tiktokPublicMedia(id)
  else files = await socialPublicMedia(id)
  if (!files.length) return await message.react('❌')
  await message.reply({ files: files })
  await message.react('✅')
}