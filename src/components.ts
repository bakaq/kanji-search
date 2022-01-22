export {getKanjiComponents, initComponentList};

// Gets all the kanji components from radkfile
async function getKanjiComponents() {
  const request = await fetch("radkfile-utf8");
  const text = await request.text();
  const kanjiComponents: Array<Array<string>> = [];
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
function initComponentList(kanjiComponents: Array<Array<string>>) {
  const radicalList = document.querySelector(".component-list");
  if (radicalList === null) {
    throw "Couldn't find component list";
  }

  radicalList.innerHTML = '';

  const appendComponent = (comp: string) => {
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
