import type { CommandArgs } from "../types";
import { buildEmbeds } from "../utils";

export const name = 'uptime';
export const description = 'Get the uptime of the bot';
export const category = "Info";
export const run = async ({ message }: CommandArgs) => {
  const sec_num = parseInt(String(process.uptime()), 10);
  const days = Math.floor(sec_num / (3600 * 24));
  const hours = Math.floor((sec_num % (3600 * 24)) / 3600);
  const minutes = Math.floor(sec_num / 60) % 60;
  const seconds = sec_num % 60;

  const msg = `\`» ${[days, hours, minutes, seconds]
    .map((v) => (v < 10 ? `0${v}` : v))
    .filter((v, i) => v !== '00' || i > 0)
    .join(':')} «\``

  await message.reply(buildEmbeds([
    {
      fields: [
        {
          name: "Uptime",
          value: msg
        }
      ],
      footer: {
        text: `Requested by ${message.author.tag}`,
        iconURL: message.author.displayAvatarURL()
      },
      timestamp: true
    }
  ]));
};