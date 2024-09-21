import type { Client, Message } from "discord.js"
import type { Awaitable, DisTubeEvents } from "distube";
import type { DisTubeClient } from "./client";

export interface Metadata {
  message: Message
}

export interface RunnerArgs {
  message: Message,
  args: string[],
  client: DisTubeClient
}

export interface Command {
  name: string,
  description: string,
  timeout?: number,
  usage?: string
  admin?: boolean
  run: ({ message, args, client }: RunnerArgs) => void | Promise<void>
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