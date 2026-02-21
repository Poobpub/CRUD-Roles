import { serve } from '@hono/node-server'
import { Hono } from 'hono'

import userModule from './modules/users.js'
import roleModule from './modules/roles.js'
import productModule from './modules/products.js'

const app = new Hono()

app.route('/api/users', userModule)
app.route('/api/roles', roleModule)
app.route('/api/products', productModule)

app.get('/', (c) => {
  return c.json({ status: 'API Running 🚀' })
})

serve(
  {
    fetch: app.fetch,
    port: 3000
  },
  (info) => {
    console.log(`Server started on http://localhost:${info.port}`)
  }
)
