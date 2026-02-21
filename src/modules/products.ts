import { Hono } from 'hono'
import db from '../DB/database.js'

const app = new Hono()

app.post('/', async (c) => {
  const body = await c.req.json()

  const result = db
    .prepare('INSERT INTO product (product_name, price) VALUES (?, ?)')
    .run(body.product_name, body.price)

  return c.json({
    message: 'Product created',
    id: result.lastInsertRowid
  })
})

app.get('/', (c) => {
  const products = db.prepare('SELECT * FROM product').all()
  return c.json({ data: products })
})

export default app
