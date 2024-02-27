// Copyright 2023 Kauê Hunnicutt Bazilli
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { BaseComponent } from "./components.js";
import type { Radk, KanjiInfo } from "./kanjiInfo.js";

import { ComponentSearchPanel } from "./ComponentSearchPanel.js";
import { Kanji } from "./kanji.js";
import { loadRadk, loadKanjiInfo } from "./kanjiInfo.js";

function log(text: string) {
  // TODO: proper null handling
  const logger = document.querySelector(".logger")! as HTMLElement;
  logger.innerText = text;
}

async function init() {
  // Preload radk.json and kanjiInfo.json
  const [radk, kanjiInfo] = await Promise.all([
    loadRadk("radk.json"),
    loadKanjiInfo("kanjiInfo.json"),
  ]);

  // Initializes the component list
  const componentPanel = new ComponentSearchPanel(radk, kanjiInfo);

  // Connects the results
  // TODO: Put this in ComponentSearchPanel.ts
  // TODO: Proper null handling
  const componentList = document.querySelector(".component-list")!;
  componentList.addEventListener(
    "componentlistchange",
    (e: CustomEventInit) => {
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
      for (let strokes = 0; strokes < kanjiByStrokes.length; strokes++) {
        if (kanjiByStrokes[strokes] === undefined) {
          continue
        }

        // Number of strokes
        let strokesElement = document.createElement("li");
        strokesElement.className = "stroke-count";
        strokesElement.innerText = strokes.toString();
        resultList.appendChild(strokesElement);

        // All the kanji with that number of strokes
        for (const kanji of kanjiByStrokes[strokes])  {
          let resultElement = document.createElement("li");
          resultElement.className = "result";
          resultElement.innerText = kanji.char;
          resultElement.addEventListener("click", (e) => {
            const kanjiChar = (e.target! as HTMLElement).innerText;
            if (navigator.clipboard) {
              navigator.clipboard.writeText(kanjiChar);
            } else {
              // Mobile workaround
              const tmpText = document.createElement("textarea");
              tmpText.value = kanjiChar;
              document.body.appendChild(tmpText);
              tmpText.select();
              document.execCommand("copy");
              document.body.removeChild(tmpText);
            }
            log(`Copied ${kanjiChar} to clipboard`);
          });
          resultList.appendChild(resultElement);
        }
      }
    }
  );
}

// Register service worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js")
} else {
  console.error("No service worker support")
}

init();
