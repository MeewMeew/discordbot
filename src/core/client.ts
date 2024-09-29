import { join } from 'node:path';
import { readdirSync } from 'node:fs';
import Distube from 'distube';
import { Client, Collection } from 'discord.js';
import { plugins } from '../plugins';
import type { ClientOptions } from 'discord.js';
import type { Command } from '../types';
import config from '../../config.json';
import { logger } from '../utils';
import type { Signale } from 'signale';

export class App extends Client {
  distube = new Distube(this, {
    plugins,
    emitAddListWhenCreatingQueue: true,
    emitAddSongWhenCreatingQueue: true,
    nsfw: config.allowNsfw,
  });

  commands = new Collection<string, Command>();
  events = new Collection<string, any>();
  distubeEvents = new Collection<string, any>();
  public log: Signale
  config = config;
  debug = config.debug;

  constructor(options: ClientOptions) {
    super(options);
    this.log = logger.scope('client')
    this.loadFiles('commands', this.loadCommand.bind(this));
    this.loadFiles('events/client', this.loadEvent.bind(this));
    this.loadFiles('events/distube', this.loadDistubeEvent.bind(this));
  }

  loadFiles(dir: string, loadFunction: (name: string) => Promise<void>) {
    readdirSync(join(__dirname, '..', dir)).forEach(loadFunction);
  }

  async loadCommand(name: string) {
    const log = logger.scope('command loader')
    try {
      const command = await import(join(__dirname, '..', 'commands', name));
      this.commands.set(command.name, command);
      config.debug && log.debug(`Loaded command ${command.name}`);
    } catch (error: any) {
      log.error(`Unable to load command ${name}: ${error.stack || error}`);
    }
  }

  async loadEvent(eventName: string) {
    const log = logger.scope('event loader')
    log.config({
      displayTimestamp: true,
      displayDate: true
    })
    try {
      const { name, run } = await import(join(__dirname, '..', 'events', 'client', eventName));
      const fn = run(this);
      this.on(name, fn);
      this.events.set(name, fn);
      config.debug && log.debug(`Loaded event ${name}`);
    } catch (error: any) {
      log.error(`Unable to listen event ${eventName}: ${error.stack || error}`);
    }
  }

  async loadDistubeEvent(eventName: string) {
    const log = logger.scope('distube event loader')
    try {
      const E = await import(join(__dirname, '..', 'events', 'distube', eventName));
      const event = new E.default(this);
      this.distube.on(event.name, event.execute.bind(event));
      this.distubeEvents.set(event.name, event);
      config.debug && log.debug(`Loaded DisTube event ${event.name}`);
    } catch (error: any) {
      log.error(`Unable to listen DisTube event ${eventName}: ${error.stack || error}`);
    }
  }
}
