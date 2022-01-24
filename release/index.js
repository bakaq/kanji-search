// Copyright 2022 Kauê Hunnicutt Bazilli
// 
// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.
// 
// This program is distributed in the hope that it will be useful, but WITHOUT
// ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
// FOR A PARTICULAR PURPOSE. See the GNU General Public License for more
// details.
// 
// You should have received a copy of the GNU General Public License along with
// this program. If not, see <https://www.gnu.org/licenses/>.
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
        const [radk, kanjiInfo] = yield Promise.all([
            loadRadk("radk.json"),
            loadKanjiInfo("kanjiInfo.json"),
        ]);
        // Initializes the component list
        const componentPanel = new ComponentSearchPanel(radk, kanjiInfo);
        // Connects the results
        // TODO: Put this in ComponentSearchPanel.ts
        // TODO: Proper null handling
        const componentList = document.querySelector(".component-list");
        componentList.addEventListener("componentlistchange", (e) => {
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
            for (let strokes = 0; strokes < kanjiByStrokes.length; strokes++) {
                if (kanjiByStrokes[strokes] === undefined) {
                    continue;
                }
                // Number of strokes
                let strokesElement = document.createElement("li");
                strokesElement.className = "stroke-count";
                strokesElement.innerText = strokes.toString();
                resultList.appendChild(strokesElement);
                // All the kanji with that number of strokes
                for (const kanji of kanjiByStrokes[strokes]) {
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
