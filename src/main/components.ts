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

import type { Radk } from "./kanjiInfo.js"

// TODO: Make a exhaustive Union
export type BaseComponent = string;
export type DisplayComponent = string;
export type Component = string;

const baseComponentToDisplayMap: Record<BaseComponent, DisplayComponent> = {
  // 2
  "化": "亻",
  "个": "𠆢",
  "并": "丷",
  "刈": "刂",
  "乞": "𠂉",
  // 3
  "込": "⻌",
  "尚": "⺌",
  "忙": "忄",
  "扎": "扌",
  "汁": "⺡",
  "犯": "⺨",
  "艾": "⺾",
  "邦": "⻏",
  "阡": "⻖",
  // 4
  "老": "⺹",
  "杰": "灬",
  "礼": "⺭",
  // 5
  "疔": "疒",
  "禹": "禸",
  "初": "⻂",
  "買": "⺲",
  "滴": "啇",
}

export const alternateComponentInfo: Record<Component, {
  base: BaseComponent,
  strokes: number
}> = {
  // 1
  "乚": {
    base: "乙",
    strokes: 1,
  },
  // 2
  "亻": {
    base: "化",
    strokes: 2,
  },
  "𠆢": {
    base: "个",
    strokes: 2,
  },
  "丷": {
    base: "并",
    strokes: 2,
  },
  "䒑": {
    base: "并",
    strokes: 3,
  },
  "刂": {
    base: "刈", 
    strokes: 2,
  },
  "𠂉": {
    base: "乞",
    strokes: 2,
  },
  // 3
  "⻌": {
    base: "込",
    strokes: 3,
  },
  "⺌": {
    base: "尚",
    strokes: 3,
  },
  "己": {
    base: "已",
    strokes: 3,
  },
  "忄": {
    base: "忙",
    strokes: 3,
  },
  "扌": {
    base: "扎",
    strokes: 3,
  },
  "⺡": {
    base: "汁",
    strokes: 3,
  },
  "⺨": {
    base: "犯",
    strokes: 3,
  },
  "⺾": {
    base: "艾",
    strokes: 3,
  },
  "⻏": {
    base: "邦",
    strokes: 3,
  },
  "⻖": {
    base: "阡",
    strokes: 3,
  },
  // 4
  "⺹": {
    base: "老",
    strokes: 4,
  },
  "戶": {
    base: "戸",
    strokes: 4,
  },
  "旡": {
    base: "无",
    strokes: 5,
  },
  "灬": {
    base: "杰",
    strokes: 4,
  },
  "⺥": {
    base: "爪",
    strokes: 4,
  },
  "⺤": {
    base: "爪",
    strokes: 4,
  },
  "丬": {
    base: "爿",
    strokes: 3,
  },
  "⺭": {
    base: "礼",
    strokes: 4,
  },
  // 5
  "疒": {
    base: "疔",
    strokes: 5,
  },
  "禸": {
    base: "禹",
    strokes: 5,
  },
  "⻂": {
    base: "初",
    strokes: 5,
  },
  "⺲": {
    base: "買",
    strokes: 5,
  },
  // 6
  "⺮": {
    base: "竹",
    strokes: 6,
  },
  "覀": {
    base: "西",
    strokes: 6,
  },
  // 8
  "镸": {
    base: "長",
    strokes: 7,
  },
  "靑": {
    base: "青",
    strokes: 8,
  },
  // 9
  "𩙿": {
    base: "食",
    strokes: 9,
  },
  // 11
  "啇": {
    base: "滴",
    strokes: 11,
  },
  // 12
  "齒": {
    base: "歯",
    strokes: 16,
  },
}

export function getBaseComponent(comp: Component): BaseComponent {
  if (alternateComponentInfo[comp]) {
    return alternateComponentInfo[comp].base;
  } else {
    return comp;
  }
}

export function getComponentStrokeNumber(comp: Component, radk: Radk) {
  if (Object.keys(radk).includes(comp)) {
    return radk[comp].strokes;
  } else if (Object.keys(alternateComponentInfo).includes(comp)) {
    return alternateComponentInfo[comp].strokes;
  } else {
    throw "Invalid component";
  }
}

export function getDisplayComponent(comp: BaseComponent): DisplayComponent {
  return baseComponentToDisplayMap[comp] || comp;
}
