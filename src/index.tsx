import { Hono } from "hono";

import { serveStatic } from "hono/cloudflare-workers";

import indexPageFn, { IndexPage } from "./pages/index";
import { getColours } from "./services/colour-service";

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

// TODO: validation
// https://hono.dev/concepts/stacks

// TODO:
// app.basePath('/api')

app.get("/", indexPageFn);

app.get("/colours", async (c) => {
  console.log("GET /colours");

  const colours = getColours(c);

  return c.json(colours);
});

app.post("/colours", async (c) => {
  // check type and respond differently
  const t = c.req.headers.get("content-type");
  console.log("t", t);

  // reference
  // https://api.rubyonrails.org/classes/ActionController/MimeResponds.html#method-i-respond_to
  // for how to make this better
  if (t === "application/x-www-form-urlencoded") {
    const { hexCode, name } = await c.req.parseBody();

    if (!hexCode) return c.html(<p>Error: missing colour hex code</p>, 400);
    if (!name) return c.html(<p>Error: missing colour name</p>, 400);

    const { success, error, meta } = await c.env.DB.prepare(
      `
    insert into colours (hex_code, name) values (?, ?)
  `
    )
      .bind(hexCode, name)
      .run();

    const colours = await getColours(c.env.DB);

    if (success) {
      // c.status(201);
      return c.redirect('/');
      // return c.html(
      //   <IndexPage
      //     colours={colours}
      //     messages={["Successfully added your colour"]}
      //     errors={[]}
      //   />
      // );
    } else {
      c.status(500);
      return c.html(
        <IndexPage
          colours={colours}
          messages={[]}
          errors={[`Oops, could not add your colour. ${error}`]}
        />
      );    }
  } else {
  }

  // Do something and return an HTTP response
  const { hexCode, name } = await c.req.json();

  if (!hexCode)
    return c.json(
      { success: false, error: "Missing hexCode value for new colour" },
      400
    );
  if (!name)
    return c.json(
      { success: false, error: "Missing name value for new colour" },
      400
    );

  const { success } = await c.env.DB.prepare(
    `
    insert into colours (hex_code, name) values (?, ?)
  `
  )
    .bind(hexCode, name)
    .run();

  if (success) {
    c.status(201);
    return c.json({ success: true });
  } else {
    c.status(500);
    return c.json({ success: false });
  }
});

app.delete("/colours/:hexCode", async (c) => {
  // TODO: pull out the auth header value and throw if it's not
  // equal to some secret hardcoded 'password' value
  const { hexCode } = c.req.param();

  const { success } = await c.env.DB.prepare(
    `
    delete from colours where hex_code = ?
  `
  )
    .bind(hexCode)
    .run();

  if (success) {
    c.status(200);
    return c.json({ success: true });
  } else {
    c.status(500);
    return c.json({ success: false });
  }
});

// app.get('/', serveStatic({ path: './index.html' }))
app.get("/static/*", serveStatic({ root: "./" }));
app.get("/favicon.ico", serveStatic({ path: "./favicon.ico" }));

export default app;
