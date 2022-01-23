#!/usr/bin/env python3

import json

def main():
    # Read the radkfile and convert it to easily parsable json
    radkjson = {};
    active_comp = None
    with open("radkfile-utf8", "r") as f:
        for line in f.readlines():
            if line[0] == "#":
                continue
            elif line[0] == "$":
                _, comp, num_strokes, *_ = line.strip("\n").split(" ")
                active_comp = comp
                radkjson[comp] = {"strokes": num_strokes, "kanji": []}
            else:
                radkjson[comp]["kanji"] += [k for k in line.strip("\n")]
    with open("radk.json", "w") as f:
        f.write(json.dumps(radkjson))

    # Inverts the radkfile to create a easily parsable kradfile-like json
    kradjson = {}
    for component,value in radkjson.items():
        for kanji in value["kanji"]:
            if kanji in kradjson.keys():
                kradjson[kanji].append(component)
            else:
                kradjson[kanji] = [component]
    with open("krad.json", "w") as f:
        f.write(json.dumps(kradjson))

if __name__ == "__main__":
    main()
