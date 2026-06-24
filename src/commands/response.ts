//　レス管理
import * as crypto from 'crypto'
import * as Discord from 'discord.js'
import dayjs from 'dayjs'
import 'dayjs/locale/ja'
import {BOT_SEED} from '../settings'

// 2ch風匿名ID生成（ユーザーID＋日付＋seedをSHA256ハッシュして7文字切り出し）
function getHashId(authorId: string): string {
  const date = dayjs().locale('ja').format('YYYY/MM/DD(dd)')
  const input = authorId + date + BOT_SEED
  return crypto.createHash('sha256').update(input).digest('hex').toUpperCase().substring(10, 17)
}

// 添付ファイルをBufferとしてダウンロード
async function downloadAttachment(url: string): Promise<Buffer> {
  const res = await fetch(url)
  return Buffer.from(await res.arrayBuffer())
}

// >>N のリプライ先メッセージを検索
async function findReplyTarget(channel: Discord.TextChannel, resNum: number): Promise<Discord.Message | null> {
  const messages = await channel.messages.fetch({ limit: 100 })
  for (const msg of messages.values()) {
    if (msg.author.bot) {
      const match = msg.content.match(/^\*\*(\d+)\*\*/)
      if (match && parseInt(match[1]) === resNum) return msg
    }
  }
  return null
}

export async function Response(message: Discord.Message, channel: Discord.TextChannel, count: any) {
  const topic: string = channel.topic ?? '腸まで届く名無しさん'
  const nanashi_name = topic.split(' ')[0]

  const timestamp = dayjs(Date()).locale('ja').format('YYYY/MM/DD(dd) HH:mm:ss')
  const anon_id = getHashId(message.author.id)
  const header = `**${count}** ${nanashi_name} **${timestamp}** ID:${anon_id}`

  // >>N 形式のリプライ先を検出
  const replyMatch = message.content.match(/>>(\d+)/)
  const replyTarget = replyMatch ? await findReplyTarget(channel, parseInt(replyMatch[1])) : null

  const text = message.content ? `${header}\n${message.content}` : header

  if (message.attachments.size === 0) {
    await message.delete()
    if (replyTarget) {
      await replyTarget.reply(text)
    } else {
      await channel.send(text)
    }
    return
  }

  // 削除前に全添付ファイルをダウンロードしてから再アップロード
  const attachments = [...message.attachments.values()]
  const files = await Promise.all(
    attachments.map(async a => {
      const buf = await downloadAttachment(a.url)
      return new Discord.MessageAttachment(buf, a.name ?? 'file')
    })
  )
  await message.delete()
  if (replyTarget) {
    await replyTarget.reply({ content: text, files })
  } else {
    await channel.send({ content: text, files })
  }
}
