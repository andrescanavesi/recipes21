const app = require("../app");
const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;

// Configure chai
chai.use(chaiHttp);
chai.should();

describe("Recipies API", function() {
  this.timeout(10 * 1000);

  before(function() {
    process.env.NODE_ENV = "test";
  });

  describe("default", function() {
    it("should get latests recipies", function(done) {
      chai
        .request(app)
        .get("/recipies")
        .end(function(err, res) {
          assert.equal(res.status, 200);
          done();
        });
    });

    it("should get recipies in the page 2", function(done) {
      chai
        .request(app)
        .get("/recipies/2")
        .end(function(err, res) {
          assert.equal(res.status, 200);
          done();
        });
    });

    it("should get a error 500 because of the negative page number", function(done) {
      chai
        .request(app)
        .get("/recipies/-1")
        .end(function(err, res) {
          assert.equal(res.status, 500);
          done();
        });
    });

    it("should get a error 500 because of page nut a number", function(done) {
      chai
        .request(app)
        .get("/recipies/lalalala")
        .end(function(err, res) {
          assert.equal(res.status, 500);
          done();
        });
    });
  });
});
