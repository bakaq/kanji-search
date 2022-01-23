import type { BaseComponent } from "./components.js";

import { KanjiComponents } from "./components.js";

type Kanji = string;

type RadkJson = Record<BaseComponent, {strokes: number, kanji: Kanji[]}>;

// Searchs the kanji with the given components
function searchByComponents(componentList: BaseComponent[], radk: RadkJson): Kanji[] {
  if (componentList.length === 0) {
    return [];
  }

  let kanjiList = radk[componentList[0]].kanji;

  for (const comp of componentList.slice(1)) {
    // Intersection
    kanjiList = kanjiList.filter((value) => {
      return radk[comp].kanji.includes(value);
    });
  }

  return kanjiList;
}

async function init() {
  // Initializes the component list
  const components = new KanjiComponents();
  await components.init();

  // Preload radk.json
  const request = await fetch("radk.json");
  const radk = await request.json();

  // Connects the results
  document.addEventListener("componentlistchanged", (e) => {
    const resultList = document.querySelector(".result-list");
    if (resultList === null) {
      throw "Coudn't find result list";
    }
    resultList.innerHTML = "";

    // Filters the active components
    const activeCompList = Object.entries(components.state).filter(([comp, state]) => {
      return state;
    }).map(([comp, ]) => {
      return comp;
    });

    // TODO: Organize by number of strokes
    // TODO: Buffer output to DOM

    // Shows the results
    for (const result of searchByComponents(activeCompList, radk))  {
      let resultElement = document.createElement("li");
      resultElement.className = "result";
      resultElement.innerText = result;
      resultList.appendChild(resultElement);
    }
  });
}

init();
