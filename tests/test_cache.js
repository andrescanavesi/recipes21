const app = require("../app");
const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;

// Configure chai
chai.use(chaiHttp);
chai.should();

describe("Cache tests", function() {
  this.timeout(5 * 1000);

  it("should get a 200 ok for /cache", function(done) {
    chai
      .request(app)
      .get("/cache")
      .end(function(err, res) {
        assert.equal(res.status, 200);
        done();
      });
  });

  it("should get a 200 ok for /cache/clear", function(done) {
    chai
      .request(app)
      .get("/cache/clear")
      .end(function(err, res) {
        done();
      });
  });
});
