var alexa = require('alexa-app');
var app = new alexa.app('convey');
var _ = require('underscore');
var removeMd = require('remove-markdown');
var conveyPackage = require('./package.json');
var factsArray = require('./facts.json')
var alternativeFactGenerator = require('./services/alternative_fact_generator')


console.log(`Loaded convey ${conveyPackage.version}.`);

module.change_code = 1; // allow this module to be reloaded by hotswap when changed

app.launch(function(req, res) {
  console.log('app.launch');
  res
    .say("We have Ms. convey on the line! Ask her for an alternative fact.")
    .shouldEndSession(false, "Say help if you need help or exit any time to exit.")
    .send();
});

app.intent('AMAZON.StopIntent', {
    "slots": {},
    "utterances": [
      "stop"
    ]
  },
  function(req, res) {
    console.log('app.AMAZON.StopIntent');
    res.say("convey says Goodbye.");
    res.send();
  }
);

app.intent('AMAZON.CancelIntent', {
    "slots": {},
    "utterances": [
      "cancel"
    ]
  },
  function(req, res) {
    console.log('app.AMAZON.CancelIntent');
    res.say("convey says Goodbye.");
    res.send();
  }
);

app.intent('AMAZON.HelpIntent', {
    "slots": {},
    "utterances": [
      "help"
    ]
  },
  function(req, res) {
    console.log('app.AMAZON.HelpIntent');
    res.say("Convey can tell you random alternative facts. Ask her for an alternative fact.");
    res.shouldEndSession(false);
    res.send();
  }
);

app.intent('AltFactIntent', {
    'utterances': [
      'for an alternative fact'
    ]
  },
  function(req, res) {
    
    alternativeFactGenerator.altFactFromNews().then(function(alternativeFact) {
      res.say(alternativeFact);
      res.shouldEndSession(true);
      res.send()
    });
    // return false immediately so alexa-app doesn't send the response
    return false;
});

if (process.env['ENV'] == 'lambda') {
  console.log("Starting Alternative Fact Alexa on AWS lambda.")
  exports.handle = app.lambda();
} else if (process.env['ENV'] == 'development') {
  console.log("Starting Alternative Fact Alexa in development mode.")
  module.exports = app;
} else if (process.env['ENV'] == 'test') {
  console.log("Starting Alternative Fact Alexa in test mode.")
  module.exports = app;
} else {
  var fs = require('fs');
  fs.writeFileSync('schema.json', app.schema());
  fs.writeFileSync('utterances.txt', app.utterances());
  console.log('Schema and utterances exported.');
}