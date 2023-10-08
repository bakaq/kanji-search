// Copyright 2023 Kauê Hunnicutt Bazilli
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { Radk, KanjiInfo } from "./kanjiInfo";
import type { BaseComponent } from "./components";

export class Kanji {
  char: string;

  constructor(char: string) {
    this.char = char;
  }

  getComponents(kanjiInfo: KanjiInfo): BaseComponent[] {
    return kanjiInfo[this.char].components;
  }

  getStrokes(kanjiInfo: KanjiInfo): number {
    return kanjiInfo[this.char].strokes;
  }
  
  // Searchs the kanji with the given components
  static searchByComponents(compList: BaseComponent[], radk: Radk): Kanji[] {
    if (compList.length === 0) {
      return [];
    }

    let kanjiList = radk[compList[0]].kanji;

    for (const comp of compList.slice(1)) {
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

