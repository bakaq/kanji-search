import type { BaseComponent } from "./components.js";

import { Kanji } from "./kanji.js";

// Legacy
export type Radk = Record<BaseComponent, {strokes: number, kanji: Kanji[]}>;
export type Krad = Record<string, BaseComponent[]>;

export async function loadRadk(url: string): Promise<Radk> {
  const request = await fetch(url);
  const radkRaw = await request.json();

  const radk: Radk = {};
  for (const comp of Object.keys(radkRaw)) {
    radk[comp] = {
      strokes: radkRaw[comp].strokes as number,
      kanji: radkRaw[comp].kanji.map((char: string) => new Kanji(char)) as Kanji[],
    };
  }

  return radk;
}

export async function loadKrad(url: string): Promise<Krad> {
  const request = await fetch(url);
  const krad = await request.json();
  return krad;
}
