var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Kanji } from "./kanji.js";
export function loadRadk(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const request = yield fetch(url);
        const radkRaw = yield request.json();
        const radk = {};
        for (const comp of Object.keys(radkRaw)) {
            radk[comp] = {
                strokes: radkRaw[comp].strokes,
                kanji: radkRaw[comp].kanji.map((char) => new Kanji(char)),
            };
        }
        return radk;
    });
}
export function loadKanjiInfo(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const request = yield fetch(url);
        const kanjiInfo = yield request.json();
        return kanjiInfo;
    });
}
