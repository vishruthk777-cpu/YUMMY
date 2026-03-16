// Yummy Restaurant & Udipi Hotel - Shadnagar
// Complete Menu Dataset

export const MENU_ITEMS = [
  // --- BREAKFAST ---
  { id: 1, name: 'Premium Masala Dosa', category: 'Breakfast', price: 60, rating: 4.8, prepTime: 10, isVeg: true, isVegan: true,
    image: '/images/masala_dosa_1773244385017.png', desc: 'Our signature golden-brown crispy crepe, filled with perfectly spiced mashed potatoes. Served with traditional coconut chutney and hearty sambar.', popular: true, combo: null },
  { id: 2, name: 'Ghee Karam Idli', category: 'Breakfast', price: 50, rating: 4.7, prepTime: 8, isVeg: true, isVegan: false,
    image: '/images/ghee_idli_1773244404254.png', desc: 'Savor the goodness of soft, fluffy idlis generously tossed in our secret spicy podi and pure desi ghee. A flavorful burst in every bite!', popular: true, combo: null },
  { id: 3, name: 'Medu Vada (3 Pcs)', category: 'Breakfast', price: 45, rating: 4.5, prepTime: 10, isVeg: true, isVegan: true,
    image: '/images/medu_vada_1773244422824.png', desc: 'Traditional crispy lentil donuts, fried to golden perfection with a soft inside. Melts in your mouth with every dip of sambar.', popular: false, combo: null },
  { id: 14, name: 'Classic Plain Dosa', category: 'Breakfast', price: 40, rating: 4.4, prepTime: 8, isVeg: true, isVegan: true,
    image: '/images/masala_dosa_1773244385017.png', desc: 'Thin, ultra-crispy golden crepe made from fermented rice and lentil batter. Simple, classic, and satisfying.', popular: false, combo: null },
  { id: 15, name: 'Special Vegetable Upma', category: 'Breakfast', price: 35, rating: 4.3, prepTime: 7, isVeg: true, isVegan: true,
    image: '/images/ghee_idli_1773244404254.png', desc: 'A savory semolina porridge cooked with fresh garden vegetables and tempered with aromatic spices.', popular: false, combo: null },
  { id: 16, name: 'Ultimate Pongal & Vada Combo', category: 'Breakfast', price: 70, rating: 4.9, prepTime: 12, isVeg: true, isVegan: false,
    image: '/images/ghee_idli_1773244404254.png', desc: 'Hearty ven pongal served with a crispy vada – the perfect balance of comfort and crunch for a great morning.', popular: true, combo: 'BESTSELLER' },

  // --- SOUTH INDIAN ---
  { id: 17, name: 'Ginger Pesarattu', category: 'South Indian', price: 55, rating: 4.6, prepTime: 12, isVeg: true, isVegan: true,
    image: '/images/masala_dosa_1773244385017.png', desc: 'Nutritious green gram crepe topped with finely chopped ginger and green chilies. A healthy, high-protein treat.', popular: true, combo: null },
  { id: 18, name: 'Fluffy Set Dosa (3 Pcs)', category: 'South Indian', price: 50, rating: 4.5, prepTime: 10, isVeg: true, isVegan: true,
    image: '/images/masala_dosa_1773244385017.png', desc: 'Three soft and spongy dosas, lightly cooked in pure ghee for a delicate aroma. Served with fresh coconut chutney.', popular: false, combo: null },
  { id: 19, name: 'Royal Bisi Bele Bath', category: 'South Indian', price: 80, rating: 4.7, prepTime: 15, isVeg: true, isVegan: false,
    image: '/images/south_thali_1773244442568.png', desc: 'An elaborate one-pot meal of rice, lentils, and fresh veggies, slow-cooked in a unique blend of spices and clarified butter.', popular: true, combo: null },

  // --- MEALS ---
  { id: 4, name: 'Grand South Indian Thali', category: 'Meals', price: 120, rating: 4.9, prepTime: 15, isVeg: true, isVegan: false,
    image: '/images/south_thali_1773244442568.png', desc: 'A feast for the senses: Basmati rice, traditional dal, three seasonal curries, sambar, rasam, papad, curd, and a sweet surprise.', popular: true, combo: 'VALUE FEAST' },
  { id: 5, name: 'Paneer Butter Masala + Butter Roti', category: 'Meals', price: 180, rating: 4.7, prepTime: 20, isVeg: true, isVegan: false,
    image: '/images/popular_paneer_1773136710159.png', desc: 'Soft cottage cheese cubes in a rich, velvety tomato and butter gravy. Served with three freshly made butter rotis.', popular: true, combo: null },
  { id: 6, name: 'Hyderabadi Veg Dum Biryani', category: 'Meals', price: 150, rating: 4.8, prepTime: 25, isVeg: true, isVegan: false,
    image: '/images/veg_biryani_1773244462351.png', desc: 'Fragrant long-grain basmati rice layered with garden-fresh vegetables and slow-cooked (dum) with exotic spices. Served with raita.', popular: true, combo: null },
  { id: 20, name: 'Garlic Dal Fry & Jeera Rice', category: 'Meals', price: 110, rating: 4.6, prepTime: 15, isVeg: true, isVegan: true,
    image: '/images/south_thali_1773244442568.png', desc: 'Golden yellow lentils tempered with roasted garlic and cumin seeds, paired with aromatic jeera rice.', popular: false, combo: null },

  // --- SNACKS ---
  { id: 7, name: 'Crispy Vegetable Puff', category: 'Snacks', price: 20, rating: 4.3, prepTime: 5, isVeg: true, isVegan: true,
    image: '/images/veg_puff_1773244492456.png', desc: 'Light, flaky puff pastry layers holding a delicious filling of spiced potatoes, peas, and carrots.', popular: false, combo: null },
  { id: 8, name: 'Shadnagar Special Onion Samosa (2 Pcs)', category: 'Snacks', price: 25, rating: 4.5, prepTime: 5, isVeg: true, isVegan: true,
    image: '/images/onion_samosa_1773244510546.png', desc: 'The local favorite! Crispy, deep-fried pastry triangles packed with a savory, hand-spiced onion filling.', popular: true, combo: null },
  { id: 21, name: 'Stuffed Mirchi Bajji (4 Pcs)', category: 'Snacks', price: 30, rating: 4.6, prepTime: 8, isVeg: true, isVegan: true,
    image: '/images/onion_samosa_1773244510546.png', desc: 'Tangy and spicy green chilies batter-fried with a special peanut and spice stuffing. A perfect evening companion.', popular: true, combo: null },
  { id: 22, name: 'Gourmet Veg Burger', category: 'Snacks', price: 60, rating: 4.4, prepTime: 10, isVeg: true, isVegan: false,
    image: '/images/veg_puff_1773244492456.png', desc: 'A crispy mixed vegetable patty topped with fresh lettuce, onions, and our secret creamy sauce in a toasted brioche-style bun.', popular: false, combo: null },

  // --- BAKERY ---
  { id: 9, name: 'Authentic Osmania Biscuits (250g)', category: 'Bakery', price: 80, rating: 4.9, prepTime: 0, isVeg: true, isVegan: false,
    image: '/images/osmania_biscuits_1773244532417.png', desc: 'Our legendary sweet-salty biscuits. Baked fresh daily, these are the soul of Shadnagar’s evening tea time.', popular: true, combo: 'CHAI SPECIAL' },
  { id: 23, name: 'Freshly Baked White Bread', category: 'Bakery', price: 40, rating: 4.3, prepTime: 0, isVeg: true, isVegan: false,
    image: '/images/osmania_biscuits_1773244532417.png', desc: 'Soft, fluffy, and aromatic white sandwich bread baked right here in our ovens. No preservatives added.', popular: false, combo: null },
  { id: 24, name: 'Famous Maska Bun', category: 'Bakery', price: 25, rating: 4.4, prepTime: 2, isVeg: true, isVegan: false,
    image: '/images/osmania_biscuits_1773244532417.png', desc: 'A warm, soft bun sliced and loaded with premium fresh butter. A nostalgic treat that never gets old.', popular: false, combo: null },

  // --- CAKES ---
  { id: 10, name: 'Signature Black Forest Pastry', category: 'Cakes', price: 60, rating: 4.7, prepTime: 0, isVeg: true, isVegan: false,
    image: '/images/black_forest_1773244550470.png', desc: 'Layers of moist chocolate sponge, fresh whipped cream, and tart cherries, topped with chocolate shavings.', popular: true, combo: null },
  { id: 11, name: 'Classic Pineapple Cake (1kg)', category: 'Cakes', price: 450, rating: 4.8, prepTime: 60, isVeg: true, isVegan: false,
    image: '/images/pineapple_cake_1773244566692.png', desc: 'A timeless celebration cake. Freshly baked sponge with real juicy pineapple chunks and light, airy cream.', popular: false, combo: null },
  { id: 25, name: 'Rich Chocolate Truffle Cake (500g)', category: 'Cakes', price: 280, rating: 4.9, prepTime: 60, isVeg: true, isVegan: false,
    image: '/images/black_forest_1773244550470.png', desc: 'Indulge in our most luxurious Belgian chocolate ganache cake. Intensely chocolatey and smooth.', popular: true, combo: null },
  { id: 26, name: 'Classic Red Velvet Pastry', category: 'Cakes', price: 65, rating: 4.7, prepTime: 0, isVeg: true, isVegan: false,
    image: '/images/black_forest_1773244550470.png', desc: 'Velvety red cocoa-infused sponge layered with our signature cream cheese frosting. Elegant and delicious.', popular: true, combo: null },

  // --- BEVERAGES ---
  { id: 12, name: 'Creamy Irani Chai', category: 'Beverages', price: 20, rating: 4.9, prepTime: 5, isVeg: true, isVegan: false,
    image: '/images/irani_chai_1773244596481.png', desc: 'The real deal! Slow-brewed for hours until dense, rich, and naturally sweet. Experience the taste of Hyderabad locally.', popular: true, combo: 'LOCAL FAVOURITE' },
  { id: 13, name: 'Traditional Filter Coffee', category: 'Beverages', price: 30, rating: 4.8, prepTime: 5, isVeg: true, isVegan: false,
    image: '/images/filter_coffee_1773244615453.png', desc: 'Freshly ground chicory-coffee blend, brewed in traditional filters and frothed with hot milk.', popular: true, combo: null },
  { id: 27, name: 'Zesty Fresh Lime Soda', category: 'Beverages', price: 40, rating: 4.6, prepTime: 3, isVeg: true, isVegan: true,
    image: '/images/irani_chai_1773244596481.png', desc: 'Hand-squeezed lime with chilled soda. Available sweet, salted, or mixed for a refreshing kick.', popular: false, combo: null },
  { id: 28, name: 'Premium Mango Lassi', category: 'Beverages', price: 60, rating: 4.7, prepTime: 5, isVeg: true, isVegan: false,
    image: '/images/irani_chai_1773244596481.png', desc: 'Thick, creamy yogurt smoothie blended with ripe Alphonso mango pulp. A golden summer delight.', popular: true, combo: null },

  // --- COMBOS ---
  { id: 29, name: 'Imperial Family Feast', category: 'Combos', price: 399, rating: 4.9, prepTime: 30, isVeg: true, isVegan: false,
    image: '/images/south_thali_1773244442568.png', desc: 'Two Grand Thalis, one Veg Biryani, two Samosas, and two Irani Chai. The ultimate meal for family and friends.', popular: true, combo: 'BEST VALUE' },
  { id: 30, name: 'Quick Morning Combo', category: 'Combos', price: 99, rating: 4.6, prepTime: 15, isVeg: true, isVegan: false,
    image: '/images/veg_puff_1773244492456.png', desc: 'Our signature Masala Dosa paired with hot Filter Coffee. Simple, efficient, and delicious.', popular: true, combo: 'MORNING HIT' },
];

export const CATEGORIES = [
  { id: 'all', name: 'All', emoji: '🍽️' },
  { id: 'Breakfast', name: 'Breakfast', emoji: '🌅' },
  { id: 'South Indian', name: 'South Indian', emoji: '🥘' },
  { id: 'Meals', name: 'Meals', emoji: '🍚' },
  { id: 'Snacks', name: 'Snacks', emoji: '🥨' },
  { id: 'Bakery', name: 'Bakery', emoji: '🥐' },
  { id: 'Cakes', name: 'Cakes', emoji: '🎂' },
  { id: 'Beverages', name: 'Beverages', emoji: '☕' },
  { id: 'Combos', name: 'Combos', emoji: '🎁' },
];

export const COUPONS = [
  { code: 'YUMMY10', discount: 10, type: 'percent', minOrder: 100, desc: '10% off on orders above ₹100' },
  { code: 'FIRST50', discount: 50, type: 'flat', minOrder: 150, desc: '₹50 off on your first order' },
  { code: 'SHADNAGAR', discount: 20, type: 'percent', minOrder: 200, desc: '20% off for Shadnagar customers' },
  { code: 'FAMILY', discount: 80, type: 'flat', minOrder: 350, desc: '₹80 off on Family Combos' },
];
