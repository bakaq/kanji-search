PROJECT_SOURCES = $(wildcard src/*.ts)

all: release/index.js sw.js

release/index.js: $(PROJECT_SOURCES)
	tsc

sw.js: src/service-worker/sw.ts
	tsc src/service-worker/sw.ts --lib webworker,es6 --outFile sw.js
