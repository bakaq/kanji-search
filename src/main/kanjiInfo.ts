// Copyright 2023 Kauê Hunnicutt Bazilli
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { BaseComponent } from "./components.js";

import { Kanji } from "./kanji.js";

// Legacy
export type Radk = Record<BaseComponent, {strokes: number, kanji: Kanji[]}>;
export type KanjiInfo = Record<
  string,
  {
    strokes: number,
    components: BaseComponent[],
  }
>;

export async function loadRadk(url: string): Promise<Radk> {
  const request = await fetch(url);
  const radkRaw = await request.json();

  const radk: Radk = {};
  for (const comp of Object.keys(radkRaw)) {
    radk[comp] = {
      strokes: radkRaw[comp].strokes as number,
      kanji: radkRaw[comp].kanji.map((char: string) => {
        return new Kanji(char);
      }) as Kanji[],
    };
  }

  return radk;
}

export async function loadKanjiInfo(url: string): Promise<KanjiInfo> {
  const request = await fetch(url);
  const kanjiInfo = await request.json();
  return kanjiInfo;
}
