var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ComponentSearchPanel } from "./ComponentSearchPanel.js";
import { Kanji } from "./kanji.js";
import { loadRadk, loadKanjiInfo } from "./kanjiInfo.js";
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        // Preload radk.json and kanjiInfo.json
        const [radk, kanjiInfo] = yield Promise.all([loadRadk("radk.json"), loadKanjiInfo("kanjiInfo.json")]);
        // Initializes the component list
        const componentPanel = new ComponentSearchPanel(radk, kanjiInfo);
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
            }).map(([comp,]) => {
                return comp;
            });
            // TODO: Organize by number of strokes
            // TODO: Buffer output to DOM
            // Shows the results
            for (const result of Kanji.searchByComponents(activeCompList, radk)) {
                let resultElement = document.createElement("li");
                resultElement.className = "result";
                resultElement.innerText = result.char;
                resultElement.addEventListener("click", (e) => {
                    navigator.clipboard.writeText(e.target.innerText);
                });
                resultList.appendChild(resultElement);
            }
        });
    });
}
init();
