console.info("Initializing DB...");
if (!process.env.DATABASE_URL) {
    throw new Error("No DB configured. Set the environment config DATABASE_URL");
}

/////////////////
const Sequelize = require("sequelize");
const options = {
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
};
const sequelize = new Sequelize(process.env.DATABASE_URL, options);

const Model = Sequelize.Model;
class User extends Model {}

User.init(
    {
        // attributes
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
        },
        userName: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        firstName: {
            type: Sequelize.STRING,
        },
        lastName: {
            type: Sequelize.STRING,
        },
        isAdmin: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    },
    {
        sequelize,
        modelName: "user",
        // options
    }
);

class Recipe extends Model {}
Recipe.init(
    {
        // attributes
        title: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        titleForUrl: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        description: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        ingredients: {
            type: Sequelize.STRING(500),
            allowNull: false,
        },
        steps: {
            type: Sequelize.STRING(1000),
            allowNull: false,
        },
        keywords: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        active: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        pendingApproval: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        approvalNotes: {
            type: Sequelize.STRING(500),
            allowNull: true,
        },
        featuredImageName: {
            type: Sequelize.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "recipe",
        //tableName: "the_recipes",
        // options
    }
);

User.hasMany(Recipe);

sequelize
    .sync({force: true})
    .then(() => {
        console.info("DB sync");
    })
    .then(() => seed())
    .then(() => {
        console.info("Data populated");
    });

async function seed() {
    const user1 = await User.create({
        email: "andres.canavesi@gmail.com",
        userName: "andres.canavesi",
        firstName: "Andres",
        lastName: "Canavesi",
        isAdmin: true,
    });
    //console.info(user1);
    for (let i = 0; i < 10; i++) {
        const recipe1 = await Recipe.create({
            title: "recipe " + i,
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

console.info("DB initialized");
module.exports.execute = pool;
module.exports.sequelize = sequelize;
module.exports.User = User;
