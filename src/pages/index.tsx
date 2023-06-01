import { Context } from "hono"
import { Colour } from "../Colour"
import { getColours } from "../services/colour-service"

const Layout = (props: { children?: string, colours: Colour[] }) => {
  return (
    <html>
      <head>
      <title>Colour Gallery</title>
      <meta charset="UTF-8" />
      <link rel="stylesheet" href="static/resets.css" />
      <link rel="stylesheet" href="static/styles.css" />
      </head>

    <body>
    <header>Colour Gallery</header>

    <main class="colour-grid">
      {props.colours.map(c => <div class="colour" style={`background: ${c.hexCode};`}></div>)}
      <button class="colour create-colour">Add +</button>
    </main>

    <div class="modal">
			<input type="color">Choose your colour</input>
		</div>

    <script src="src/index.js"></script>
  </body>
  </html>
  )
}

export default async function indexPageFn(c: Context) {
  const colours = await getColours(c.env.DB);

  return c.html(<Layout colours={colours} />)
}