require('./setup');

describe('alexa-app-server', function() {
  it('should respond as Alternative Facts Alexa', function(done) {
    chai.request(server)
      .get('/')
      .end(function(err, res) {
        expect(res.status).to.equal(200);
        expect(res.text).to.equal("Conway, You Daily Alternative Facts\n");
        done();
      });
  });
});
