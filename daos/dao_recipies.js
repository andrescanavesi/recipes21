/**
 *
 * @param {int} page
 */
function find(page) {
  const description =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

  const image =
    "https://res.cloudinary.com/dniiru5xy/image/upload/c_fill,g_auto/w_600,q_auto,f_auto/scones-queso9.jpg";

  const featuredImageBase =
    "https://res.cloudinary.com/dniiru5xy/image/upload/c_fill,g_auto/w_600,q_auto,f_auto/";

  const recipies = [];

  const recipe1 = {
    title: "Scones de queso",
    title_for_url: "scones-de-queso",
    description: "Como preparar scones de queso",
    created_at: "2018-06-24 10:59:13",
    updated_at: "2018-06-24 11:00:22",
    featured_image: featuredImageBase + "scones-queso9.jpg",
    ingredients: [
      "2 tazas harina",
      "4 cucharaditas polvo de hornear",
      "1/2 taza queso rallado tipo parmesano",
      "1/3 taza aceite o manteca",
      "2/3 taza leche"
    ],
    keywords: ["scones", "queso"],
    steps: [
      "Mezclar el harina con el polvo de hornear y el queso rallado. Tenemos ya mezclado el aceite y la leche. ",
      "Incorporar y seguir mezclando.",
      "Mezclamos con las manos hasta lograr una masa húmeda pero firme, no tiene que quedar seca ",
      "No usamos palo de amasar, sino que vamos estirando con los dedos la masa, hasta que sea de aproximadamente 1 cm de espesor, y con una copita o moldecito, cortamos circulitos.",
      "Colocamos en asadera previamente aceitada con un poco de separación entre cada uno.",
      "Al horno, previamente calentado unos 20 minutos"
    ],
    active: true,
    apto_celiacos: false,
    total_time_text: "50 minutos",
    total_time_meta: "PT50M",
    category: "Pan, Bollería y Confitería"
  };

  recipies.push(recipe1);

  const recipie2 = {};
  recipie2.title = "recipie 2";
  recipie2.description = description;
  recipie2.featured_image = featuredImageBase + "pan-molde.jpg";
  recipies.push(recipie2);

  return recipies;
}

module.exports.find = find;
