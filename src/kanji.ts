import type { BaseComponent } from "./components.js";

export type Kanji = string;

export type RadkJson = Record<BaseComponent, {strokes: number, kanji: Kanji[]}>;
