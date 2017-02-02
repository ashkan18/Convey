# Start the server
s:
	ENV=development $(KEYS)	node server.js

# Build
build:
	npm install
	cd functions/convey && npm install
	cd functions/convey && node index.js

# Deploy to AWS Lambda
deploy: build
	apex deploy

# Test
test: build
	ENV=test $(KEYS) ./node_modules/mocha/bin/mocha

production-deploy: build
	apex deploy --env=production
