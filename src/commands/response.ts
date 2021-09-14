//　レス管理
import * as Discord from 'discord.js'
import dayjs from 'dayjs'
import 'dayjs/locale/ja'

export function Response(message: Discord.Message, channel: Discord.TextChannel) {
  if (message.attachments.size) {

    // 添付された全ての画像(ファイル)のURLを取得する
    const files = message.attachments.map(attachment => attachment.url)
    message.delete()

    // ファイルを指定してメッセージを送信する
    message.channel.send({})
    channel.send(`**000** ${channel.topic} **${dayjs(Date()).locale('ja').format('YYYY/MM/DD(dd) hh:mm:ss')}** \n${ files }`)
    return
  }
  else {
    const re_post_message = message.content
    message.delete()
    console.log(channel.messages)
    channel.send(`**000** ${channel.topic} **${dayjs(Date()).locale('ja').format('YYYY/MM/DD(dd) hh:mm:ss')}** \n${re_post_message}`)
    return
  }
}