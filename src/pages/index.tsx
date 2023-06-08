import { Context } from "hono";
import { getColours, Colour } from "../services/colour-service";

const MODAL_ELEMENT_CLASS = "add-colour-modal";

const AddColourModal = () => {
  return (
    <dialog
      class={MODAL_ELEMENT_CLASS}
      style="padding: 0"
      onclick="event.target==this && this.close()"
    >
      <div class="modal-content">
        <form class="close-form">
          <h2>Add a colour</h2>
          <button
            type="submit"
            aria-label="close"
            formmethod="dialog"
            formnovalidate
          >
            ✕
          </button>
        </form>
        <form action="/colours" method="post" onsubmit="document.getElementById('colour-submit').setAttribute('disabled', true); document.getElementById('colour-submit').classList.add('loading')">
          <div class="add-colour-modal-form-area">
            <p>
              <label for="hexCode">Colour</label>
              <input required type="color" id="hexCode" name="hexCode" />
            </p>
            <p>
              <label for="name">Name</label>
              <input required type="text" id="name" name="name" />
            </p>
          </div>

          <button type="submit" formmethod="post" id="colour-submit">
            Save
          </button>
        </form>
      </div>
    </dialog>
  );
};

export const IndexPage = (props: {
  children?: string;
  colours: Colour[];
  messages: any[];
  errors: any[];
}) => {
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
        <div>
          {props.messages?.map((m) => (
            <p class="message">{m}</p>
          ))}
        </div>
        <div>
          {props.errors?.map((e) => (
            <p class="error">{e}</p>
          ))}
        </div>

        <main class="colour-grid">
          {props.colours.map((c) => (
            <div class="colour-container">
              <div class="colour" style={`background: ${c.hexCode};`}>
                <div class="colour-code">{c.hexCode}</div>
              </div>
              <p>{c.name}</p>
            </div>
          ))}
          <button
            class="colour create-colour"
            onclick={`document.querySelector('.${MODAL_ELEMENT_CLASS}')?.showModal()`}
          >
            Add +
          </button>
        </main>

        <AddColourModal />

        {/* <script src="static/index.js"></script> */}
      </body>
    </html>
  );
};

export default async function indexPageFn(c: Context) {
  const colours = await getColours(c.env.DB);

  return c.html(<IndexPage colours={colours} messages={[]} errors={[]} />);
}
