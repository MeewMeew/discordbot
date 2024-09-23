import type { Client, GuildTextBasedChannel, Message } from "discord.js"
import type { Awaitable, DisTubeEvents } from "distube";
import type { DisTubeClient } from "./core/client";

export interface Metadata {
  message?: Message,
  textChannel?: GuildTextBasedChannel,
}

export interface CommandArgs {
  message: Message,
  args: string[],
  client: DisTubeClient
}

export interface Command {
  name: string,
  description: string,
  aliases?: string[],
  category?: string,
  timeout?: number,
  usage?: string
  admin?: boolean
  run: ({ message, args, client }: CommandArgs) => void | Promise<void>
}

export abstract class DisTubeEvent<T extends keyof DisTubeEvents> {
  client: DisTubeClient;
  abstract readonly name: T;
  constructor(client: DisTubeClient) {
    this.client = client;
  }

  get distube() {
    return this.client.distube;
  }

  abstract run(...args: DisTubeEvents[T]): Awaitable<any>;

  async execute(...args: DisTubeEvents[T]) {
    try {
      await this.run(...args);
    } catch (err) {
      console.error(err);
    }
  }
}