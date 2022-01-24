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
import { loadRadk, loadKanjiInfo } from "./kanjiInfo.js";
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        // Preload radk.json and kanjiInfo.json
        const [radk, kanjiInfo] = yield Promise.all([loadRadk("radk.json"), loadKanjiInfo("kanjiInfo.json")]);
        // Initializes the component list
        const componentPanel = new ComponentSearchPanel(radk, kanjiInfo);
        // Connects the results
        // TODO: Put this in ComponentSearchPanel.ts
        // TODO: Proper null handling
        document.querySelector(".component-list").addEventListener("componentlistchange", (e) => {
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
                }
                else {
                    kanjiByStrokes[strokes].push(kanji);
                }
            }
            // Shows the results
            // TODO: Buffer output to DOM
            for (let strokeCount = 0; strokeCount < kanjiByStrokes.length; strokeCount++) {
                if (kanjiByStrokes[strokeCount] === undefined) {
                    continue;
                }
                // Number of strokes
                let strokeCountElement = document.createElement("li");
                strokeCountElement.className = "stroke-count";
                strokeCountElement.innerText = strokeCount.toString();
                resultList.appendChild(strokeCountElement);
                // All the kanji with that number of strokes
                for (const kanji of kanjiByStrokes[strokeCount]) {
                    let resultElement = document.createElement("li");
                    resultElement.className = "result";
                    resultElement.innerText = kanji.char;
                    resultElement.addEventListener("click", (e) => {
                        navigator.clipboard.writeText(e.target.innerText);
                    });
                    resultList.appendChild(resultElement);
                }
            }
        });
    });
}
init();
