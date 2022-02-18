
// thread更新
export function thread_update(db: any, channel_id:string) {
    console.log(channel_id+'を更新します')
    db.run('BEGIN TRANSACTION')
    // チャンネルIDのレコードがあるか検索なければ追加
    db.each('SELECT * FROM thread WHERE id = ?', [channel_id], (err: any, row: any) => {
        let count = row['thread_count']
        console.log(row)
        if (err) {
            return console.log('データーベースが何かおかしいようです・・・')
        }
        else if (row['thread_count'] == null) {
            db.run('INSERT OR REPLACE INTO thread(id, thread_count) VALUES(?, ?)',[channel_id, 1])
            db.run('COMMIT')
            db.close
            return count
        }
        else if (row['thread_count'] != null) {
            console.log('bbb')
            db.run('INSERT OR REPLACE INTO thread(id, thread_count) VALUES(?, ?)',[channel_id, row['thread_count'] + 1])
            db.run('COMMIT')
            db.close
            return count
        }
        else {
            console.log('aaaa')
            db.run('INSERT OR REPLACE INTO thread(id, thread_count) VALUES(?, ?)',[channel_id, 1])
            db.run('COMMIT')
            db.close
            return 1
        }
    }
    )

}