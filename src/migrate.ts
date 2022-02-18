import * as sqlite from 'sqlite3'
import {SQLITE_PATH} from './settings'

// DB接続
const db = new sqlite.Database(SQLITE_PATH, (err: any) => {
    if (err) {
      return console.log('データーベースが何かおかしいようです・・・')
    }
  }
  )


db.serialize(() => {
    db.run('BEGIN TRANSACTION')
    db.run('CREATE TABLE thread(id unique, thread_count int)')
    db.run('COMMIT')
})

console.log("マイグレート完了")