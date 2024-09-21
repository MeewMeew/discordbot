# MewBot

## Pre-requisites

- Node.js v18 or higher (Install it from [here](https://nodejs.org/en/download/))
- Bun v1.0 (Install it from [here](bun.sh))
- ffmpeg v4.4.0 or higher (Install it from [here](https://ffmpeg.org/download.html))

## Installation

1. Clone the repository

```bash
git clone https://github.com/meewmeew/discordbot.git
```

2. Install the dependencies

```bash
bun install
```

3. Run fix distube dependency

```bash
bun run fix
```

4. Copy config.example.json to config.json and edit it

```json
{
  "token": "YOUR_BOT_TOKEN",
  "prefix": "!",
  "ownerID": "YOUR_DISCORD_ID",
  "botID": "xxx",
  "allowNsfw": true,
  "debug": false
}
```

5. Start the bot

```bash
bun start
```

## Commands

- `<prefix>help` - Show all commands
- `<prefix>invite` - Get the bot invite link
- `<prefix>autoplay` - Toggle autoplay
- `<prefix>play <song>` - Play a song
- `<prefix>queue` - Show the queue
- `<prefix>skip` - Skip the current song
- `<prefix>stop` - Stop the bot
- `<prefix>volume <volume>` - Set the volume
- `<prefix>pause` - Pause the current song
- `<prefix>resume` - Resume the current song
- `<prefix>filter` - Filter the current song
- `<prefix>seek` - Seek the current song
- `<prefix>loop` - Loop the current song
