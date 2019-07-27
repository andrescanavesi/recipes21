const app = require("../app");
const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const expect = chai.expect;

// Configure chai
chai.use(chaiHttp);
chai.should();

function assertNotError(err, res) {
    if (err) {
        console.error(err);
        assert.fail(err);
    }
}

describe("Test home page", function() {
    this.timeout(10 * 1000);

    before(function() {
        process.env.NODE_ENV = "test";
    });

    it("should seed", function(done) {
        chai.request(app)
            .get("/seed")
            .query({
                adminSecret: process.env.R21_ADMIN_SECRET,
            })
            .end(function(err, res) {
                assertNotError(err, res);
                expect(res).to.have.status(200);
                done();
            });
    });

    it("should get home page", function(done) {
        chai.request(app)
            .get("/")
            .end(function(err, res) {
                assertNotError(err, res);
                expect(res).to.have.status(200);
                done();
            });
    });

    it("should search", function(done) {
        chai.request(app)
            .get("/search?q=chocolate")
            .end(function(err, res) {
                assertNotError(err, res);
                expect(res).to.have.status(200);
                done();
            });
    });

    it("should display recipes by keyword", function(done) {
        chai.request(app)
            .get("/recipes/keyword/chocolate")
            .end(function(err, res) {
                assertNotError(err, res);
                expect(res).to.have.status(200);
                done();
            });
    });

    it("should display a recipe", function(done) {
        chai.request(app)
            .get("/recipe/24/something")
            .end(function(err, res) {
                assertNotError(err, res);
                expect(res).to.have.status(200);
                done();
            });
    });

    it("should display new recipe form", function(done) {
        chai.request(app)
            .get("/recipe/new")
            .end(function(err, res) {
                assertNotError(err, res);
                expect(res).to.have.status(200);
                done();
            });
    });

    it("should display edit recipe form", function(done) {
        chai.request(app)
            .get("/recipe/edit?id=24")
            .end(function(err, res) {
                assertNotError(err, res);
                expect(res).to.have.status(200);
                done();
            });
    });

    it("should display sitemap.xml", function(done) {
        chai.request(app)
            .get("/sitemap.xml")
            .end(function(err, res) {
                assertNotError(err, res);
                expect(res).to.have.status(200);
                expect(res).to.have.headers;
                expect(res).to.be.all; //TODO validate xml
                done();
            });
    });

    it("should display SSO page", function(done) {
        chai.request(app)
            .get("/sso")
            .end(function(err, res) {
                assertNotError(err, res);
                expect(res).to.have.status(200);
                done();
            });
    });
});
