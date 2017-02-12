var request = require('request');
var cheerio = require('cheerio');
var nlp = require('nlp_compromise');
var _ = require('underscore');


module.exports = {
  alternetize: alternize,
  altFactFromNews: altFactFromNews
}

function alternize(actualFact) {
  var statement = nlp.statement(actualFact)
  var tags = statement.tags()
  console.log(tags)
  isAmbiguous = tags.filter(function(tag) { return tag==='?'}).length > 0
  if(isAmbiguous) {
      return null;
  }

  isPresent = tags.filter(function(tag) { return tag==='PresentTense'}).length > 0
  isPast = tags.filter(function(tag) { return tag==='PastTense'}).length > 0
  isCopula = tags.filter(function(tag) { return tag==='Copula'}).length > 0
  isVerb = tags.filter(function(tag) { return tag==='Verb'}).length > 0
  isInfinitive = tags.filter(function(tag) { return tag==='Infinitive'}).length > 0
  if(isPresent) {
    var negate = statement.to_past().negate().text()
    console.log(actualFact + ' => ' + negate)
    return negate
  }
  else if (isPast || isCopula || isVerb || isInfinitive) {
    var negate = statement.negate().text()
    console.log(actualFact + ' => ' + negate)
    return negate
  } else {
    return null;
  }
}

function altFactFromNews(limit) {
  return new Promise(function(resolve, reject) {
    console.log('getting headline')
    getHeadlines('https://news.google.com/?section=all&sdm=HEADLINE&topicsid=en_us').then(function(headlines) {
      sample_headline = _.sample(headlines, limit)
        console.log('headline', sample_headline)
        alternated_headlines = _.map(sample_headline, alternize);
        if (_.some(alternated_headlines)) {
          resolve(alternated_headlines)
        }
      else {
        reject('Could not alternize.')
      }
    })
  })
}

function getHeadlines(url) {
  return new Promise(function(resolve, reject) {
    console.log('requesting headline')
      request(url, function (error, response, body) {
        if (!error && response.statusCode === 200) {
          var $ = cheerio.load(body);
          var headlines = $('.titletext');
          // give us a matched element at a given index, and pass it a random number.
          headline_texts = _.map(headlines, function(h) { return $(h).text() } )
          resolve(headline_texts);
        }
        else {
          console.log('error request ', error)
          reject(error);
        }
    })
  })
}
