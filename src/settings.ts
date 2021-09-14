import * as Discord from 'discord.js'
import * as Dotenv from 'dotenv'

// Discordの権限付与周りの設定　基本動かさない
const FLAGS = Discord.Intents.FLAGS

export const Partials: Discord.PartialTypes[] = [
  'USER',
  'CHANNEL',
  'GUILD_MEMBER',
  'MESSAGE',
  'REACTION'
]

export const Intents = [
  FLAGS.GUILDS,
  FLAGS.GUILD_MEMBERS,
  FLAGS.GUILD_BANS,
  FLAGS.GUILD_EMOJIS_AND_STICKERS,
  FLAGS.GUILD_INTEGRATIONS,
  FLAGS.GUILD_WEBHOOKS,
  FLAGS.GUILD_INVITES,
  FLAGS.GUILD_VOICE_STATES,
  FLAGS.GUILD_PRESENCES,
  FLAGS.GUILD_MESSAGES,
  FLAGS.GUILD_MESSAGE_REACTIONS,
  FLAGS.GUILD_MESSAGE_TYPING,
  FLAGS.DIRECT_MESSAGES,
  FLAGS.DIRECT_MESSAGE_REACTIONS,
  FLAGS.DIRECT_MESSAGE_TYPING,
]

// 環境変数周り
Dotenv.config()
if (!process.env.DISCORD_TOKEN) {
  throw new Error("DISCORD_TOKEN must be set.");
}
else if (!process.env.CH_CATEGORY) {
  throw new Error("CH_CATEGORY must be set.")
}
export const DISCORD_TOKEN = process.env.DISCORD_TOKEN
export const CH_CATEGORY = process.env.CH_CATEGORY