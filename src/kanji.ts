import type { Radk, Krad } from "./radk.js";
import type { BaseComponent } from "./components.js";

export class Kanji {
  char: string;

  constructor(char: string) {
    this.char = char;
  }

  getComponents(krad: Krad): BaseComponent[] {
    return krad[this.char];
  }
  
  // Searchs the kanji with the given components
  static searchByComponents(componentList: BaseComponent[], radk: Radk): Kanji[] {
    if (componentList.length === 0) {
      return [];
    }

    let kanjiList = radk[componentList[0]].kanji;

    for (const comp of componentList.slice(1)) {
      // Intersection
      kanjiList = kanjiList.filter((kanji) => {
        return radk[comp].kanji.some((kanji2) => {
          return kanji.char === kanji2.char;
        }); 
      });
    }

    return kanjiList;
  }
}

