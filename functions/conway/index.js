var alexa = require('alexa-app');
var app = new alexa.app('conway');
var _ = require('underscore');
var removeMd = require('remove-markdown');
var conwayPackage = require('./package.json');
var factsArray = require('/facts.json')
var alternativeFactGenerator = require('./services/alternative_fact_generator')


console.log(`Loaded conway ${conwayPackage.version}.`);

module.change_code = 1; // allow this module to be reloaded by hotswap when changed

app.launch(function(req, res) {
  console.log('app.launch');
  res
    .say("We have Ms. Conway on the line! Ask her for an alternative fact.")
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
    res.say("Conway says Goodbye.");
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
    res.say("Conway says Goodbye.");
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
    res.say("Conway can tell you random alternative facts. For example say ask Conway for an alternative fact.");
    res.shouldEndSession(false);
    res.send();
  }
);

app.intent('AltFactIntent', {
    "utterances": [
      "for an alternative fact"
    ]
  },
  function(req, res) {
    console.log(`app.AltFactIntent: accepted.`);
    randomFact = _.sample(factsArray)
    res.say("Sorry, I didn't get that artist name. Try again?");
    return res.shouldEndSession(false, "What artist would you like to hear about?");
  }
);

if (process.env['ENV'] == 'lambda') {
  console.log("Starting Artsy Alexa on AWS lambda.")
  exports.handle = app.lambda();
} else if (process.env['ENV'] == 'development') {
  console.log("Starting Artsy Alexa in development mode.")
  module.exports = app;
} else if (process.env['ENV'] == 'test') {
  console.log("Starting Artsy Alexa in test mode.")
  module.exports = app;
} else {
  var fs = require('fs');
  fs.writeFileSync('schema.json', app.schema());
  fs.writeFileSync('utterances.txt', app.utterances());
  console.log('Schema and utterances exported.');
}