var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { KanjiComponents } from "./components.js";
// Searches the kanji with the given component
function searchByComponent(comp, radkfile) {
    console.log(`Searching component: ${comp}`);
    const regex = new RegExp(`\\$ ${comp}.*\n((?:.|\n)*?)\n\\$`, "g");
    const matches = radkfile.matchAll(regex);
    const match = matches.next().value[1];
    return match.split("\n").join().split("");
}
// Searchs the kanji with the given components
function searchByComponents(componentList, radkfile) {
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
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        // Initializes the component list
        const components = new KanjiComponents();
        yield components.init();
        // Preload radkfile
        const request = yield fetch("radkfile-utf8");
        const radkfile = yield request.text();
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
            }).map(([comp,]) => {
                return comp;
            });
            // TODO: Organize by number of strokes
            // Shows the results
            for (const result of searchByComponents(activeCompList, radkfile)) {
                resultList.innerHTML += `<li class="result">${result}</li>`;
            }
        });
    });
}
init();
