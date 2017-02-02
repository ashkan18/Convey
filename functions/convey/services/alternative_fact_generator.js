var request = require('request');
var cheerio = require('cheerio');
var nlp = require('nlp_compromise');
var _ = require('underscore.deferred');


module.exports = {
  alternetize: function(actualFact) {
    return actualFact.replace(/ is /ig, " is not ")
                     .replace(/ was /ig, " was not ")
                     .replace(/ equals /ig, ' is not equal ')
                     .replace(/ should /ig, ' should not ')
                     .replace(/ will /ig, ' will not ')
                     .replace(/ are /ig, ' are not ')
                     .replace(/ were /ig, ' were not ')
  },
  altFactFromNews: altFactFromNews
}

function altFactFromNews() {

	var dfd = new _.Deferred();
	getHeadline('http://news.google.com/news/section?cf=all&hl=en&ned=us&q=Donald+Trump&topicsid=en_us:w').then(function(headline) {
	    console.log(headline)
	    var statement = nlp.statement(headline)
	    var tags = statement.tags()
	    //console.log(tags)
	    isAmbiguous = tags.filter(function(tag) { return tag==='?'}).length > 0
	    if(isAmbiguous) {
	      //console.log(headline, tags ,'isAmbiguous')
	      //return
	      dfd.reject();
	    }
	    isPresent = tags.filter(function(tag) { return tag==='PresentTense'}).length > 0
	    isPast = tags.filter(function(tag) { return tag==='PastTense'}).length > 0
	    isCopula = tags.filter(function(tag) { return tag==='Copula'}).length > 0
	    isVerb = tags.filter(function(tag) { return tag==='Verb'}).length > 0
	    if(isPresent) {
	      var negate = statement.to_past().negate().text()
	      console.log(headline + ' => ' + negate)
	      dtd.resolve(negate)
	    }
	    else if (isPast || isCopula || isVerb) {
	      var negate = statement.negate().text()
	      console.log(headline + ' => ' + negate)
	      dfd.resolve(negate)
	    }
	    //console.log(statement.to_past().negate().text())
	})

	return dfd.promise()

  }

function getHeadline(url) {
  var dfd = new _.Deferred();
  request(url, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var $ = cheerio.load(body);
      var headlines = $('.titletext');
      // `pick()` doesn't work here because `headlines` isn't an array, so instead we use `cheerio`'s `eq` which
      // give us a matched element at a given index, and pass it a random number.
      var headline = headlines.eq(Math.floor(Math.random()*headlines.length)).text();
      dfd.resolve(headline);
    }
    else {
      dfd.reject();
    }
  });
  return dfd.promise();
}


altFactFromNews().then(function(alternativeFact) {
	console.log(alternativeFact)
})