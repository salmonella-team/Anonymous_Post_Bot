
// thread更新
export function thread_update(db: any, channel_id:string) {
    console.log(channel_id+'に書き込みがありました。更新します。')
    db.serialize(() => {
        db.run('BEGIN TRANSACTION')
        db.each('SELECT * FROM thread WHERE id = ?', [channel_id], (err: any, row: any) => {
            if (err) {
                return console.log('データーベースの何かがおかしいようです。', err)
            }
            console.log('----------')
            console.log(row.thread_count)
            console.log('----------')
            db.run('COMMIT')
            db.close((err :any) => {
                if(err) {
                    return console.log('データーベースの接続解除中にエラーが発生しました', err)
                }
                console.log('更新終了')
            })
        })
    })
    
}


// export function thread_update(db: any, channel_id:string) {
//     console.log(channel_id+'を更新します')
//     db.run('BEGIN TRANSACTION')
//     // チャンネルIDのレコードがあるか検索なければ追加
//     db.each('SELECT * FROM thread WHERE id = ?', [channel_id], (err: any, row: any) => {
//         let count = row['thread_count']
//         if (err) {
//             return console.error('データーベースが何かおかしいようです・・・')
//         }
//         else if (row['thread_count'] == null) {
//             db.run('INSERT OR REPLACE INTO thread(id, thread_count) VALUES(?, ?)',[channel_id, 1])
//             db.run('COMMIT')
//             db.close
//             return count
//         }
//         else if (row['thread_count'] != null) {
//             db.run('INSERT OR REPLACE INTO thread(id, thread_count) VALUES(?, ?)',[channel_id, row['thread_count'] + 1])
//             db.run('COMMIT')
//             db.close
//             return count
//         }
//         else {
//             db.run('INSERT OR REPLACE INTO thread(id, thread_count) VALUES(?, ?)',[channel_id, 1])
//             db.run('COMMIT')
//             db.close
//             return 1
//         }
//     }
//     )
// }