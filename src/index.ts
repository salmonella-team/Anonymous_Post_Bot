import * as Discord from 'discord.js'
import {Partials, Intents, DISCORD_TOKEN} from './settings'
export const Client = new Discord.Client({
  partials: Partials,
  intents: Intents,
})

Client.on('messageCreate', (message) => {
  if (message.author.bot) {
    return
  }
  if (message.content === 'おはよう') {
    message.reply('おっはー')
    message.reply({content: '直接10連ガチャ', allowedMentions: {repliedUser: false}})
  }
})

Client.on('messageReactionAdd', async (reaction) => {
    console.log(reaction.emoji)
  if (reaction.message.author?.bot) {
    return
  } 
  if (reaction.emoji.id === '746666213370757231') {
    // 起動前のメッセージを取得できないためキャッシュを取得
    const channel = Client.channels.cache.get(reaction.message.channel.id) as Discord.TextChannel
    await channel.messages.fetch(reaction.message.id)
    const reaction_riamu_count = reaction.message.reactions.cache.get('746666213370757231')?.count
    reaction.message.reply(`りあむ絵文字は${reaction_riamu_count}個です`)
  }
})

// 起動時にコンソール出力
Client.on('ready', () =>
  console.log('起動')
)

Client.login(DISCORD_TOKEN)
