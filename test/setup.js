chai = require('chai');
expect = chai.expect;
chai.use(require('chai-string'));
chai.use(require('chai-http'));

// for code coverage instrumentation
require('../functions/conway/index.js');

server = require('../server');