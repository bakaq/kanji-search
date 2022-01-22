// All the kanji components
// TODO: Get this dynamically

const kanjiComponents = [
  ["了", "了", "了"],
  ["了", "了", "了"],
  ["了", "了", "了"],
  ["了", "了", "了"],
  ["了", "了", "了"],
  ["了", "了", "了"],
  ["了", "了", "了"],
];

// Initializes the component list
function initComponentList() {
  const radicalList = document.querySelector(".component-list");
  if (radicalList === null) {
    throw "Couldn't find component list";
  }

  radicalList.innerHTML = '';

  const appendComponent = (comp: string) => {
    let component = document.createElement("li");
    component.innerText = comp;
    component.className = "component";
    radicalList.appendChild(component);
  };

  const appendStrokeCount = (strokeCount: number) => {
    let component = document.createElement("li");
    component.innerText = strokeCount.toString();
    component.className = "stroke-count";
    radicalList.appendChild(component);
  };

  for (let i = 0; i < kanjiComponents.length; i++) {
    // Number of strokes
    appendStrokeCount(i+1);
    for (let kanji of kanjiComponents[i]) {
      appendComponent(kanji);
    }
  }
}

initComponentList();
