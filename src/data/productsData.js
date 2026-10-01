/**
 * Initial Product Catalog for Aastha General Store (Jaunpur, UP)
 * 55 handpicked items covering Groceries, Snacks, Daily Care, Cosmetics & Gifts.
 * Seeded into localStorage on initial application launch.
 */

export const CATEGORIES = [
  'All Items',
  'General Groceries',
  'Snacks & Chocolates',
  'Daily Care',
  'Cosmetics',
  'Gift Items',
];

export const INITIAL_PRODUCTS = [
  // ================= GENERAL GROCERIES =================
  {
    id: 'prod_groc_01',
    name: 'Aashirvaad Shudh Chakki Atta',
    price: 245,
    category: 'General Groceries',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80',
    unit: '5 kg',
    isBestseller: true,
    inStock: true,
    description: '100% pure whole wheat flour processed with traditional stone chakki grinding.'
  },
  {
    id: 'prod_groc_02',
    name: 'Fortune Sunlite Refined Sunflower Oil',
    price: 145,
    category: 'General Groceries',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80',
    unit: '1 Litre',
    isBestseller: true,
    inStock: true,
    description: 'Light and healthy refined sunflower oil enriched with Vitamins A & D.'
  },
  {
    id: 'prod_groc_03',
    name: 'India Gate Basmati Rice (Rozana)',
    price: 115,
    category: 'General Groceries',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
    unit: '1 kg',
    isBestseller: true,
    inStock: true,
    description: 'Long grain aromatic basmati rice ideal for everyday pulao and khichdi.'
  },
  {
    id: 'prod_groc_04',
    name: 'Tata Sampann Unpolished Toor Dal',
    price: 175,
    category: 'General Groceries',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80',
    unit: '1 kg',
    isBestseller: false,
    inStock: true,
    description: 'High protein unpolished arhar/toor dal rich in natural goodness.'
  },
  {
    id: 'prod_groc_05',
    name: 'Tata Salt (Desh Ka Namak)',
    price: 28,
    category: 'General Groceries',
    image: 'https://images.unsplash.com/photo-1626197031507-c17099753214?w=600&auto=format&fit=crop&q=80',
    unit: '1 kg',
    isBestseller: true,
    inStock: true,
    description: 'Vacuum evaporated iodized salt essential for proper mental development.'
  },
  {
    id: 'prod_groc_06',
    name: 'Madhur Pure & Hygienic Sugar',
    price: 48,
    category: 'General Groceries',
    image: 'https://images.unsplash.com/photo-1581441363689-1f3c3c414635?w=600&auto=format&fit=crop&q=80',
    unit: '1 kg',
    isBestseller: false,
    inStock: true,
    description: 'Sulphur-free, sparkling white crystal sugar refined with hygiene.'
  },
  {
    id: 'prod_groc_07',
    name: 'Tata Tea Gold Leaf Tea',
    price: 155,
    category: 'General Groceries',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80',
    unit: '250 g',
    isBestseller: true,
    inStock: true,
    description: 'Exquisite blend of rich Assam CTC tea leaves with gently rolled long leaves.'
  },
  {
    id: 'prod_groc_08',
    name: 'Catch Turmeric (Haldi) Powder',
    price: 45,
    category: 'General Groceries',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&auto=format&fit=crop&q=80',
    unit: '200 g',
    isBestseller: false,
    inStock: true,
    description: 'Rich golden turmeric powder ground using low-temperature grinding technology.'
  },
  {
    id: 'prod_groc_09',
    name: 'Everest Meat Masala',
    price: 68,
    category: 'General Groceries',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&auto=format&fit=crop&q=80',
    unit: '100 g',
    isBestseller: false,
    inStock: true,
    description: 'Pepper-coriander based spicy aromatic seasoning for rich curries.'
  },
  {
    id: 'prod_groc_10',
    name: 'Everest Chaat Masala',
    price: 42,
    category: 'General Groceries',
    image: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=600&auto=format&fit=crop&q=80',
    unit: '100 g',
    isBestseller: false,
    inStock: true,
    description: 'Tangy and savory spice sprinkle for fruits, salads, and street treats.'
  },
  {
    id: 'prod_groc_11',
    name: 'Amul Pure Ghee Tin',
    price: 590,
    category: 'General Groceries',
    image: 'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?w=600&auto=format&fit=crop&q=80',
    unit: '1 Litre',
    isBestseller: true,
    inStock: true,
    description: 'Traditional aromatic pure cow ghee with rich golden granular texture.'
  },
  {
    id: 'prod_groc_12',
    name: 'Catch Red Chilli Powder (Tikhalal)',
    price: 52,
    category: 'General Groceries',
    image: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=600&auto=format&fit=crop&q=80',
    unit: '200 g',
    isBestseller: false,
    inStock: false, // Out of stock demo
    description: 'Fiery red hot chili powder giving deep color and authentic Indian heat.'
  },

  // ================= SNACKS & CHOCOLATES =================
  {
    id: 'prod_snack_01',
    name: 'Cadbury Dairy Milk Silk Chocolate',
    price: 85,
    category: 'Snacks & Chocolates',
    image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=600&auto=format&fit=crop&q=80',
    unit: '60 g',
    isBestseller: true,
    inStock: true,
    description: 'Velvety smooth milk chocolate that melts effortlessly in your mouth.'
  },
  {
    id: 'prod_snack_02',
    name: 'Nestlé KitKat 4 Finger Wafer Bar',
    price: 30,
    category: 'Snacks & Chocolates',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80',
    unit: '38.5 g',
    isBestseller: true,
    inStock: true,
    description: 'Crisp wafer fingers enrobed in smooth creamy milk chocolate. Have a break!'
  },
  {
    id: 'prod_snack_03',
    name: 'Cadbury 5 Star Chocolate Bar',
    price: 20,
    category: 'Snacks & Chocolates',
    image: 'https://images.unsplash.com/photo-1582293041079-7814c2f12063?w=600&auto=format&fit=crop&q=80',
    unit: '40 g',
    isBestseller: false,
    inStock: true,
    description: 'Chewy caramel and crunchy nougat covered in rich chocolate. Eat 5 Star, do nothing!'
  },
  {
    id: 'prod_snack_04',
    name: 'Kurkure Masala Munch Crisps',
    price: 20,
    category: 'Snacks & Chocolates',
    image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=600&auto=format&fit=crop&q=80',
    unit: '75 g',
    isBestseller: true,
    inStock: true,
    description: 'Classic Indian crunchy puffed snack coated with chatpata masala flavour.'
  },
  {
    id: 'prod_snack_05',
    name: "Lay's India's Magic Masala Chips",
    price: 20,
    category: 'Snacks & Chocolates',
    image: 'https://images.unsplash.com/photo-1621447504864-d8686e12698c?w=600&auto=format&fit=crop&q=80',
    unit: '50 g',
    isBestseller: true,
    inStock: true,
    description: 'Thin crispy potato chips seasoned with a zesty blend of authentic Indian spices.'
  },
  {
    id: 'prod_snack_06',
    name: "Lay's Classic Salted Potato Chips",
    price: 20,
    category: 'Snacks & Chocolates',
    image: 'https://images.unsplash.com/photo-1527842891421-42eec6e703ea?w=600&auto=format&fit=crop&q=80',
    unit: '50 g',
    isBestseller: false,
    inStock: true,
    description: 'Golden crisped potato chips lightly sprinkled with pure table salt.'
  },
  {
    id: 'prod_snack_07',
    name: "Uncle Chipps Spicy Treat",
    price: 20,
    category: 'Snacks & Chocolates',
    image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=600&auto=format&fit=crop&q=80',
    unit: '50 g',
    isBestseller: false,
    inStock: true,
    description: 'Classic desi taste with wholesome ridges and spicy Indian herbs.'
  },
  {
    id: 'prod_snack_08',
    name: 'Parle-G Gold Biscuits (Family Pack)',
    price: 35,
    category: 'Snacks & Chocolates',
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&auto=format&fit=crop&q=80',
    unit: '1 kg',
    isBestseller: true,
    inStock: true,
    description: "India's beloved glucose biscuit with more milk and wheat energy."
  },
  {
    id: 'prod_snack_09',
    name: 'Britannia Good Day Cashew Cookies',
    price: 40,
    category: 'Snacks & Chocolates',
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600&auto=format&fit=crop&q=80',
    unit: '200 g',
    isBestseller: true,
    inStock: true,
    description: 'Rich buttery cookies loaded with real crunchy cashew nuts and cheerful smiles.'
  },
  {
    id: 'prod_snack_10',
    name: 'Parle Hide & Seek Chocolate Chip Cookies',
    price: 45,
    category: 'Snacks & Chocolates',
    image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=600&auto=format&fit=crop&q=80',
    unit: '120 g',
    isBestseller: false,
    inStock: true,
    description: 'Mouthwatering chocolate biscuits sprinkled with real decadent chocolate chips.'
  },
  {
    id: 'prod_snack_11',
    name: 'Maggi 2-Minute Masala Noodles (Pack of 4)',
    price: 56,
    category: 'Snacks & Chocolates',
    image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=600&auto=format&fit=crop&q=80',
    unit: '280 g',
    isBestseller: true,
    inStock: true,
    description: 'Iconic instant noodles with the taste of 10 roasted signature spices.'
  },
  {
    id: 'prod_snack_12',
    name: 'Haldiram’s Bhujia Sev',
    price: 55,
    category: 'Snacks & Chocolates',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80',
    unit: '200 g',
    isBestseller: false,
    inStock: true,
    description: 'Crispy spiced moth bean flour noodles seasoned with red chillies and black pepper.'
  },
  {
    id: 'prod_snack_13',
    name: 'Cadbury Celebrations Chocolate Gift Pack',
    price: 150,
    category: 'Snacks & Chocolates',
    image: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=600&auto=format&fit=crop&q=80',
    unit: '118 g',
    isBestseller: true,
    inStock: true,
    description: 'Assortment of favorite Cadbury chocolates celebrating sweet Indian moments.'
  },
  {
    id: 'prod_snack_14',
    name: 'Britannia Bourbon The Original Cream Biscuits',
    price: 35,
    category: 'Snacks & Chocolates',
    image: 'https://images.unsplash.com/photo-1548848221-0c2e497ed557?w=600&auto=format&fit=crop&q=80',
    unit: '150 g',
    isBestseller: false,
    inStock: true,
    description: 'Rich dark chocolate biscuits filled with chocolate cream and sugar crystals.'
  },

  // ================= DAILY CARE & HYGIENE =================
  {
    id: 'prod_care_01',
    name: 'Dettol Original Bathing Soap Bar (Pack of 3)',
    price: 120,
    category: 'Daily Care',
    image: 'https://images.unsplash.com/photo-1607006314170-65e317d6c63a?w=600&auto=format&fit=crop&q=80',
    unit: '3 x 100 g',
    isBestseller: true,
    inStock: true,
    description: 'Trusted 99.9% germ protection soap bar with gentle everyday skin care.'
  },
  {
    id: 'prod_care_02',
    name: 'Dove Cream Beauty Bathing Soap Bar',
    price: 65,
    category: 'Daily Care',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
    unit: '100 g',
    isBestseller: true,
    inStock: true,
    description: 'Contains 1/4th moisturizing cream leaving skin soft, smooth and glowing.'
  },
  {
    id: 'prod_care_03',
    name: 'Lifebuoy Total Germ Protection Soap',
    price: 32,
    category: 'Daily Care',
    image: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=600&auto=format&fit=crop&q=80',
    unit: '125 g',
    isBestseller: false,
    inStock: true,
    description: 'Advanced silver shield formula providing 10x better germ protection.'
  },
  {
    id: 'prod_care_04',
    name: 'Head & Shoulders Anti-Dandruff Shampoo',
    price: 180,
    category: 'Daily Care',
    image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&auto=format&fit=crop&q=80',
    unit: '180 ml',
    isBestseller: true,
    inStock: true,
    description: 'Smooth and silky anti-dandruff shampoo that keeps scalp clean and fresh.'
  },
  {
    id: 'prod_care_05',
    name: 'Clinic Plus Strong & Long Shampoo',
    price: 95,
    category: 'Daily Care',
    image: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=600&auto=format&fit=crop&q=80',
    unit: '175 ml',
    isBestseller: false,
    inStock: true,
    description: 'Enriched with milk protein and multivitamins for 35x stronger hair.'
  },
  {
    id: 'prod_care_06',
    name: 'Colgate Strong Teeth Dental Cream Toothpaste',
    price: 110,
    category: 'Daily Care',
    image: 'https://images.unsplash.com/photo-1559591937-e105e1975e5d?w=600&auto=format&fit=crop&q=80',
    unit: '200 g',
    isBestseller: true,
    inStock: true,
    description: 'Amino Shakti formula adds natural calcium for 2x stronger teeth.'
  },
  {
    id: 'prod_care_07',
    name: 'Closeup Everfresh Red Hot Gel Toothpaste',
    price: 75,
    category: 'Daily Care',
    image: 'https://images.unsplash.com/photo-1563178406-4cdc2923acbc?w=600&auto=format&fit=crop&q=80',
    unit: '150 g',
    isBestseller: false,
    inStock: true,
    description: 'Anti-bacterial zinc mouthwash infused gel for 12 hours of intensely fresh breath.'
  },
  {
    id: 'prod_care_08',
    name: 'Surf Excel Quick Wash Detergent Powder',
    price: 140,
    category: 'Daily Care',
    image: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=600&auto=format&fit=crop&q=80',
    unit: '1 kg',
    isBestseller: true,
    inStock: true,
    description: 'X-Tra clean particles remove tough stains like grease and mud in seconds.'
  },
  {
    id: 'prod_care_09',
    name: 'Vim Dishwash Lemon Gel Bottle',
    price: 60,
    category: 'Daily Care',
    image: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=600&auto=format&fit=crop&q=80',
    unit: '250 ml',
    isBestseller: false,
    inStock: true,
    description: 'Concentrated gel with the power of 100 lemons removing tough burnt stains.'
  },
  {
    id: 'prod_care_10',
    name: 'Whisper Choice Ultra Sanitary Pads (XL)',
    price: 80,
    category: 'Daily Care',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
    unit: '6 Pads',
    isBestseller: true,
    inStock: true,
    description: 'All-night leak lock protection with soft wings and odor-neutralizing pearls.'
  },
  {
    id: 'prod_care_11',
    name: 'Harpic Power Plus Toilet Cleaner (Original)',
    price: 93,
    category: 'Daily Care',
    image: 'https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=600&auto=format&fit=crop&q=80',
    unit: '500 ml',
    isBestseller: false,
    inStock: true,
    description: 'Disinfectant toilet cleaner removing 99.9% of germs and yellow limescale.'
  },

  // ================= COSMETICS & BEAUTY =================
  {
    id: 'prod_cosm_01',
    name: 'Lakmé Eyeconic Kajal (Deep Black)',
    price: 195,
    category: 'Cosmetics',
    image: 'https://images.unsplash.com/photo-1583001800475-54213244da36?w=600&auto=format&fit=crop&q=80',
    unit: '0.35 g',
    isBestseller: true,
    inStock: true,
    description: 'Smudge-proof, waterproof kajal with dermatologically tested 24-hr long wear.'
  },
  {
    id: 'prod_cosm_02',
    name: 'Maybelline New York Color Sensational Creamy Matte Lipstick',
    price: 299,
    category: 'Cosmetics',
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&auto=format&fit=crop&q=80',
    unit: '3.9 g',
    isBestseller: true,
    inStock: true,
    description: 'Non-drying velvet matte texture infused with nourishing shea butter.'
  },
  {
    id: 'prod_cosm_03',
    name: 'Himalaya Purifying Neem Face Wash',
    price: 140,
    category: 'Cosmetics',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80',
    unit: '150 ml',
    isBestseller: true,
    inStock: true,
    description: 'Soap-free herbal formula enriched with Neem and Turmeric to clear pimples.'
  },
  {
    id: 'prod_cosm_04',
    name: 'Pond’s Bright Beauty Serum Cream',
    price: 110,
    category: 'Cosmetics',
    image: 'https://images.unsplash.com/photo-1608248597359-5033c944ebc4?w=600&auto=format&fit=crop&q=80',
    unit: '50 g',
    isBestseller: false,
    inStock: true,
    description: 'Fades dark spots with Vitamin B3+ and boosts natural radiant glow.'
  },
  {
    id: 'prod_cosm_05',
    name: 'Elle 18 Color Pops Nail Polish (Crimson Red)',
    price: 60,
    category: 'Cosmetics',
    image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=600&auto=format&fit=crop&q=80',
    unit: '5 ml',
    isBestseller: false,
    inStock: true,
    description: 'Vibrant glossy nail lacquer with chip-resistant quick dry formula.'
  },
  {
    id: 'prod_cosm_06',
    name: 'Nivea Soft Light Moisturizing Cream',
    price: 170,
    category: 'Cosmetics',
    image: 'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=600&auto=format&fit=crop&q=80',
    unit: '100 ml',
    isBestseller: true,
    inStock: true,
    description: 'Quick-absorbing daily cream with Jojoba Oil and Vitamin E for bouncy skin.'
  },
  {
    id: 'prod_cosm_07',
    name: 'Vaseline Healthy Bright Daily Brightening Body Lotion',
    price: 230,
    category: 'Cosmetics',
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&auto=format&fit=crop&q=80',
    unit: '200 ml',
    isBestseller: false,
    inStock: true,
    description: 'Triple sunscreens and micro-droplets of Vaseline Jelly to heal sun damage.'
  },
  {
    id: 'prod_cosm_08',
    name: 'Biotique Bio Dandelion Visibly Ageless Serum',
    price: 220,
    category: 'Cosmetics',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80',
    unit: '40 ml',
    isBestseller: false,
    inStock: false, // Out of stock demo
    description: 'Pure dandelion and nutmeg oil blend easing wrinkles and dark spots.'
  },
  {
    id: 'prod_cosm_09',
    name: 'Garnier Micellar Cleansing Water',
    price: 199,
    category: 'Cosmetics',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80',
    unit: '125 ml',
    isBestseller: false,
    inStock: true,
    description: 'Captures dirt and waterproof makeup like a magnet without harsh rubbing.'
  },
  {
    id: 'prod_cosm_10',
    name: 'Parachute 100% Pure Coconut Hair Oil',
    price: 90,
    category: 'Cosmetics',
    image: 'https://images.unsplash.com/photo-1617897903246-719242758050?w=600&auto=format&fit=crop&q=80',
    unit: '250 ml',
    isBestseller: true,
    inStock: true,
    description: 'Naturally filtered pure coconut oil deep conditioning roots and scalp.'
  },

  // ================= GIFT ITEMS & HAMPERS =================
  {
    id: 'prod_gift_01',
    name: 'Royal Dry Fruit Gift Hamper Box',
    price: 649,
    category: 'Gift Items',
    image: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=600&auto=format&fit=crop&q=80',
    unit: '400 g (Almonds, Cashews, Raisins)',
    isBestseller: true,
    inStock: true,
    description: 'Handcrafted golden festive box packed with premium California almonds, cashews & raisins.'
  },
  {
    id: 'prod_gift_02',
    name: 'Cadbury Deluxe Chocolate Celebration Basket',
    price: 499,
    category: 'Gift Items',
    image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=600&auto=format&fit=crop&q=80',
    unit: 'Hamper Basket',
    isBestseller: true,
    inStock: true,
    description: 'Festive basket brimming with Silk, Dairy Milk, 5 Star, and decorative ribbons.'
  },
  {
    id: 'prod_gift_03',
    name: 'Traditional Brass Diya Peacock Showpiece',
    price: 349,
    category: 'Gift Items',
    image: 'https://images.unsplash.com/photo-1605007493699-ce65834f8a00?w=600&auto=format&fit=crop&q=80',
    unit: '1 piece (Handcrafted)',
    isBestseller: false,
    inStock: true,
    description: 'Exquisite antique brass showpiece with ornate peacock engraving for home blessing.'
  },
  {
    id: 'prod_gift_04',
    name: 'Ganesha Blessing Idol in Acrylic Glass Casing',
    price: 299,
    category: 'Gift Items',
    image: 'https://images.unsplash.com/photo-1567591414240-e14b3017ce8c?w=600&auto=format&fit=crop&q=80',
    unit: '1 pc (5 inches)',
    isBestseller: true,
    inStock: true,
    description: 'Lord Ganesha spiritual idol with velvet base and gold electroplating. Ideal housewarming gift.'
  },
  {
    id: 'prod_gift_05',
    name: 'Luxury Scented Soy Candle Gift Set (3 Aromas)',
    price: 380,
    category: 'Gift Items',
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&auto=format&fit=crop&q=80',
    unit: 'Set of 3 (Rose, Jasmine, Lavender)',
    isBestseller: false,
    inStock: true,
    description: 'Hand-poured smokeless soy wax candles in decorative glass jars with soothing fragrances.'
  },
  {
    id: 'prod_gift_06',
    name: 'Festive Floral Greetings Card Collection',
    price: 99,
    category: 'Gift Items',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80',
    unit: 'Pack of 5 with Envelopes',
    isBestseller: false,
    inStock: true,
    description: 'Embossed golden foil greeting cards for birthdays, anniversaries, and Diwali greetings.'
  },
  {
    id: 'prod_gift_07',
    name: 'Crystal Glass Photo & Memo Stand',
    price: 180,
    category: 'Gift Items',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80',
    unit: '1 piece',
    isBestseller: false,
    inStock: true,
    description: 'Modern desktop crystal stand for displaying precious family memories and messages.'
  },
  {
    id: 'prod_gift_08',
    name: 'Premium Tea Light Ceramic Aroma Diffuser',
    price: 240,
    category: 'Gift Items',
    image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=600&auto=format&fit=crop&q=80',
    unit: '1 piece + 2 Tealights',
    isBestseller: false,
    inStock: true,
    description: 'Handmade white ceramic cut-out oil burner for uplifting your home living room atmosphere.'
  }
];
