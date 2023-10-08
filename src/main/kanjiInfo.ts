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
