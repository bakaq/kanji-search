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
export class Kanji {
    constructor(char) {
        this.char = char;
    }
    getComponents(kanjiInfo) {
        return kanjiInfo[this.char].components;
    }
    getStrokes(kanjiInfo) {
        return kanjiInfo[this.char].strokes;
    }
    // Searchs the kanji with the given components
    static searchByComponents(compList, radk) {
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
