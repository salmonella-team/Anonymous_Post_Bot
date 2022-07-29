//　レス管理
import * as Discord from 'discord.js'
import dayjs from 'dayjs'
import 'dayjs/locale/ja'

export function Response(message: Discord.Message, channel: Discord.TextChannel, count: any) {
  // チャンネルの説明を取得→分割
  const topic: any = channel.topic
  const channel_setting = topic.split(' ')

  // 分割
  const nanashi_name = channel_setting[0]

  // レス番号処理
  const res_count = count
  
  // 画像なし
  if (message.attachments.size == 0){
    console.log("画像なし")
    const re_post_message = message.content
    message.delete()
    // console.log(channel.topic)
    channel.send(`**${res_count}** ${nanashi_name} **${dayjs(Date()).locale('ja').format('YYYY/MM/DD(dd) hh:mm:ss')}** \n${re_post_message}`)
    return
  }

  else if (message.attachments.size >= 1) {
    console.log("画像あり")
    // 添付された全ての画像(ファイル)のURLを取得する
    const files = message.attachments.map(attachment => attachment.url)
    message.delete()
    // ファイルを指定してメッセージを送信する
    //message.channel.send({})
    channel.send(`**${res_count}** ${nanashi_name} **${dayjs(Date()).locale('ja').format('YYYY/MM/DD(dd) hh:mm:ss')}** \n${ files }`)
    return
  }
}