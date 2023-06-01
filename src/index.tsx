import { Hono } from 'hono'

import { jsx } from 'hono/jsx'

import { serveStatic } from 'hono/cloudflare-workers'

import indexPageFn from './pages/index'
import { getColours, Colour } from './services/colour-service'

type Bindings = {
	DB: D1Database;
}

const app = new Hono<{ Bindings: Bindings }>()

// TODO: validation
// https://hono.dev/concepts/stacks

// TODO:
// app.basePath('/api')

app.get('/', indexPageFn)

app.get('/colours', async c => {
    console.log("GET /colours")

    const a = c.env.DB

    const colours = getColours(c);
    
    return c.json(
colours
      )
})

app.post('/colours', async c => {
  // Do something and return an HTTP response
  const { hexCode, name } = await c.req.json()

  if (!hexCode) return c.json({ success: false, error: "Missing hexCode value for new colour"}, 400)
  if (!name) return c.json({ success: false, error: "Missing name value for new colour"}, 400)

  const { success } = await c.env.DB.prepare(`
    insert into colours (hex_code, name) values (?, ?)
  `).bind(hexCode, name).run()

  if (success) {
    c.status(201)
    return c.json({ success: true })
  } else {
    c.status(500)
    return c.json({ success: false })
  }
})

app.delete('/colours/:hexCode', async c => {
// TODO: pull out the auth header value and throw if it's not
// equal to some secret hardcoded 'password' value
  const { hexCode } = c.req.param()

  const { success } = await c.env.DB.prepare(`
    delete from colours where hex_code = ?
  `).bind(hexCode).run()

  if (success) {
    c.status(200)
    return c.json({ success: true })
  } else {
    c.status(500)
    return c.json({ success: false })
  }
})

// app.get('/', serveStatic({ path: './index.html' }))
app.get('/static/*', serveStatic({ root: './' }))
app.get('/favicon.ico', serveStatic({ path: './favicon.ico' }))

export default app