import type { CommandArgs } from "../types";

export const name = 'ping';
export const description = 'Get the latency and ping of the bot';
export const execute = async ({ message }: CommandArgs) => {
  await message.reply(`Pong!\nLatency: ${Date.now() - message.createdTimestamp}ms.\nAPI Latency: ${Math.round(message.client.ws.ping)}ms`);
};