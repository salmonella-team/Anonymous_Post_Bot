// スレッド管理コマンド
import * as Discord from 'discord.js'
import {CH_CATEGORY} from '../settings'

// スレッド作成 (/mk2ch <スレ名>)
export async function MakeThread(message: Discord.Message): Promise<boolean> {
  if (!message.content.startsWith('/mk2ch')) return false

  const args = message.content.trim().split(/\s+/)
  if (args.length < 2) {
    await message.reply('使い方: `/mk2ch <スレ名>`')
    return true
  }

  const threadName = args.slice(1).join(' ')
  const guild = message.guild
  if (!guild) return true

  const category = guild.channels.cache.get(CH_CATEGORY) as Discord.CategoryChannel
  if (!category) {
    await message.reply('カテゴリが見つかりませんでした')
    return true
  }

  await guild.channels.create(threadName, {
    type: 'GUILD_TEXT',
    parent: category,
  })

  await message.delete()
  return true
}
