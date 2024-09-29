import { type Message, Events } from "discord.js";
import type { App } from "../../core/client";
import { buildEmbeds, matchMedia, findBestMatch, logger } from "../../utils";
import type { Command } from "../../types";

export const name = Events.MessageCreate;
export const run = (client: App) => {
  const log = logger.scope("message");
  return async (message: Message) => {
    if (client.debug) log.debug(`Received message from ${message.author.tag}: ${message.content}`);
    if (message.author.bot || !message.guild || !message.content.startsWith(client.config.prefix)) return;

    let command: Command | null = null;
    let args: string[] = [];

    if (matchMedia(message.content)) {
      command = client.commands.get("autodownload")!;
      args = [message.content];
    } else {
      let [commandName, ..._args] = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
      const allCommands: string[] = Array.from(client.commands.values()).flatMap(cmd => [cmd.name, ...(cmd.aliases || [])]);
      const foundCommand = client.commands.find(cmd => [...cmd.aliases || [], cmd.name]?.includes(commandName));

      if (foundCommand) commandName = foundCommand.name;
      else {
        const { bestMatch } = findBestMatch(commandName, allCommands, { threshold: 0.6 });
        if (bestMatch?.rating! >= 0.6) {
          return message.reply(buildEmbeds([
            {
              title: "Command Not Found",
              description: `Did you mean \`${client.config.prefix}${bestMatch?.string}\`?`,
              fields: client.commands.get(bestMatch?.string!)?.aliases ? [{
                name: "Aliases",
                value: client.commands.get(bestMatch?.string!)?.aliases?.map(alias => `\`${alias}\``).join(", ") || "",
              }] : [],
              color: "Red",
            }
          ]));
        }
      }
      command = client.commands.get(commandName)!;
      args = _args;
    }

    if (!command || !command.run) return;
    if (command.admin && client.config.ownerID !== message.author.id) {
      log.error(`The command ${command.name} is restricted to the bot owner`);
      return message.reply(buildEmbeds([
        {
          title: "Permission Denied",
          description: "You do not have permission to run this command",
          color: "Red",
        }
      ]));
    }

    try {
      await command.run({ message, args, client });
      log.success(`The command ${command.name} was successfully executed by ${message.author.tag}`);
    } catch (error: any) {
      client.debug && await message.reply(buildEmbeds([
        {
          title: "An Error Occurred",
          description: `Error while running the command: ${error.stack || error}`,
          color: "Red",
        }
      ]));
      log.error(`An error occurred while running the command: ${error.stack || error}`);
    }
  };
};
