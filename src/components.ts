// TODO: Make a exhaustive Union
export type BaseComponent = string;

type KanjiComponentsList = BaseComponent[][];
type ComponentsState = Record<BaseComponent, boolean>;

// Gets all the kanji components from radkfile
async function getKanjiComponents() {
  const request = await fetch("radkfile-utf8");
  const text = await request.text();
  const kanjiComponents: KanjiComponentsList = [];
  for (const match of text.matchAll(/^\$.*$/gm)) {
    const splitMatch = match[0].split(" ");
    const comp = splitMatch[1];
    const idx = parseInt(splitMatch[2]) - 1;
    if (kanjiComponents[idx] !== undefined) {
      kanjiComponents[idx].push(comp);
    } else {
      kanjiComponents[idx] = [comp];
    }
  }
  return kanjiComponents;
}

// Initializes the component list
// TODO: Make this hardcoded
function populateComponentList(kanjiComponents: KanjiComponentsList) {
  const radicalList = document.querySelector(".component-list");
  if (radicalList === null) {
    throw "Couldn't find component list";
  }

  radicalList.innerHTML = '';

  const appendComponent = (comp: BaseComponent) => {
    const component = document.createElement("li");
    component.innerText = comp;
    component.className = "component";
    radicalList.appendChild(component);
  };

  const appendStrokeCount = (strokeCount: number) => {
    const component = document.createElement("li");
    component.innerText = strokeCount.toString();
    component.className = "stroke-count";
    radicalList.appendChild(component);
  };

  for (let i = 0; i < kanjiComponents.length; i++) {
    if (kanjiComponents[i] !== undefined) {
      // Number of strokes
      appendStrokeCount(i+1);
      for (const kanji of kanjiComponents[i]) {
        appendComponent(kanji);
      }
    }
  }
}

const componentListChangedEvent = new Event("componentlistchanged");

export class KanjiComponents {
  state: ComponentsState = {};
  kanjiComponents: KanjiComponentsList = [];

  async init() {
    this.kanjiComponents = await getKanjiComponents();
    populateComponentList(this.kanjiComponents);
    this.connectDomComponentList();
    this.initState();
  }

  private connectDomComponentList() {
    for (const comp of document.querySelectorAll(".component-list > .component")) {
      comp.addEventListener("click", (event) => {
        const compButton = event.target as HTMLElement;
        const comp = compButton.innerText;
        this.state[comp] = !this.state[comp];

        // Update DOM
        if (this.state[comp]) {
          compButton.className = "component active-component";
        } else {
          compButton.className = "component";
        }

        // Emit event
        document.dispatchEvent(componentListChangedEvent);
      });
    }
  }

  private initState() {
    for (const nStrokeComps of this.kanjiComponents) {
      if (nStrokeComps === undefined) {
        continue;
      }

      for (const comp of nStrokeComps) {
        this.state[comp] = false;
      }
    }
  }
}
