var request = require('superagent');
var expect = require('expect');

// Test structure
describe('GET /', function(){
    it("should get a 200 response",function(done){
        request.get('localhost:3000').end(function(err,res){
            // TODO check that response is okay
            //console.log(res)
            expect(res).toExist;
            expect(res.status).toEqual(200);
            done();
        });
    });
});
