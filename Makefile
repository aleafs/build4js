TESTS = test/*.test.js
REPORTER = spec
TIMEOUT = 5000
MOCHA = ./node_modules/mocha/bin/mocha
JSCOVERAGE = ./node_modules/visionmedia-jscoverage/jscoverage

all: test install

install:
	@npm install

test: install
	@NODE_ENV=test $(MOCHA) --reporter $(REPORTER) --timeout $(TIMEOUT) $(MOCHA_OPTS) $(TESTS)

.PHONY: all
