var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ComponentSearchPanel } from "./components.js";
// Searchs the kanji with the given components
function searchByComponents(componentList, radk) {
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
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        // Preload radk.json
        const request = yield fetch("radk.json");
        const radk = yield request.json();
        // Initializes the component list
        const componentPanel = new ComponentSearchPanel(radk);
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
            for (const result of searchByComponents(activeCompList, radk)) {
                let resultElement = document.createElement("li");
                resultElement.className = "result";
                resultElement.innerText = result;
                resultList.appendChild(resultElement);
            }
        });
    });
}
init();
