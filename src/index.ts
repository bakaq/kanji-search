import { KanjiComponents } from "./components.js";

async function init() {
  // Initializes the component list
  const components = new KanjiComponents();
  await components.init();
}

init();
