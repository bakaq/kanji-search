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
import { Kanji } from "./kanji.js";
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
    const componentButtons = [];
    const appendComponent = (comp) => {
        const component = document.createElement("li");
        component.innerText = comp;
        component.className = "component";
        radicalList.appendChild(component);
        componentButtons.push(component);
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
    return componentButtons;
}
export class ComponentSearchPanel {
    constructor(radk, kanjiInfo) {
        this.selectedKanji = [];
        // Init component list
        this.radk = radk;
        this.kanjiInfo = kanjiInfo;
        this.kanjiComponents = getKanjiComponents(radk);
        this.componentButtons = populateComponentList(this.kanjiComponents);
        // Connect the DOM
        for (const comp of this.componentButtons) {
            comp.addEventListener("click", (event) => {
                const compButton = event.target;
                const comp = compButton.innerText;
                // Handle state change and change DOM
                switch (this.state[comp]) {
                    case "unavailable":
                        return;
                        break;
                    case "available":
                        this.updateState(comp, "active");
                        break;
                    case "active":
                        this.updateState(comp, "available");
                        break;
                    default:
                        throw "Invalid state";
                }
                this.updateDOM();
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
    updateState(component, newState) {
        // TODO: show activation/deactivation early (responsiveness)
        this.state[component] = newState;
        // Filters the active components
        const activeCompList = Object.entries(this.state).filter(([comp, state]) => {
            return state === "active";
        }).map(([comp,]) => {
            return comp;
        });
        this.selectedKanji = Kanji.searchByComponents(activeCompList, this.radk);
        if (activeCompList.length === 0) {
            // If none are active, every component is available
            for (const comp of Object.keys(this.state)) {
                this.state[comp] = "available";
            }
        }
        else {
            // Finds all the components of all the selected kanji
            const availableComponents = [];
            for (const kanji of this.selectedKanji) {
                for (const comp of kanji.getComponents(this.kanjiInfo)) {
                    if (!availableComponents.includes(comp)) {
                        availableComponents.push(comp);
                    }
                }
            }
            // Marks all the components not in availableComponents as unavailable
            for (const comp of Object.keys(this.state)) {
                if (availableComponents.includes(comp)) {
                    if (this.state[comp] === "unavailable") {
                        this.state[comp] = "available";
                    }
                }
                else {
                    this.state[comp] = "unavailable";
                }
            }
        }
        // Emit event
        const componentListChangeEvent = new CustomEvent("componentlistchange", {
            detail: {
                selectedKanji: this.selectedKanji,
            },
        });
        // TODO: Proper error handling
        document.querySelector(".component-list")
            .dispatchEvent(componentListChangeEvent);
    }
    updateDOM() {
        // Map from state to className
        const stateToClasses = {
            "available": "component",
            "unavailable": "component unavailable-component",
            "active": "component active-component",
        };
        // If className isn't right, change it to reflect the state
        for (const componentButton of this.componentButtons) {
            const compState = this.state[componentButton.innerText];
            if (componentButton.className !== stateToClasses[compState]) {
                componentButton.className = stateToClasses[compState];
            }
        }
    }
}
