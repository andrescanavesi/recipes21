const dbHelper = require("./db_helper");
const moment = require("moment");

async function find(page) {
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

function convertRecipe(row) {
  const imageBase =
    "https://res.cloudinary.com/dniiru5xy/image/upload/c_fill,g_auto/w_600,q_auto,f_auto/";
  const featuredImageBase = imageBase;
  const thumbnailImageBase = imageBase.replace("w_600", "w_100");
  const recipe = {};
  recipe.title = row.title;
  recipe.description = row.description;
  recipe.featured_image = featuredImageBase + row.featuredimagename;
  recipe.thumbnail = thumbnailImageBase + row.featuredimagename;
  recipe.ingredients = row.ingredients.split("\n");
  recipe.steps = row.steps.split("\n");
  recipe.keywords = row.keywords.split(",");
  recipe.title_for_url = row.title_for_url;
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
