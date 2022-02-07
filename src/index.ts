import * as Discord from 'discord.js'
import * as sqlite from 'sqlite3'
import {Partials, Intents, DISCORD_TOKEN, CH_CATEGORY, SQLITE_PATH} from './settings'
import {Response} from './commands/response'

// DB接続
const db = new sqlite.Database(SQLITE_PATH, (err: any) => {
  if (err) {
    return console.log('データーベースが何かおかしいようです・・・')
  }
}
)


db.serialize()


export const Client = new Discord.Client({
  partials: Partials,
  intents: Intents,
})

Client.on('messageCreate', async (message) => {

  // チャンネルをキャッシュ
  const channel = Client.channels.cache.get(message.channel.id) as Discord.TextChannel
  await channel.messages.fetch(message.id)

  // botの投稿を無視する
  if (message.author.bot) {
    return
  }

  // メッセージが投稿されたチャンネルが指定カテゴリの場合発火　
  else if (channel.parentId === CH_CATEGORY) {
    // console.log(await channel.messages.fetch())
    Response(message, channel)
    // const msgs = (await channel.messages.fetch()).map(m => m)
    // console.log(msgs)
  }
})

// 起動時にコンソール出力
Client.on('ready', () =>
  console.log('起動')
)

Client.login(DISCORD_TOKEN)
