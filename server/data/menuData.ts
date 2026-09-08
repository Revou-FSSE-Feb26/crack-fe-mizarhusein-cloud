import type { MenuItem, RestaurantInfo } from "../../src/types";

export const menuItems: MenuItem[] = [
  // Pizza
  {
    id: 1,
    name: "Margherita",
    description:
      "Classic delight with tomato sauce, mozzarella cheese, fresh basil, and a drizzle of olive oil.",
    price: 175000,
    image: "/menu/pizza/margherita.png",
    category: "pizza",
  },
  {
    id: 2,
    name: "Pepperoni",
    description:
      "Tomato sauce, mozzarella cheese, beef pepperoni, and a blend of Italian herbs.",
    price: 195000,
    image: "/menu/pizza/pepperoni.png",
    category: "pizza",
  },
  {
    id: 3,
    name: "Truffle Mushroom",
    description:
      "Creamy truffle sauce, mozzarella, sautéed mushrooms, arugula, and parmesan cheese.",
    price: 180000,
    image: "/menu/pizza/truffle_mushroom.png",
    category: "pizza",
  },
  {
    id: 4,
    name: "Quattro Formaggi",
    description:
      "A rich blend of mozzarella, gorgonzola, parmesan, and fontina cheese on a crispy crust.",
    price: 175000,
    image: "/menu/pizza/quattro_formaggi.png",
    category: "pizza",
  },

  // Pasta
  {
    id: 5,
    name: "Penne Arrabbiata",
    description: "Spicy tomato sauce with garlic, chili, and fresh basil.",
    price: 120000,
    image: "/menu/pasta/penne_arrabbiata.png",
    category: "pasta",
  },
  {
    id: 6,
    name: "Fettuccine Carbonara",
    description: "Creamy sauce with egg, parmesan cheese, and smoked beef.",
    price: 150000,
    image: "/menu/pasta/fettuccine_carbonara.png",
    category: "pasta",
  },
  {
    id: 7,
    name: "Linguine Pesto Genovese",
    description:
      "Classic basil pesto with parmesan cheese, pine nuts, and extra virgin olive oil.",
    price: 120000,
    image: "/menu/pasta/linguine_pesto_genovese.png",
    category: "pasta",
  },
  {
    id: 8,
    name: "Spaghetti Frutti di Mare",
    description:
      "Seafood pasta with shrimp, mussels, clams, cherry tomatoes, and white wine garlic sauce.",
    price: 150000,
    image: "/menu/pasta/spaghetti_frutti_di_mare.png",
    category: "pasta",
  },

  // Seafood
  {
    id: 9,
    name: "Grilled Tiger Prawns",
    description:
      "Juicy tiger prawns grilled to perfection, served with lemon garlic butter and fresh herbs.",
    price: 250000,
    image: "/menu/seafood/grilled_tiger_prawns.png",
    category: "seafood",
  },
  {
    id: 10,
    name: "Calamari Fritti",
    description:
      "Crispy calamari lightly seasoned and fried golden, served with lemon aioli.",
    price: 150000,
    image: "/menu/seafood/calamari_fritti.png",
    category: "seafood",
  },
  {
    id: 11,
    name: "Pan-Seared Salmon",
    description:
      "Seared salmon fillet with lemon dill cream sauce, served with grilled vegetables.",
    price: 350000,
    image: "/menu/seafood/pan-seared_salmon.png",
    category: "seafood",
  },
  {
    id: 12,
    name: "Mussels in White Wine Sauce",
    description:
      "Steamed mussels in a fragrant white wine, garlic, and parsley sauce, served with toasted bread.",
    price: 250000,
    image: "/menu/seafood/mussels_in_white_wine_sauce.png",
    category: "seafood",
  },

  // Drinks
  {
    id: 13,
    name: "Ice Tea",
    description: "",
    price: 40000,
    image: "/menu/drink/ice_tea.png",
    category: "drinks",
  },
  {
    id: 14,
    name: "Ice Latte",
    description: "",
    price: 60000,
    image: "/menu/drink/ice_latte.png",
    category: "drinks",
  },
  {
    id: 15,
    name: "Coca Cola",
    description: "",
    price: 28000,
    image: "/menu/drink/coca_cola.png",
    category: "drinks",
  },
  {
    id: 16,
    name: "Aqua",
    description: "",
    price: 20000,
    image: "/menu/drink/Aqua.png",
    category: "drinks",
  },
  {
    id: 17,
    name: "Chocolate Frappe",
    description: "",
    price: 50000,
    image: "/menu/drink/chocolate_frappe.png",
    category: "drinks",
  },
  {
    id: 18,
    name: "Sangria Wine (Cocktail)",
    description: "",
    price: 120000,
    image: "/menu/drink/sangria_wine.png",
    category: "drinks",
  },
  {
    id: 19,
    name: "Bintang Beer (Small)",
    description: "",
    price: 50000,
    image: "/menu/drink/bintang_small.png",
    category: "drinks",
  },
  {
    id: 20,
    name: "Bloody Mary (Cocktail)",
    description: "",
    price: 100000,
    image: "/menu/drink/bloody_marry.png",
    category: "drinks",
  },
];

export const restaurantInfo: RestaurantInfo = {
  name: "Saluna Beach Club",
  tagline: "Coastal Dining, Santorini Style",
  description:
    "Saluna Beach Club menghadirkan pengalaman bersantap tepi pantai bergaya Mediterania, dengan hidangan Italia dan seafood segar pilihan.",
  descriptionEn:
    "Saluna Beach Club brings a Mediterranean beachside dining experience, featuring Italian dishes and the freshest seafood selections.",
  location: "Bali, Indonesia",
  phone: "+62 812 3456 7890",
  email: "hello@salunabeachclub.com",
  hours: "Mon - Sun: 10:00 - 22:00",
};
