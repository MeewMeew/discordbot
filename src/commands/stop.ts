import type { CommandArgs } from "../types";
import { buildEmbeds } from "../utils";

export const name = "stop";
export const description = "Stop the music";
export const category = "Music";

export const run = ({ message, client }: CommandArgs) => {
  const queue = client.distube.getQueue(message);
  if (!queue) {
    return message.reply(buildEmbeds([
      {
        title: "Error",
        description: "There is no queue in this server!",
        color: "Red",
        footer: {
          text: `Requested by ${message.author.globalName}`,
          iconURL: message.author.displayAvatarURL()
        }
      }
    ]));
  }
  queue.stop();
  message.reply(buildEmbeds([
    {
      title: client.user?.globalName!,
      description: "Stopped!",
      footer: {
        text: `Requested by ${message.author.globalName}`,
        iconURL: message.author.displayAvatarURL()
      }
    }
  ]));
};