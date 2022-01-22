var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export { getKanjiComponents, initComponentList };
// Gets all the kanji components from radkfile
function getKanjiComponents() {
    return __awaiter(this, void 0, void 0, function* () {
        const request = yield fetch("radkfile-utf8");
        const text = yield request.text();
        const kanjiComponents = [];
        for (const match of text.matchAll(/^\$.*$/gm)) {
            const splitMatch = match[0].split(" ");
            const comp = splitMatch[1];
            const idx = parseInt(splitMatch[2]) - 1;
            if (kanjiComponents[idx] !== undefined) {
                kanjiComponents[idx].push(comp);
            }
            else {
                kanjiComponents[idx] = [comp];
            }
        }
        return kanjiComponents;
    });
}
// Initializes the component list
// TODO: Make this hardcoded
function initComponentList(kanjiComponents) {
    const radicalList = document.querySelector(".component-list");
    if (radicalList === null) {
        throw "Couldn't find component list";
    }
    radicalList.innerHTML = '';
    const appendComponent = (comp) => {
        const component = document.createElement("li");
        component.innerText = comp;
        component.className = "component";
        radicalList.appendChild(component);
    };
    const appendStrokeCount = (strokeCount) => {
        const component = document.createElement("li");
        component.innerText = strokeCount.toString();
        component.className = "stroke-count";
        radicalList.appendChild(component);
    };
    for (let i = 0; i < kanjiComponents.length; i++) {
        if (kanjiComponents[i] !== undefined) {
            // Number of strokes
            appendStrokeCount(i + 1);
            for (const kanji of kanjiComponents[i]) {
                appendComponent(kanji);
            }
        }
    }
}
