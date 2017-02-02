module.exports = {
  alternetize: function(actualFact) {
    return actualFact.replace(/ is /ig, " is not ")
                     .replace(/ was /ig, " was not ")
                     .replace(/ equals /ig, ' is not equal ')
                     .replace(/ should /ig, ' should not ')
                     .replace(/ will /ig, ' will not ')
                     .replace(/ are /ig, ' are not ')
                     .replace(/ were /ig, ' were not ')
  }
}