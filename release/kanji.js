export class Kanji {
    constructor(char) {
        this.char = char;
    }
    getComponents(kanjiInfo) {
        return kanjiInfo[this.char].components;
    }
    // Searchs the kanji with the given components
    static searchByComponents(componentList, radk) {
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
