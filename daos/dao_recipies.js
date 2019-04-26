function find(page) {
  const recipie1 = {};
  recipie1.title = "recipie 1";

  const recipie2 = {};
  recipie2.title = "recipie 2";

  const recipies = [];
  recipies.push(recipie1);
  recipies.push(recipie2);

  return recipies;
}

module.exports.find = find;
