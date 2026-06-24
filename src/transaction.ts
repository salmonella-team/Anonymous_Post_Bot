import * as Discord from 'discord.js'
import {Response} from './commands/response'

// チャンネル履歴から最後のレス番号を取得（DB消失時の復元用）
async function getLastResCount(channel: Discord.TextChannel): Promise<number> {
  const messages = await channel.messages.fetch({ limit: 100 })
  for (const msg of messages.values()) {
    if (msg.author.bot) {
      const match = msg.content.match(/^\*\*(\d+)\*\*/)
      if (match) return parseInt(match[1])
    }
  }
  return 0
}

// thread更新
export async function thread_update(message: any, db: any, channel: Discord.TextChannel): Promise<void> {
  console.log(channel.id + 'を更新します')

  await new Promise<void>((resolve, reject) => {
    db.serialize(() => {
      db.run('BEGIN TRANSACTION')
      db.get("SELECT * from thread where id = ?", [channel.id], async function(err: any, row: any) {
        if (err) {
          db.run('ROLLBACK')
          reject(err)
          return
        }

        if (row == null) {
          // DBにない場合、チャンネル履歴から最後のレス番号を取得して再開
          const lastCount = await getLastResCount(channel)
          const newCount = lastCount + 1
          db.run('INSERT OR REPLACE INTO thread(id, thread_count) VALUES(?, ?)', [channel.id, newCount])
          db.run('COMMIT')
          await Response(message, channel, newCount)
        } else {
          const newCount = row["thread_count"] + 1
          db.run('UPDATE thread set thread_count = ? where id = ?', [newCount, channel.id])
          db.run('COMMIT')
          await Response(message, channel, newCount)
        }
        resolve()
      })
    })
  })
}
