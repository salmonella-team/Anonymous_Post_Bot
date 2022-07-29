import {Response} from './commands/response'

// thread更新
export function thread_update(message: any, db: any, channel: any): any{
    console.log(channel.id+'を更新します')
    db.serialize(() => {
        db.run('BEGIN TRANSACTION')
        db.get("SELECT * from thread where id = ?", [channel.id],function(err: any, row: any) {
            if (err) {
                throw err
            }
            else if (row == null) {
                db.run('INSERT OR REPLACE INTO thread(id, thread_count) VALUES(?, ?)',[channel.id, 1])
                db.run('COMMIT')
                Response(message, channel, 1)
                return
            }
            else if (row != null) {
                db.run('UPDATE thread set thread_count = ? where id = ? ', [row["thread_count"] + 1, channel.id])
                db.run('COMMIT')
                Response(message, channel, row["thread_count"] + 1)
                return
            }
        })
    })
}
