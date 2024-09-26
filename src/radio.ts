import { ActivityType, Client, Events, GatewayIntentBits } from 'discord.js'
import { AudioPlayer, VoiceConnection, createAudioPlayer, createAudioResource, joinVoiceChannel } from '@discordjs/voice'
import { Signale } from 'signale'
import config from '../config.json'

export class Radio {
  private client: Client
  private log: Signale
  private connection: VoiceConnection | null = null
  private player: AudioPlayer | null = null

  constructor() {
    this.log = new Signale({ scope: 'RadioBot' })

    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
      ]
    })

    this.client.login(config.token).then(() => this.events())
  }

  private events() {
    this.client.on(Events.ClientReady, () => {
      this.log.info(`Logged in as ${this.client.user?.tag}!`)
      this.updateActivity()
    })

    this.client.on(Events.MessageCreate, async (message) => {
      if (message.author.bot || !message.guild) return
      if (!message.content.startsWith(config.prefix)) return
      let [command, ...args] = message.content.slice(config.prefix.length).trim().split(/ +/g)
      command = command.toLowerCase()

      if (command === 'help') {
        await message.reply({ content: `**Commands**\n\n\`${config.prefix}radio <station>\` - Start the radio\n\`${config.prefix}stop\` - Stop the radio\n\`${config.prefix}radiolist\` - List of radio stations` });
      }

      if (command === 'radio') {
        let voiceChannel = message.member?.voice.channel
        let meVoiceChannel = message.guild.members.me?.voice.channel

        if (!voiceChannel) {
          message.channel.send(':x: **You need to be in a voice channel to use this command!**')
          return
        }

        if (meVoiceChannel && meVoiceChannel.id !== voiceChannel.id) {
          message.channel.send(':x: **I am already in a voice channel!**')
          return
        }

        this.connection = joinVoiceChannel({
          channelId: voiceChannel.id,
          guildId: voiceChannel.guild.id,
          adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        })

        const resolveResource = (resource: string) => {
          if (resource?.startsWith('http')) {
            return resource
          }

          let selectedResource = config.resources[(resource || config.selectedResource) as keyof typeof config.resources]

          if (!selectedResource) {
            return `https://stream.laut.fm/${resource}`
          }

          return selectedResource
        }

        if (this.player) {
          this.player.stop()
        }

        this.player = createAudioPlayer()
        const resource = createAudioResource(resolveResource(args[0]))

        this.player.play(resource)

        this.connection?.subscribe(this.player)

        this.player.on('error', (error) => {
          this.log.error(error)
        })

        await message.reply({ content: `📻 **Radio Started**` });
      }

      if (command === 'stop') {
        let meVoiceChannel = message.guild.members.me?.voice.channel

        if (!meVoiceChannel) {
          message.channel.send(':x: **I am not in a voice channel!**')
          return
        }

        if (this.connection) {
          this.connection.destroy()
          this.connection = null
        }

        await message.reply({ content: `📻 **Radio Stopped**` });
      }

      if (command === 'ping') {
        await message.reply({ content: `🏓 **Pong!**` });
      }

      if (command === 'radiolist') {
        let resources = Object.keys(config.resources).map((resource, index) => `${index + 1}. ${resource}`).join('\n')
        await message.reply({ content: `**Radio List**\n${resources}\n\n Or any streaming track from laut.fm!` });
      }
    })

    this.client.on(Events.VoiceStateUpdate, (_, newState) => {
      if (newState.channelId === null) {
        this.log.info(`${newState.member?.user.tag} left the voice channel`)
      } else {
        this.log.info(`${newState.member?.user.tag} joined the voice channel`)
      }
    })

    this.client.on(Events.Error, (error) => {
      this.log.error(error)
    })

    this.client.on(Events.Warn, (warning) => {
      this.log.warn(warning)
    })
  }

  private updateActivity() {
    const activities = [
      "WWELCOME TO 247 RADIO STATION 📻",
      "🎵 LISTENING TO MUSIC",
      "🎵 LISTENING 24/7 RADIO",
      "🔊 BROADCASTING NON-STOP TUNES",
      "🎶 ALWAYS LIVE WITH MUSIC",
      "📻 KEEPING THE BEATS ALIVE",
      "🎧 JOIN US FOR CONTINUOUS MUSIC",
    ];

    const randomActivity = activities[Math.floor(Math.random() * activities.length)];

    this.client.user?.setActivity(randomActivity, { type: ActivityType.Listening });
  }
}

new Radio()