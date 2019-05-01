const dbHelper = require("./db_helper");
const moment = require("moment");
const sqlFormatter = require("sql-formatter");

async function find(page) {
  //TODO add pagination
  const result = await dbHelper.pool.query(
    "SELECT * FROM recipes WHERE active=true ORDER BY id DESC LIMIT 5"
  );
  console.info("recipes: " + result.rows.length);
  const recipes = [];
  for (let i = 0; i < result.rows.length; i++) {
    recipes.push(convertRecipe(result.rows[i]));
  }
  return recipes;
}

async function findById(id) {
  if (!id) {
    throw Error("id param not defined");
  }

  const query = "SELECT * FROM recipes WHERE active=true AND id = $1 LIMIT 1";
  const bindings = [id];
  console.info(sqlFormatter.format(query));
  console.info("bindings: " + bindings);
  const result = await dbHelper.pool.query(query, bindings);
  if (result.rows.length > 0) {
    return convertRecipe(result.rows[0]);
  } else {
    throw Error("recipe not found by id " + id);
  }
}

function convertRecipe(row) {
  const imageBase =
    "https://res.cloudinary.com/dniiru5xy/image/upload/c_fill,g_auto/w_600,q_auto,f_auto/";
  const featuredImageBase = imageBase;
  const thumbnailImageBase = imageBase.replace("w_600", "w_100");
  const recipe = {};
  recipe.id = row.id;
  recipe.title = row.title;
  recipe.description = row.description;
  recipe.featured_image = featuredImageBase + row.featuredimagename;
  recipe.thumbnail = thumbnailImageBase + row.featuredimagename;
  recipe.ingredients = row.ingredients.split("\n");
  recipe.steps = row.steps.split("\n");
  recipe.keywords = row.keywords.split(",");
  recipe.title_for_url = row.titleforurl;
  recipe.created_at = moment(row.createdat, "YYYY-MM-DD");
  recipe.created_at = recipe.created_at.format("DD/MM/YYYY");
  recipe.updated_at = moment(row.updatedat, "YYYY-MM-DD");
  recipe.updated_at = recipe.updated_at.format("DD/MM/YYYY");
  recipe.apto_celiacos = row.apto_celiacos;
  recipe.total_time_tex = row.total_time_text;
  recipe.total_time_meta = row.total_time_meta;
  recipe.category = row.category;
  return recipe;
}

module.exports.find = find;
module.exports.findById = findById;
