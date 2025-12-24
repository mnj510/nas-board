// 관리자 계정 생성 스크립트
// 사용법: node scripts/create-admin.js

const bcrypt = require('bcryptjs')
const { Pool } = require('pg')
require('dotenv').config({ path: '.env.local' })

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'nas_board',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
})

async function createAdmin() {
  const email = 'mnj510@naver.com'
  const password = 'asdf6014'
  const name = '관리자'

  try {
    // 비밀번호 해시 생성
    const passwordHash = await bcrypt.hash(password, 10)

    // 관리자 계정 생성 또는 업데이트
    const result = await pool.query(
      `INSERT INTO profiles (email, name, password_hash, is_admin)
       VALUES ($1, $2, $3, true)
       ON CONFLICT (email) 
       DO UPDATE SET password_hash = $3, is_admin = true, name = $2
       RETURNING id, email, name, is_admin`,
      [email, name, passwordHash]
    )

    console.log('✅ 관리자 계정이 생성/업데이트되었습니다:')
    console.log(result.rows[0])
  } catch (error) {
    console.error('❌ 오류 발생:', error)
  } finally {
    await pool.end()
  }
}

createAdmin()

