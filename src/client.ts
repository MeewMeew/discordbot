
import { join } from 'node:path'
import { readdirSync } from 'node:fs'
import Distube from 'distube'
import { Client, Collection } from 'discord.js'
import { Signale } from 'signale'
import { plugins } from './plugins'
import type { ClientOptions } from 'discord.js'
import type { Command } from './types'
import config from '../config.json'

export class DisTubeClient extends Client {
  distube = new Distube(this, {
    plugins: plugins,
    emitAddListWhenCreatingQueue: true,
    emitAddSongWhenCreatingQueue: true,
    nsfw: config.allowNsfw,
  })
  commands = new Collection<string, Command>()
  log = new Signale({ scope: "Discord Bot" })

  constructor(options: ClientOptions) {
    super(options)
    Promise.all([
      readdirSync(join(__dirname, "commands")).forEach(this.loadCommand.bind(this)),
      readdirSync(join(__dirname, "events", "client")).forEach(this.loadEvent.bind(this)),
      readdirSync(join(__dirname, "events", "distube")).forEach(this.loadDistubeEvent.bind(this)),
    ])
  }

  async loadCommand(name: string) {
    const log = new Signale({ scope: "Bot Command Loader" })
    try {
      const command = await import(`./commands/${name}`)
      this.commands.set(command.name, command)
      log.success(`Loaded command ${name}`)
    } catch (error: any) {
      log.error(`Unable to load command ${name}: ${error.stack || error}`)
    }
  }

  async loadEvent(eventName: string) {
    const log = new Signale({ scope: "Discord Event Loader" })
    try {
      const { name, run } = await import(`./events/client/${eventName}`)
      const fn = run(this)
      this.on(name, fn)
      log.success(`Listening for event ${eventName}`)
    } catch (error: any) {
      log.error(`Unable to listen event ${eventName}: ${error.stack || error}`)
    }
  }

  async loadDistubeEvent(eventName: string) {
    const log = new Signale({ scope: "Distube Event Loader" })
    try {
      const E = await import(`./events/distube/${eventName}`)
      const event = new E.default(this)
      this.distube.on(event.name, event.execute.bind(event))
      log.success(`Listening for DisTube event ${eventName}`)
    } catch (error: any) {
      log.error(`Unable to listen DisTube event ${eventName}: ${error.stack || error}`)
    }
  }
}