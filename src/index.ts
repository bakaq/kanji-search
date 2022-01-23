import { KanjiComponents } from "./components.js";

// Searches the kanji with the given component
function searchByComponent(comp: string, radkfile: string): string[] {
  console.log(`Searching component: ${comp}`);

  const regex = new RegExp(`\\$ ${comp}.*\n((?:.|\n)*?)\n\\$`, "g");
  const matches = radkfile.matchAll(regex);
  const match = matches.next().value[1];
  return match.split("\n").join().split("");
} 

// Searchs the kanji with the given components
function searchByComponents(componentList: string[], radkfile: string): string[] {
  if (componentList.length === 0) {
    return [];
  }

  let kanjiList = searchByComponent(componentList[0], radkfile);

  for (const comp of componentList.slice(1)) {
    console.log(`Searching ${comp}`);
    // Intersection
    const compKanji = searchByComponent(comp, radkfile);
    kanjiList = kanjiList.filter((value) => {
      return compKanji.includes(value);
    });
  }

  return kanjiList;
}

async function init() {
  // Initializes the component list
  const components = new KanjiComponents();
  await components.init();

  // Preload radkfile
  const request = await fetch("radkfile-utf8");
  const radkfile = await request.text();

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

    // Shows the results
    for (const result of searchByComponents(activeCompList, radkfile))  {
      resultList.innerHTML += `<li class="result">${result}</li>`;
    }
  });
}

init();
