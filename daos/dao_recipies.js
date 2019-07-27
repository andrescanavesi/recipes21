const dbHelper = require("./db_helper");
const moment = require("moment");
const sqlFormatter = require("sql-formatter");

const FlexSearch = require("flexsearch");
const preset = "fast";
const searchIndex = new FlexSearch(preset);

let allRecipes = [];
let spotlightRecipes = [];

module.exports.findAll = async function() {
    if (allRecipes.length === 0) {
        allRecipes = findWithLimit(1000);
    }
    return allRecipes;
};

async function findRecipesSpotlight() {
    if (spotlightRecipes.length === 0) {
        spotlightRecipes = findWithLimit(8);
    }
    return spotlightRecipes;
}

async function findWithKeyword(keyword) {
    return findWithLimit(40, keyword);
}

async function findWithLimit(limit, keyword) {
    let query;
    const bindings = [limit];
    if (keyword) {
        bindings.push("%" + keyword + "%");
        query = "SELECT * FROM recipes WHERE active=true AND keywords like $2 ORDER BY updated_at DESC LIMIT $1 ";
    } else {
        query = "SELECT * FROM recipes WHERE active=true ORDER BY updated_at DESC LIMIT $1 ";
    }

    const result = await dbHelper.execute.query(query, bindings);
    console.info("recipes: " + result.rows.length);
    const recipes = [];
    for (let i = 0; i < result.rows.length; i++) {
        recipes.push(convertRecipe(result.rows[i]));
    }
    return recipes;
}
async function find(page) {
    //TODO add pagination
    return findWithLimit(50);
}

/**
 *
 * @param {number} id
 * @param {boolean} ignoreActive true to find active true and false
 */
module.exports.findById = async function(id, ignoreActive) {
    if (!id) {
        throw Error("id param not defined");
    }
    let query;
    if (ignoreActive === true) {
        query = "SELECT * FROM recipes WHERE id = $1 LIMIT 1";
    } else {
        query = "SELECT * FROM recipes WHERE active=true AND id = $1 LIMIT 1";
    }

    const bindings = [id];
    //console.info(sqlFormatter.format(query));
    console.info("bindings: " + bindings);
    const result = await dbHelper.execute.query(query, bindings);
    if (result.rows.length > 0) {
        return convertRecipe(result.rows[0]);
    } else {
        throw Error("recipe not found by id " + id);
    }
};

async function findByIds(ids) {
    if (!ids) {
        throw Error("ids param not defined");
    }
    console.info("findByIds");
    console.info(ids);
    for (let i = 0; i < ids.length; i++) {
        if (isNaN(ids[i])) {
            throw new Error("Seems '" + ids[i] + "' is not a number");
        }
    }
    //in this case we concatenate string instead of using bindings. Something to improve
    const query = "SELECT * FROM recipes WHERE active=true AND id IN (" + ids + ") LIMIT 100";
    const bindings = [];
    //console.info(sqlFormatter.format(query));
    //console.info("bindings: " + bindings);
    const result = await dbHelper.execute.query(query, bindings);
    const recipes = [];
    for (let i = 0; i < result.rows.length; i++) {
        recipes.push(convertRecipe(result.rows[i]));
    }
    return recipes;
}

function convertRecipe(row) {
    const imageBase = "https://res.cloudinary.com/dniiru5xy/image/upload/c_fill,w_900/v1563920763/";
    const featuredImageBase = imageBase;
    const thumbnailImageBase = imageBase.replace("w_900", "w_400");
    const thumbnail200ImageBase = imageBase.replace("w_900", "w_200");
    const recipe = {};
    recipe.id = row.id;
    recipe.title = row.title;
    recipe.description = row.description;
    recipe.featured_image_name = row.featured_image_name;
    recipe.featured_image_url = featuredImageBase + row.featured_image_name;
    recipe.thumbnail = thumbnailImageBase + row.featured_image_name;
    recipe.thumbnail200 = thumbnail200ImageBase + row.featured_image_name;
    recipe.ingredients_raw = row.ingredients;
    recipe.ingredients = row.ingredients.split("\n");
    recipe.steps_raw = row.steps;
    recipe.steps = row.steps.split("\n");
    if (row.keywords) {
        recipe.keywords = row.keywords;
        recipe.keywords_array = row.keywords.split(",");
    } else {
        recipe.keywords = "";
        recipe.keywords_array = [];
    }
    recipe.title_for_url = row.title_for_url;
    recipe.created_at = moment(row.created_at, "YYYY-MM-DD");
    recipe.created_at = recipe.created_at.format("YYYY-MM-DD");
    recipe.updated_at = moment(row.updated_at, "YYYY-MM-DD");
    recipe.updated_at = recipe.updated_at.format("YYYY-MM-DD");
    recipe.url = process.env.R21_BASE_URL + "recipe/" + recipe.id + "/" + recipe.title_for_url;
    recipe.active = row.active;
    recipe.user_id = row.user_id;
    return recipe;
}

module.exports.create = async function(recipe) {
    console.info("Creating recipe");
    const today = moment().format("YYYY-MM-DD HH:mm:ss");
    const query =
        "INSERT INTO recipes(title, description, ingredients, steps, title_for_url, user_id, active, featured_image_name, keywords, created_at, updated_at) " +
        "VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING id";
    const bindings = [
        recipe.title,
        recipe.description,
        recipe.ingredients,
        recipe.steps,
        recipe.title_for_url,
        recipe.user_id,
        recipe.active,
        recipe.featured_image_name,
        recipe.keywords,
        today,
        today,
    ];

    const result = await dbHelper.execute.query(query, bindings);

    //console.info(result);
    console.info("Recipe created: " + result.rows[0].id);
    return result.rows[0].id;
};

module.exports.seed = async function(userId) {
    for (let i = 1; i < 2; i++) {
        const recipe = {
            title: "recipe " + i,
            description: "description " + i,
            ingredients: "ingr 1 \n ingr 2 \n ingr 3",
            steps: "step1 \n step2 \n step3",
            title_for_url: "recipe-" + i,
            featured_image_name: "default.jpg",
            keywords: "key1,key2,key3",
            active: true,
            user_id: userId,
        };
        await this.create(recipe);
    }
};

module.exports.update = async function(recipe) {
    console.info("updating recipe...");
    const today = moment().format("YYYY-MM-DD HH:mm:ss");
    const query =
        "UPDATE recipes SET ingredients=$1, steps=$2, updated_at=$3, active=$4, featured_image_name=$5, keywords=$6 WHERE id=$7";
    const bindings = [
        recipe.ingredients,
        recipe.steps,
        today,
        recipe.active,
        recipe.featured_image_name,
        recipe.keywords,
        recipe.id,
    ];
    console.info(bindings);
    const result = await dbHelper.execute.query(query, bindings);
    //console.info(result);
};

module.exports.buildSearchIndex = async function() {
    console.time("buildIndexTook");
    console.info("building index...");

    const allRecipes = await this.findAll();

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
};

module.exports.activateDeactivate = async function(recipeId, activate) {
    const query = "UPDATE recipes SET active=$1 WHERE id=$2";
    const bindings = [activate, recipeId];
    const result = await dbHelper.execute.query(query, bindings);
    console.info(result);
};

module.exports.find = find;
module.exports.findByIds = findByIds;
module.exports.findWithKeyword = findWithKeyword;
module.exports.findRecipesSpotlight = findRecipesSpotlight;
module.exports.searchIndex = searchIndex;
