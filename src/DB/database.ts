import Database from 'better-sqlite3'

const db = new Database('database.db', {
  verbose: console.log
})

// USER TABLE
db.exec(`
CREATE TABLE IF NOT EXISTS user (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL,
  passwd TEXT NOT NULL,
  f_name TEXT,
  l_name TEXT
)
`)

// ROLE TABLE
db.exec(`
CREATE TABLE IF NOT EXISTS role (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  role_name TEXT NOT NULL
)
`)

// PRODUCT TABLE
db.exec(`
CREATE TABLE IF NOT EXISTS product (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_name TEXT NOT NULL,
  price REAL NOT NULL
)
`)

export default db
