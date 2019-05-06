const dbHelper = require("./db_helper");
const moment = require("moment");
const sqlFormatter = require("sql-formatter");

async function findAll() {
  return findWithLimit(1000);
}

async function findRecipesSpotlight() {
  return findWithLimit(8);
}

async function findWithKeyword(keyword) {
  return findWithLimit(40, keyword);
}

async function findWithLimit(limit, keyword) {
  let query;
  const bindings = [limit];
  if (keyword) {
    bindings.push("%" + keyword + "%");
    query =
      "SELECT * FROM recipes WHERE active=true AND keywords like $2 ORDER BY id DESC LIMIT $1 ";
  } else {
    query =
      "SELECT * FROM recipes WHERE active=true ORDER BY id DESC LIMIT $1 ";
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
  return findWithLimit(5);
}

async function findById(id) {
  if (!id) {
    throw Error("id param not defined");
  }

  const query = "SELECT * FROM recipes WHERE active=true AND id = $1 LIMIT 1";
  const bindings = [id];
  console.info(sqlFormatter.format(query));
  console.info("bindings: " + bindings);
  const result = await dbHelper.execute.query(query, bindings);
  if (result.rows.length > 0) {
    return convertRecipe(result.rows[0]);
  } else {
    throw Error("recipe not found by id " + id);
  }
}

function convertRecipe(row) {
  const imageBase =
    "https://res.cloudinary.com/dniiru5xy/image/upload/c_fill,g_auto/w_900,q_auto,f_auto/recipes21/";
  const featuredImageBase = imageBase;
  const thumbnailImageBase = imageBase.replace("w_900", "w_400");
  const thumbnail200ImageBase = imageBase.replace("w_900", "w_200");
  const recipe = {};
  recipe.id = row.id;
  recipe.title = row.title;
  recipe.description = row.description;
  recipe.featured_image = featuredImageBase + row.featuredimagename;
  recipe.thumbnail = thumbnailImageBase + row.featuredimagename;
  recipe.thumbnail200 = thumbnail200ImageBase + row.featuredimagename;
  recipe.ingredients_raw = row.ingredients;
  recipe.ingredients = row.ingredients.split("\n");
  recipe.steps_raw = row.steps;
  recipe.steps = row.steps.split("\n");
  recipe.keywords_csv = row.keywords.replace(" ", "");
  recipe.keywords = recipe.keywords_csv.split(",");
  recipe.title_for_url = row.titleforurl;
  recipe.created_at = moment(row.createdat, "YYYY-MM-DD");
  recipe.created_at = recipe.created_at.format("YYYY-MM-DD");
  recipe.updated_at = moment(row.updatedat, "YYYY-MM-DD");
  recipe.updated_at = recipe.updated_at.format("YYYY-MM-DD");
  recipe.apto_celiacos = row.apto_celiacos;
  recipe.total_time_tex = row.total_time_text;
  recipe.total_time_meta = row.total_time_meta;
  recipe.category = row.category;
  recipe.url =
    process.env.R21_BASE_URL +
    "recipe/" +
    recipe.id +
    "/" +
    recipe.title_for_url;
  return recipe;
}

module.exports.find = find;
module.exports.findById = findById;
module.exports.findAll = findAll;
module.exports.findWithKeyword = findWithKeyword;
module.exports.findRecipesSpotlight = findRecipesSpotlight;
