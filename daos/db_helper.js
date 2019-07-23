const {sequelize} = require("./sequelize");
const {Recipe} = require("../model/Recipe");
const {User} = require("../model/User");

const FlexSearch = require("flexsearch");
const preset = "fast";
const searchIndex = new FlexSearch(preset);

async function dbSync() {
    User.hasMany(Recipe);
    await sequelize.sync({force: true});
    await seed();
    await buildSearchIndex();
}

async function seed() {
    const user1 = await User.create({
        email: "andres.canavesi@gmail.com",
        userName: "andres.canavesi",
        firstName: "Andres",
        lastName: "Canavesi",
        isAdmin: true,
    });
    //console.info(user1);
    for (let i = 0; i < 2; i++) {
        const recipe1 = await Recipe.create({
            title: "the recipe " + i,
            titleForUrl: "recipe-" + i,
            description: "desc",
            ingredients: "ingr1 \n ing2",
            steps: "sep1 \n step2",
            active: true,
            pendingApproval: false,
            keywords: "key1,key2",
            featuredImageName: "default.jpg",
            userId: user1.id,
        });
    }
}

// sequelize
//     .authenticate()
//     .then(() => {
//         console.log("Connection has been established successfully.");
//     })
//     .catch(err => {
//         console.error("Unable to connect to the database:", err);
//     });
//////////////////
const parseDbUrl = require("parse-database-url");

const dbConfig = parseDbUrl(process.env.DATABASE_URL);
const Pool = require("pg").Pool;
const pool = new Pool({
    user: dbConfig.user,
    host: dbConfig.host,
    database: dbConfig.database,
    password: dbConfig.password,
    port: dbConfig.port,
    ssl: true,
});

async function buildSearchIndex() {
    console.time("buildIndexTook");
    console.info("building index...");

    const allRecipes = await Recipe.findAll();

    const size = allRecipes.length;
    for (let i = 0; i < size; i++) {
        //we might concatenate the fields we want for our content
        const content = allRecipes[i].title + " " + allRecipes[i].description + " " + allRecipes[i].keywords;
        const key = parseInt(allRecipes[i].id);
        searchIndex.add(key, content);
    }
    console.info("index built, length: " + searchIndex.length);
    console.info("Open a browser at http://localhost:3000/");
    console.timelineEnd("buildIndexTook");
}

module.exports.execute = pool;
module.exports.dbSync = dbSync;
module.exports.searchIndex = searchIndex;
module.exports.buildSearchIndex = buildSearchIndex;
