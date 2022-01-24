import type { BaseComponent } from "./components.js";
import type { Radk, KanjiInfo } from "./kanjiInfo.js";

import { ComponentSearchPanel } from "./ComponentSearchPanel.js";
import { Kanji } from "./kanji.js";
import { loadRadk, loadKanjiInfo } from "./kanjiInfo.js";

async function init() {
  // Preload radk.json and kanjiInfo.json
  const [radk, kanjiInfo] = await Promise.all([loadRadk("radk.json"), loadKanjiInfo("kanjiInfo.json")]);

  // Initializes the component list
  const componentPanel = new ComponentSearchPanel(radk, kanjiInfo);

  // Connects the results
  // TODO: Put this in ComponentSearchPanel.ts
  // TODO: Proper null handling
  document.querySelector(".component-list")!.addEventListener("componentlistchange", (e: CustomEventInit) => {
    const resultList = document.querySelector(".result-list");
    if (resultList === null) {
      throw "Coudn't find result list";
    }
    resultList.innerHTML = "";

    // Gets selected kanji
    const selectedKanji = e.detail.selectedKanji;

    // Organize by number of strokes
    const kanjiByStrokes = [];

    for (const kanji of selectedKanji) {
      const strokes = kanji.getStrokes(kanjiInfo);
      if (kanjiByStrokes[strokes] === undefined) {
        kanjiByStrokes[strokes] = [kanji];
      } else {
        kanjiByStrokes[strokes].push(kanji);
      }
    }
    
    // Shows the results
    // TODO: Buffer output to DOM
    for (let strokeCount = 0; strokeCount < kanjiByStrokes.length; strokeCount++) {
      if (kanjiByStrokes[strokeCount] === undefined) {
        continue
      }

      // Number of strokes
      let strokeCountElement = document.createElement("li");
      strokeCountElement.className = "stroke-count";
      strokeCountElement.innerText = strokeCount.toString();
      resultList.appendChild(strokeCountElement);

      // All the kanji with that number of strokes
      for (const kanji of kanjiByStrokes[strokeCount])  {
        let resultElement = document.createElement("li");
        resultElement.className = "result";
        resultElement.innerText = kanji.char;
        resultElement.addEventListener("click", (e) => {
          navigator.clipboard.writeText((e.target! as HTMLElement).innerText);
        });
        resultList.appendChild(resultElement);
      }
    }
  });
}

init();
