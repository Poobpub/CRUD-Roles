import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import db from '../DB/database.js'

const app = new Hono()

/* =========================
   Validation Schemas
========================= */

const createSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(8),
  firstname: z.string().optional(),
  lastname: z.string()
})

const updateSchema = z.object({
  username: z.string().min(3).optional(),
  password: z.string().min(8).optional(),
  firstname: z.string().optional(),
  lastname: z.string().optional()
})

/* =========================
   CREATE
========================= */

app.post(
  '/',
  zValidator('json', createSchema),
  async (c) => {
    const body = await c.req.json()

    const stmt = db.prepare(`
      INSERT INTO user (username, passwd, f_name, l_name)
      VALUES (?, ?, ?, ?)
    `)

    const result = stmt.run(
      body.username,
      body.password,
      body.firstname ?? '',
      body.lastname
    )

    const newUser: any = db
      .prepare('SELECT * FROM user WHERE id = ?')
      .get(result.lastInsertRowid)

    if (newUser) {
      delete newUser.passwd
    }

    return c.json(
      { message: 'User created', data: newUser },
      201
    )
  }
)

/* =========================
   READ
========================= */

app.get('/:id', (c) => {
  const id = Number(c.req.param('id'))

  if (isNaN(id)) {
    return c.json({ message: 'Invalid ID' }, 400)
  }

  const user: any = db
    .prepare('SELECT * FROM user WHERE id = ?')
    .get(id)

  if (!user) {
    return c.json({ message: 'User not found' }, 404)
  }

  delete user.passwd

  return c.json({ data: user }, 200)
})

/* =========================
   UPDATE
========================= */

app.put(
  '/:id',
  zValidator('json', updateSchema),
  async (c) => {
    const id = Number(c.req.param('id'))

    if (isNaN(id)) {
      return c.json({ message: 'Invalid ID' }, 400)
    }

    const body = await c.req.json()

    const stmt = db.prepare(`
      UPDATE user
      SET
        username = COALESCE(?, username),
        passwd = COALESCE(?, passwd),
        f_name = COALESCE(?, f_name),
        l_name = COALESCE(?, l_name)
      WHERE id = ?
    `)

    const result = stmt.run(
      body.username ?? null,
      body.password ?? null,
      body.firstname ?? null,
      body.lastname ?? null,
      id
    )

    if (result.changes === 0) {
      return c.json({ message: 'User not found' }, 404)
    }

    const updatedUser: any = db
      .prepare('SELECT * FROM user WHERE id = ?')
      .get(id)

    if (updatedUser) {
      delete updatedUser.passwd
    }

    return c.json(
      { message: 'User updated', data: updatedUser },
      200
    )
  }
)

/* =========================
   DELETE
========================= */

app.delete('/:id', (c) => {
  const id = Number(c.req.param('id'))

  if (isNaN(id)) {
    return c.json({ message: 'Invalid ID' }, 400)
  }

  const result = db
    .prepare('DELETE FROM user WHERE id = ?')
    .run(id)

  if (result.changes === 0) {
    return c.json({ message: 'User not found' }, 404)
  }

  return new Response(null, { status: 204 })
})

export default app
