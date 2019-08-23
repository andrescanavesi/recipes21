const {logger} = require("../util/logger");
const log = new logger("test_all");

const app = require("../app");
const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const expect = chai.expect;

const daoRecipes = require("../daos/dao_recipies");

var randomstring = require("randomstring");

// Configure chai
chai.use(chaiHttp);
chai.should();

function assertNotError(err, res) {
    if (err) {
        log.error(err.message);
        assert.fail(err);
    }
}

describe("Test All", function() {
    this.timeout(10 * 1000);

    before(function() {
        process.env.NODE_ENV = "test";
    });

    describe("Test at Dao level", function() {
        it("should create a recipe", async () => {
            const title = "from test create " + randomstring.generate(5);
            const userId = 1;
            const recipe = {
                title: title,
                description:
                    "Lorem ipsum dolor sit amet consectetur adipiscing elit penatibus morbi tempor, nibh elementum class dapibus litora ridiculus pellentesque ut massa, faucibus nascetur ullamcorper aptent augue malesuada mus tempus velit. ",
                ingredients:
                    "Lorem ipsum dolor sit amet\nLorem ipsum dolor sit amet\nLorem ipsum dolor sit amet\nLorem ipsum dolor sit amet\nLorem ipsum dolor sit amet",
                steps:
                    "adipiscing elit penatibus morbi tempor, nibh elementum class dapibus litora ridiculus pellentesque ut massa\nadipiscing elit penatibus morbi tempor, nibh elementum class dapibus litora ridiculus pellentesque ut massa\nadipiscing elit penatibus morbi tempor, nibh elementum class dapibus litora ridiculus pellentesque ut massa\nadipiscing elit penatibus morbi tempor, nibh elementum class dapibus litora ridiculus pellentesque ut massa\nadipiscing elit penatibus morbi tempor, nibh elementum class dapibus litora ridiculus pellentesque ut massa",
                title_for_url: "easy-chewy-flourless-peanut-butter-cookies-",
                featured_image_name: "peanut-cookies.jpg",
                keywords: "easy,chewy,flourless",
                active: true,
                user_id: userId,
            };
            const recipeId = await daoRecipes.create(recipe);
            assert.isNotNull(recipeId);
            const recipeCreated = await daoRecipes.findById(recipeId);
            assert.equal(title, recipeCreated.title);
        });

        it("should update a recipe", async () => {
            const id = 1;
            const recipe = await daoRecipes.findById(id);
            if (!recipe) {
                assert.fail("Recipe with id " + id + " does not exist");
            }
            const newTitle = "from test " + randomstring.generate(5);
            recipe.title = newTitle;
            await daoRecipes.update(recipe);

            const recipeUpdated = await daoRecipes.findById(id);
            assert.equal(newTitle, recipeUpdated.title);
        });
    });

    describe("Test at web level", function() {
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

        it("should get error seeding with missing admin secret", function(done) {
            chai.request(app)
                .get("/seed")
                .end(function(err, res) {
                    assertNotError(err, res);
                    expect(res).to.have.status(400);
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

        it("should get home page with page number", function(done) {
            chai.request(app)
                .get("/?page=1")
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

        it("should reset cache", function(done) {
            chai.request(app)
                .get("/reset-cache")
                .query({
                    adminSecret: process.env.R21_ADMIN_SECRET,
                })
                .end(function(err, res) {
                    assertNotError(err, res);
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it("should get an error on missing admin secret (reset-cache)", function(done) {
            chai.request(app)
                .get("/reset-cache")
                .end(function(err, res) {
                    assertNotError(err, res);
                    expect(res).to.have.status(400);
                    done();
                });
        });

        it("should call google callback", function(done) {
            chai.request(app)
                .get("/sso/google/callback")
                .query({
                    imTesting: true,
                })
                .end(function(err, res) {
                    assertNotError(err, res);
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it("should get terms and conditions page", function(done) {
            chai.request(app)
                .get("/terms-and-conditions")
                .end(function(err, res) {
                    assertNotError(err, res);
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it("should get privacy policy page", function(done) {
            chai.request(app)
                .get("/privacy-policy")
                .end(function(err, res) {
                    assertNotError(err, res);
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it("should get subscribe page", function(done) {
            chai.request(app)
                .get("/subscribe")
                .end(function(err, res) {
                    assertNotError(err, res);
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it("should get subscription done page", function(done) {
            chai.request(app)
                .get("/subscription-done")
                .end(function(err, res) {
                    assertNotError(err, res);
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it("should subscribe an email", function(done) {
            const random = randomstring.generate(7);
            const randomEmail = "email" + random + "@gmail.com";
            chai.request(app)
                .post("/subscribe-email")
                .send({email: randomEmail})
                .end(function(err, res) {
                    assertNotError(err, res);
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it("should re-subscribe repeated email", function(done) {
            const email = "andres.canavesi@gmail.com";
            chai.request(app)
                .post("/subscribe-email")
                .send({email: email})
                .end(function(err, res) {
                    assertNotError(err, res);
                    expect(res).to.have.status(200);
                    //TODO validate the email is re-subscribed
                    done();
                });
        });

        it("should not subscribe empty email", function(done) {
            const email = "";
            chai.request(app)
                .post("/subscribe-email")
                .send({email: email})
                .end(function(err, res) {
                    expect(res).to.have.status(500);
                    done();
                });
        });

        it("should not subscribe invalid email", function(done) {
            const email = randomstring.generate(7);
            chai.request(app)
                .post("/subscribe-email")
                .send({email: email})
                .end(function(err, res) {
                    expect(res).to.have.status(500);
                    done();
                });
        });
    });
});
