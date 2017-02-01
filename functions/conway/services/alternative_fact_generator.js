module.exports = {
  alternetize: function(actualFact) {
    return actualFact.replace(' is ', " isn't ").replace(' was ', " wasn't ").replace(' equals ', ' is not equal ').replace(' should ', ' should not ')
  }
}