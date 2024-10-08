import type { CommandArgs } from "../types";
import { buildEmbeds } from "../utils";

export const name = 'ping';
export const description = 'Get the latency and ping of the bot';
export const category = "Info";
export const run = async ({ message }: CommandArgs) => {
  const msg = await message.reply(buildEmbeds([
    {
      fields: [
        {
          name: "Pinging...",
          value: "Please wait..."
        }
      ],
      footer: {
        text: `Requested by ${message.author.tag}`,
        iconURL: message.author.displayAvatarURL()
      },
      timestamp: true
    }
  ]))
  await msg.edit(buildEmbeds([
    {
      fields: [
        {
          name: "Latency",
          value: `\`${msg.createdTimestamp - message.createdTimestamp}ms\``
        },
        {
          name: "API Latency",
          value: `\`${Math.round(message.client.ws.ping)}ms\``
        }
      ],
      footer: {
        text: `Requested by ${message.author.tag}`,
        iconURL: message.author.displayAvatarURL()
      },
      timestamp: true
    }
  ]))
};