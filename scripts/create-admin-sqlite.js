// SQLite 관리자 계정 생성 스크립트
const bcrypt = require('bcryptjs')
const Database = require('better-sqlite3')
const path = require('path')
const fs = require('fs')

const dbDir = path.join(__dirname, '..', 'data')
const dbPath = path.join(dbDir, 'nas_board.db')

// 디렉토리 생성
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

const db = new Database(dbPath)
db.pragma('foreign_keys = ON')

async function createAdmin() {
  const email = 'mnj510@naver.com'
  const password = 'asdf6014'
  const name = '관리자'

  try {
    // 비밀번호 해시 생성
    const passwordHash = await bcrypt.hash(password, 10)

    // 관리자 계정 생성 또는 업데이트
    const stmt = db.prepare(`
      INSERT INTO profiles (id, email, name, password_hash, is_admin)
      VALUES (?, ?, ?, ?, 1)
      ON CONFLICT(email) DO UPDATE SET
        password_hash = excluded.password_hash,
        is_admin = 1,
        name = excluded.name
    `)

    const userId = require('crypto').randomUUID()
    stmt.run(userId, email, name, passwordHash)

    console.log('✅ 관리자 계정이 생성/업데이트되었습니다:')
    console.log(`   이메일: ${email}`)
    console.log(`   비밀번호: ${password}`)
    console.log(`   ID: ${userId}`)
  } catch (error) {
    console.error('❌ 오류 발생:', error)
  } finally {
    db.close()
  }
}

createAdmin()

