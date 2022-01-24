#!/usr/bin/env python3

# This script builds easily parsable json files with
# information from RADKFILE and KANJIDICT2

import asyncio
import json
import gzip

import requests
from bs4 import BeautifulSoup

def get_radkfile():
    print("Getting radkfile")
    radkfilegz = requests.get("http://ftp.edrdg.org/pub/Nihongo/radkfile.gz").content
    print("Got radkfile")

    print("Decompressing radkfile")
    radkfileraw = gzip.decompress(radkfilegz)
    print("Decompressed radkfile")

    print("Decoding radkfile")
    radkfile = radkfileraw.decode("euc-jp")
    print("Decoded radkfile")

    return radkfile

def get_kanjidict2():
    print("Getting kanjidict2")
    kanjidict2gz = requests.get("http://www.edrdg.org/kanjidic/kanjidic2.xml.gz").content
    print("Got kanjidict2")

    print("Decompressing kanjidict2")
    kanjidict2raw = gzip.decompress(kanjidict2gz)
    print("Decompressed kanjidict2")

    print("Decoding kanjidict2")
    kanjidict2text = kanjidict2raw.decode("utf-8")
    print("Decoded kanjidict2")

    print("Parsing kanjidict2")
    kanjidict2 = BeautifulSoup(kanjidict2text, "xml")
    print("Parsed kanjidict2")

    return kanjidict2

def parse_radkfile(radkfile):
    print("Parsing radkfile")
    radkjson = {};
    active_comp = None
    for line in radkfile.strip("\n").split("\n"):
        if line[0] == "#":
            continue
        elif line[0] == "$":
            _, comp, num_strokes, *_ = line.strip("\n").split(" ")
            active_comp = comp
            radkjson[comp] = {"strokes": num_strokes, "kanji": []}
        else:
            radkjson[comp]["kanji"] += [k for k in line.strip("\n")]
    print("Parsed radkfile")
    return radkjson

def invert_radkjson(radkjson):
    print("Inverting radkfile")
    kradjson = {}
    for component,value in radkjson.items():
        for kanji in value["kanji"]:
            if kanji in kradjson.keys():
                kradjson[kanji].append(component)
            else:
                kradjson[kanji] = [component]
    print("Inverted radkfile")
    return kradjson

def build_kanji_info(kanjidict2, kradjson):
    print("Creating kanjiInfo")
    kanji_info = {}
    for kanji in kanjidict2.select("character"):
        kanji_info[kanji.literal.string] = {
            "strokes": kanji.stroke_count.string,
            "components": kradjson.get(kanji.literal.string, [])
        }
    print("Created kanjiInfo")
    return kanji_info

async def main():
    print("Getting the files")
    radkfile_task = asyncio.create_task(
        asyncio.to_thread(get_radkfile)
    )
    kanjidict2_task = asyncio.create_task(
        asyncio.to_thread(get_kanjidict2)
    )
    
    # Read the radkfile and convert it to easily parsable json
    radkjson = parse_radkfile(await radkfile_task)

    # Invert the radkfile to create a easily parsable kradfile-like json
    kradjson = invert_radkjson(radkjson)

    # Create the kanjiinfo.json
    kanji_info = build_kanji_info(await kanjidict2_task, kradjson)

    # Write files
    print("Writing radk.json")
    with open("radk.json", "w") as f:
        f.write(json.dumps(radkjson))
    print("Wrote radk.json")

    print("Writing kanjiInfo.json")
    with open("kanjiInfo.json", "w") as f:
        f.write(json.dumps(kanji_info))
    print("Wrote kanjiInfo.json")

if __name__ == "__main__":
    asyncio.run(main())
