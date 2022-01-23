// Gets all the kanji components from radk
function getKanjiComponents(radk) {
    const kanjiComponentsArray = [];
    for (const [comp, { strokes, }] of Object.entries(radk)) {
        if (kanjiComponentsArray[strokes] === undefined) {
            kanjiComponentsArray[strokes] = [comp];
        }
        else {
            kanjiComponentsArray[strokes].push(comp);
        }
    }
    const kanjiComponents = [];
    kanjiComponentsArray.forEach((comps, idx) => {
        if (comps !== undefined) {
            kanjiComponents.push({ strokes: idx, components: comps });
        }
    });
    return kanjiComponents;
}
// Initializes the component list
// TODO: Make this hardcoded
function populateComponentList(kanjiComponents) {
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
    for (const { strokes, components } of kanjiComponents) {
        appendStrokeCount(strokes);
        for (const comp of components) {
            appendComponent(comp);
        }
    }
}
const componentListChangedEvent = new Event("componentlistchanged");
export class ComponentSearchPanel {
    constructor(radk) {
        // Init component list
        this.kanjiComponents = getKanjiComponents(radk);
        populateComponentList(this.kanjiComponents);
        // Connect the DOM
        for (const comp of document.querySelectorAll(".component-list > .component")) {
            comp.addEventListener("click", (event) => {
                const compButton = event.target;
                const comp = compButton.innerText;
                // Handle state change and change DOM
                // TODO: check and show unavailable components
                switch (this.state[comp]) {
                    case "unavailable":
                        return;
                        break;
                    case "available":
                        this.state[comp] = "active";
                        compButton.className = "component active-component";
                        break;
                    case "active":
                        this.state[comp] = "available";
                        compButton.className = "component";
                        break;
                    default:
                        throw "Invalid state";
                }
                // Emit event
                document.dispatchEvent(componentListChangedEvent);
            });
        }
        // Init state
        this.state = {};
        for (const { strokes, components } of this.kanjiComponents) {
            for (const comp of components) {
                this.state[comp] = "available";
            }
        }
    }
}
