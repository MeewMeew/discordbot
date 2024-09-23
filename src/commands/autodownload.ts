import type { CommandArgs } from "../types"
import { matchMedia } from "../utils"
import { facebookPublicVideo } from "../utils"

export const name = "autodownload"
export const description = "Automatically download videos from TikTok and Facebook"
export const aliases = ["ad"]
export const admin = false

export async function run({ message, args, client }: CommandArgs) {
  if (!client.config.autodownload) return
  const match = matchMedia(args[0])
  if (!match) return
  const { platform, id, type } = match
  client.log.await(`Downloading ${platform} ${type} ${id}`)
  let attachment = ''
  if (platform === "facebook") {
    if (type === 'reel' || type === 'video') {
      attachment = await facebookPublicVideo(id) as string
    }
  }
  await message.reply({
    files: [{
      attachment: attachment,
      name: `${id}.mp4`
    }]
  })
  client.log.success(`Downloaded ${platform} ${type} ${id}`)
}