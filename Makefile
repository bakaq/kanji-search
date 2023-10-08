PROJECT_SOURCES = $(wildcard src/main/* src/sw/*)

.PHONY: all
all: release/main/index.js release/radk.json release/index.html release/index.css release/manifest.json

release/index.html: src/index.html
	cp src/index.html release/

release/index.css: src/index.css
	cp src/index.css release/

release/manifest.json: src/manifest.json
	cp src/manifest.json release/

# This is actually all the .js files, including sw.js
release/main/index.js: $(PROJECT_SOURCES) | release
	tsc --build src/main
	mv release/sw/sw.js release/
	rm release/sw -r

# This is actually both radk.json and kanjiInfo.json
release/radk.json: scripts/buildjson.py | release
	./scripts/buildjson.py
	mv radk.json release/
	mv kanjiInfo.json release/

release:
	mkdir -p release

.PHONY: clean
clean:
	rm -rf release
