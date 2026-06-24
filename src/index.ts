import * as Discord from 'discord.js'
import * as sqlite from 'sqlite3'
import {Partials, Intents, DISCORD_TOKEN, CH_CATEGORY, SQLITE_PATH, MAKE_CH_CHANNEL} from './settings'
import {thread_update} from './transaction'
import {MakeThread} from './commands/thread'

// Discord接続
export const Client = new Discord.Client({
  partials: Partials,
  intents: Intents,
})

// db接続
export const db = new sqlite.Database(SQLITE_PATH, (err: any) => {
  if (err) {
    return console.log('データーベースが何かおかしいようです・・・')
  }
})

// 起動時: カテゴリ内の未匿名メッセージをスキャンして処理
async function scanUnprocessed() {
  const channels = Client.channels.cache.filter(
    (ch): ch is Discord.TextChannel =>
      ch.type === 'GUILD_TEXT' &&
      (ch as Discord.TextChannel).parentId === CH_CATEGORY &&
      ch.id !== MAKE_CH_CHANNEL
  )

  for (const channel of channels.values()) {
    const messages = await channel.messages.fetch({ limit: 100 })
    const unprocessed = [...messages.values()]
      .filter(m => !m.author.bot)
      .sort((a, b) => a.createdTimestamp - b.createdTimestamp)

    if (unprocessed.length === 0) continue

    console.log(`[SCAN] ${channel.name}: ${unprocessed.length}件を匿名化`)
    for (const message of unprocessed) {
      await thread_update(message, db, channel)
      await new Promise(r => setTimeout(r, 500))
    }
  }
}

Client.on('messageCreate', async (message) => {
  if (message.author.bot) return

  // スレ建てコマンド
  if (message.channel.id === MAKE_CH_CHANNEL) {
    await MakeThread(message)
    return
  }

  const channel = Client.channels.cache.get(message.channel.id) as Discord.TextChannel
  await channel.messages.fetch(message.id)

  if (channel.parentId === CH_CATEGORY) {
    await thread_update(message, db, channel)
  }
})

Client.on('ready', async () => {
  console.log('起動')
  await scanUnprocessed()
})

Client.login(DISCORD_TOKEN)
