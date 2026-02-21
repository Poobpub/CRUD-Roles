import { Hono } from 'hono'
import db from '../DB/database.js'

const app = new Hono()

app.post('/', async (c) => {
  const body = await c.req.json()

  const result = db
    .prepare('INSERT INTO role (role_name) VALUES (?)')
    .run(body.role_name)

  return c.json({
    message: 'Role created',
    id: result.lastInsertRowid
  })
})

app.get('/', (c) => {
  const roles = db.prepare('SELECT * FROM role').all()
  return c.json({ data: roles })
})

export default app
