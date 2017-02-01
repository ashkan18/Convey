require('./../setup');

describe('alternativeFact', function() {
  it('should respond', function(done) {
    chai.request(server)
      .post('/alexa/conway')
      .send(require('./fixtures/AltFactIntentRequest.json'))
      .end(function(err, res) {
        console.log(res.status)
        expect(res.status).to.equal(200);
        var data = JSON.parse(res.text);
        expect(data.response.outputSpeech.type).to.equal('SSML')
        expect(data.response.outputSpeech.ssml).to.be.oneOf([
          "<speak>two plus two is not equal 4</speak>",
          "<speak>Sky isn\'t blue.</speak>",
          "<speak></speak>"
        ]);
        done();
      });
  });
});