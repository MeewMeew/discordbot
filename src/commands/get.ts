import type { CommandArgs } from "../types";
import { buildEmbed } from "../utils";

export const name = "get";
export const description = "Get the link of replied message attachment / image / video / file";
export const category = "Utility";
export const run = async ({ message }: CommandArgs) => {
  if (!message.reference) {
    return message.reply(buildEmbed({
      title: "Error",
      description: "You need to reply to a message",
      color: "Red",
      footer: {
        text: `Requested by ${message.author.globalName}`,
        iconURL: message.author.displayAvatarURL()
      }
    }));
  }

  const repliedMessage = await message.channel.messages.fetch(
    message.reference.messageId!
  );

  if (!repliedMessage.attachments.size) {
    return message.reply(buildEmbed({
      title: "Error",
      description: "There is no attachment in the replied message",
      color: "Red",
      footer: {
        text: `Requested by ${message.author.globalName}`,
        iconURL: message.author.displayAvatarURL()
      }
    }));
  }

  const attachments = repliedMessage.attachments.map((attachment, key) => {
    return `[Download ${key}](${attachment.url})`;
  });

  await message.reply(buildEmbed({
    title: "Attachment",
    description: attachments.join("\n"),
    footer: {
      text: `Requested by ${message.author.globalName}`,
      iconURL: message.author.displayAvatarURL()
    }
  }));
};