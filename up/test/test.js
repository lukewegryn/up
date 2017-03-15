var expect = require('expect'),
    request = require('request')

var port = 3000

describe('GET', function() {
  describe('GET /', function() {
    it('should return 200 when a GET request is sent to /', function() {
      request
        .get('http://127.0.0.1:'+port+'/')
        .on('response', function(res){
          expect(res.status).to.equal(200)
          done()
        });
    });
  });
});

