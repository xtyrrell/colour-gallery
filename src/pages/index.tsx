import { Context } from "hono";
import { getColours, Colour } from "../services/colour-service";

const MODAL_ELEMENT_CLASS = "add-colour-modal";

const AddColourModal = () => {
  return (
    <dialog class={MODAL_ELEMENT_CLASS}>
      <form>
        <button
          type="submit"
          aria-label="close"
          formmethod="dialog"
          formnovalidate
        >
          ✕
        </button>
      </form>
      <form action="/colours" method="post">
        <h2>Add a colour</h2>
        <p>
          <input type="color" id="hexCode" name="hexCode" />
          <label for="hexCode">Colour</label>
        </p>
        <p>
          <input type="text" id="name" name="name" />
          <label for="name">Name</label>
        </p>

        <p>
          <button type="submit" formmethod="post">
            Submit
          </button>
        </p>
      </form>
    </dialog>
  );
};

export const IndexPage = (props: { children?: string, colours: Colour[], messages: any[], errors: any[] }) => {
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
        <div>{props.messages?.map(m => <p>{m}</p>)}</div>
        <div>{props.errors?.map(e => <p>{e}</p>)}</div>

        <main class="colour-grid">
          {props.colours.map((c) => (
            <div class="colour" style={`background: ${c.hexCode};`}></div>
          ))}
          <button
            class="colour create-colour"
            onclick={`document.querySelector('.${MODAL_ELEMENT_CLASS}')?.showModal()`}
          >
            Add +
          </button>
        </main>

        <AddColourModal />

        <script src="src/index.js"></script>
      </body>
    </html>
  );
};

export default async function indexPageFn(c: Context) {
  const colours = await getColours(c.env.DB);

  return c.html(<IndexPage colours={colours} />);
}
