import type { BaseComponent } from "./components.js";
import type { Radk, Krad } from "./radk.js";

import { ComponentSearchPanel } from "./ComponentSearchPanel.js";
import { Kanji } from "./kanji.js";
import { loadRadk, loadKrad } from "./radk.js";

async function init() {
  // Preload radk.json and krad.json
  const [radk, krad] = await Promise.all([loadRadk("radk.json"), loadKrad("krad.json")]);

  // Initializes the component list
  const componentPanel = new ComponentSearchPanel(radk, krad);

  // Connects the results
  document.addEventListener("componentlistchanged", (e) => {
    const resultList = document.querySelector(".result-list");
    if (resultList === null) {
      throw "Coudn't find result list";
    }
    resultList.innerHTML = "";

    // Filters the active components
    const activeCompList = Object.entries(componentPanel.state).filter(([comp, state]) => {
      return state === "active";
    }).map(([comp, ]) => {
      return comp;
    });

    // TODO: Organize by number of strokes
    // TODO: Buffer output to DOM

    // Shows the results
    for (const result of Kanji.searchByComponents(activeCompList, radk))  {
      let resultElement = document.createElement("li");
      resultElement.className = "result";
      resultElement.innerText = result.char;
      resultElement.addEventListener("click", (e) => {
        navigator.clipboard.writeText((e.target! as HTMLElement).innerText);
      });
      resultList.appendChild(resultElement);
    }
  });
}

init();
