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

	return new Promise(function(resolve, reject) {
		console.log('getting headline')
		getHeadline('http://news.google.com/news/section?cf=all&hl=en&ned=us&q=Donald+Trump&topicsid=en_us:w').then(function(headline) {
		    console.log('headline', headline)
		    var statement = nlp.statement(headline)
		    var tags = statement.tags()
		    //console.log(tags)
		    isAmbiguous = tags.filter(function(tag) { return tag==='?'}).length > 0
		    
		    if(isAmbiguous) {
		      //console.log(headline, tags ,'isAmbiguous')
		      //return
		      reject('isAmbiguous');
		    }
		    
		    isPresent = tags.filter(function(tag) { return tag==='PresentTense'}).length > 0
		    isPast = tags.filter(function(tag) { return tag==='PastTense'}).length > 0
		    isCopula = tags.filter(function(tag) { return tag==='Copula'}).length > 0
		    isVerb = tags.filter(function(tag) { return tag==='Verb'}).length > 0
		    isInfinitive = tags.filter(function(tag) { return tag==='Infinitive'}).length > 0
		    //console.log(tags)
		    if(isPresent) {
		      var negate = statement.to_past().negate().text()
		      console.log(headline + ' => ' + negate)
		      resolve(negate)
		    }
		    else if (isPast || isCopula || isVerb || isInfinitive) {
		      var negate = statement.negate().text()
		      console.log(headline + ' => ' + negate)
		      resolve(negate)
		    }
		    else {
		    	//resolve('False: '+ headline)
		    	reject('no verb')
		    }
		    //console.log(statement.to_past().negate().text())
		})
	})		

  }

function getHeadline(url) {
	return new Promise(function(resolve, reject) {
		console.log('requesting headline')
  		request(url, function (error, response, body) {
	  		console.log('request')
	    	if (!error && response.statusCode === 200) {
	      		var $ = cheerio.load(body);
	      		var headlines = $('.titletext');
			    // `pick()` doesn't work here because `headlines` isn't an array, so instead we use `cheerio`'s `eq` which
			    // give us a matched element at a given index, and pass it a random number.
			    var headline = headlines.eq(Math.floor(Math.random()*headlines.length)).text();
	      		resolve(headline);
	    	}
	    	else {
	      		console.log('error request ', error)
	      		reject(error);
	    	}
		});
	 })

 
}

/*
altFactFromNews().then(function(alternativeFact) {
	console.log(alternativeFact)
})
*/