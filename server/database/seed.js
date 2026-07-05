/**
 * Seed script.
 * Run with: npm run seed
 *
 * Drops & recreates all tables from schema.sql, then inserts realistic
 * users, categories, businesses, and reviews for Addis Ababa, Ethiopia.
 *
 * Every seeded review is tied to a real seeded user account (reviews
 * require authorship now — see server/routes/auth.js). All seeded
 * demo accounts share one password so you can log in as any of them:
 *
 *   email:    <see printed list below, e.g. hana.getachew@example.com>
 *   password: Password123!
 *
 * There's also a dedicated demo account for testing the review flow:
 *   email:    demo@adisreview.com
 *   password: Password123!
 */

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const db = require('../config/db');

function seed() {
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  db.exec(schema);

  // ---------------------------------------------------------------
  // Users
  // One bcrypt hash is computed once and reused for every seed user -
  // they all share the same demo password. This keeps seeding fast
  // (bcrypt hashing is intentionally slow) while still exercising the
  // real hashing + verification code path used at login.
  // ---------------------------------------------------------------
  const DEMO_PASSWORD = 'Password123!';
  const passwordHash = bcrypt.hashSync(DEMO_PASSWORD, 10);

  const reviewerNames = [
    'Hana Getachew', 'Dawit Alemu', 'Selam Tesfaye', 'Nardos Fikru', 'Yonas Bekele',
    'Liya Solomon', 'Abel Girma', 'Meron Tadesse', 'Kalkidan Worku', 'Biniam Assefa',
    'Ruth Mekonnen', 'Samuel Tesema', 'Tigist Haile', 'Elias Yohannes', 'Sara Mulu',
    'Betelhem Ashenafi', 'Henok Wondimu', 'Mahlet Tsegaye', 'Robel Kebede',
    'Frehiwot Alene', 'Yared Mengistu', 'Hilina Getu', 'Amanuel Zerihun',
    'Sosina Tefera', 'Natnael Girma', 'Hiwot Alemayehu', 'Dagim Solomon',
    'Meskerem Bogale', 'Tewodros Alemu', 'Rahel Desta', 'Bereket Fikadu',
    'Eden Mamo', 'Feven Assefa', 'Yohannes Tadesse', 'Bethlehem Girma',
    'Kidus Alemayehu', 'Mekdes Haile', 'Fitsum Bekele', 'Lidya Worku', 'Getu Mengesha',
  ];

  const insertUser = db.prepare(
    'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)'
  );
  const userIds = {};
  for (const name of reviewerNames) {
    const email = `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`;
    const info = insertUser.run(name, email, passwordHash);
    userIds[name] = info.lastInsertRowid;
  }
  // A dedicated, easy-to-remember demo account for the interview walkthrough
  insertUser.run('Demo User', 'demo@adisreview.com', passwordHash);

  // ---------------------------------------------------------------
  // Categories
  // ---------------------------------------------------------------
  const categories = [
    { name: 'Restaurants', icon: 'FaUtensils', description: 'Places to enjoy a great meal' },
    { name: 'Cafés', icon: 'FaMugHot', description: 'Coffee shops and casual hangouts' },
    { name: 'Hotels', icon: 'FaHotel', description: 'Places to stay in Addis Ababa' },
    { name: 'Shopping', icon: 'FaShoppingBag', description: 'Malls and shopping centers' },
    { name: 'Healthcare', icon: 'FaHospital', description: 'Hospitals and medical centers' },
    { name: 'Beauty', icon: 'FaCut', description: 'Hair salons, nail salons, and spas' },
    { name: 'More', icon: 'FaEllipsisH', description: 'Real estate, banks, and other services' },
  ];

  const insertCategory = db.prepare(
    'INSERT INTO categories (name, icon, description) VALUES (?, ?, ?)'
  );
  const categoryIds = {};
  for (const c of categories) {
    const info = insertCategory.run(c.name, c.icon, c.description);
    categoryIds[c.name] = info.lastInsertRowid;
  }

  // ---------------------------------------------------------------
  // Businesses
  // ---------------------------------------------------------------
  const businesses = [
    // Restaurants
    {
      name: 'Sishu',
      category: 'Restaurants',
      description:
        'A cozy Addis Ababa favorite known for authentic Ethiopian dishes served in a warm, family-friendly setting. Popular for its tibs and generous portions.',
      address: 'Bole Road, Addis Ababa',
      lat: 8.9959, lng: 38.7891,
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
      price: '$$',
    },
    {
      name: 'Pizza Corner',
      category: 'Restaurants',
      description:
        'A relaxed spot for wood-fired pizza and pasta with an Ethiopian twist on toppings. A favorite among students and young professionals.',
      address: 'Kazanchis, Addis Ababa',
      lat: 9.0164, lng: 38.7635,
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80',
      price: '$$',
    },
    {
      name: 'Yod Abyssinia',
      category: 'Restaurants',
      description:
        'A cultural restaurant offering traditional Ethiopian cuisine alongside live music and dance performances - perfect for visitors and special occasions.',
      address: 'Bole Road, near Bole Airport, Addis Ababa',
      lat: 8.9806, lng: 38.7992,
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80',
      price: '$$$',
    },
    {
      name: '2000 Habesha',
      category: 'Restaurants',
      description:
        'One of the most iconic cultural restaurants in Addis Ababa, famous for its grand cultural shows, traditional decor, and authentic multi-course Ethiopian dining experience.',
      address: 'Bole Road, Addis Ababa',
      lat: 8.9930, lng: 38.7899,
      image: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?w=800&q=80',
      price: '$$$',
    },
    // Cafés
    {
      name: "Tomoca Coffee",
      category: 'Cafés',
      description:
        "Addis Ababa's most legendary coffee house, roasting and serving Ethiopian coffee since 1953. A must-visit for any coffee lover passing through the city.",
      address: 'Wavel Street, Piassa, Addis Ababa',
      lat: 9.0350, lng: 38.7500,
      image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&q=80',
      price: '$',
    },
    {
      name: "Kaldi's Coffee",
      category: 'Cafés',
      description:
        "Often called 'Ethiopia's Starbucks,' Kaldi's offers a modern café experience with great coffee, pastries, and comfortable seating for work or catching up with friends.",
      address: 'Bole Road, Addis Ababa',
      lat: 9.0100, lng: 38.7850,
      image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80',
      price: '$$',
    },
    {
      name: 'Garden of Coffee',
      category: 'Cafés',
      description:
        'A peaceful outdoor café tucked into a garden setting, offering a calm escape from the city with excellent Ethiopian coffee and light snacks.',
      address: 'Old Airport Area, Addis Ababa',
      lat: 8.9850, lng: 38.7650,
      image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&q=80',
      price: '$',
    },
    // Hotels
    {
      name: 'Ethiopian Skylight Hotel',
      category: 'Hotels',
      description:
        'A modern 5-star hotel located near Bole International Airport, popular with business travelers for its spacious rooms, conference facilities, and rooftop views.',
      address: 'Near Bole International Airport, Addis Ababa',
      lat: 8.9779, lng: 38.7996,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
      price: '$$$',
    },
    {
      name: 'Hyatt Regency Addis Ababa',
      category: 'Hotels',
      description:
        'A luxury international hotel chain offering premium accommodation, multiple restaurants, a spa, and event spaces in the heart of the city.',
      address: 'Meskel Square, Addis Ababa',
      lat: 9.0107, lng: 38.7613,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
      price: '$$$',
    },
    {
      name: 'Golden Tulip Addis Ababa',
      category: 'Hotels',
      description:
        'A comfortable mid-to-upscale hotel offering great value, friendly service, and a convenient location for both business and leisure travelers.',
      address: 'Bole Road, Addis Ababa',
      lat: 9.0040, lng: 38.7870,
      image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80',
      price: '$$',
    },
    // Shopping
    {
      name: 'Edna Mall',
      category: 'Shopping',
      description:
        'One of the most popular shopping destinations in Addis Ababa, featuring a cinema, clothing stores, electronics shops, and a food court.',
      address: 'Bole Road, Addis Ababa',
      lat: 9.0075, lng: 38.7825,
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
      price: '$$',
    },
    {
      name: 'Friendship Business Center',
      category: 'Shopping',
      description:
        'A well-known shopping center offering a wide variety of retail stores, fashion boutiques, and dining options in a modern setting.',
      address: 'Bole Road, Addis Ababa',
      lat: 9.0022, lng: 38.7810,
      image: 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=800&q=80',
      price: '$$',
    },
    // Healthcare
    {
      name: "St. Paul's Hospital Millennium Medical College",
      category: 'Healthcare',
      description:
        'A leading public hospital and medical college providing a wide range of specialized medical services and training future healthcare professionals.',
      address: 'Gulele, Addis Ababa',
      lat: 9.0500, lng: 38.7350,
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80',
      price: '$$',
    },
    {
      name: 'Myungsung Christian Medical Center',
      category: 'Healthcare',
      description:
        'A modern private hospital known for high-quality care, advanced medical equipment, and a wide range of specialist services.',
      address: 'Akaki Kaliti, Addis Ababa',
      lat: 8.8950, lng: 38.7950,
      image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&q=80',
      price: '$$$',
    },
    // Beauty
    {
      name: 'Sabegn Hair & Beauty Salon',
      category: 'Beauty',
      description:
        'A full-service hair salon offering cuts, color, and styling for all hair types, with a friendly team that stays current on the latest trends.',
      address: 'Bole Road, Addis Ababa',
      lat: 9.0090, lng: 38.7860,
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80',
      price: '$$',
    },
    {
      name: 'Habesha Braids Studio',
      category: 'Beauty',
      description:
        'Specialists in traditional and modern braiding styles, from classic Habesha hairstyles to box braids and twists, in a relaxed studio setting.',
      address: 'CMC Road, Addis Ababa',
      lat: 9.0200, lng: 38.8100,
      image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=800&q=80',
      price: '$$',
    },
    {
      name: 'Glow Nail Bar',
      category: 'Beauty',
      description:
        'A bright, modern nail bar offering manicures, pedicures, and nail art with a strong focus on hygiene and attentive service.',
      address: 'Bole Road, Addis Ababa',
      lat: 9.0060, lng: 38.7840,
      image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=80',
      price: '$$',
    },
    {
      name: 'Serenity Wellness Spa',
      category: 'Beauty',
      description:
        'A calm, upscale spa offering massages, facials, and body treatments — a popular spot to unwind after a busy week in the city.',
      address: 'Old Airport Area, Addis Ababa',
      lat: 8.9870, lng: 38.7680,
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80',
      price: '$$$',
    },
    // More (real estate, banks, malls, and other services)
    {
      name: 'Century Mall',
      category: 'More',
      description:
        'A modern shopping mall on CMC Road with a wide mix of retail stores, a supermarket, and a food court, popular with families on weekends.',
      address: 'CMC Road, Addis Ababa',
      lat: 9.0230, lng: 38.8120,
      image: 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=800&q=80',
      price: '$$',
    },
    {
      name: 'Noah Real Estate',
      category: 'More',
      description:
        'A real estate agency helping clients buy, sell, and rent residential and commercial property across Addis Ababa, known for transparent dealings.',
      address: 'Bole Road, Addis Ababa',
      lat: 9.0050, lng: 38.7880,
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80',
      price: '$$',
    },
    {
      name: 'Commercial Bank of Ethiopia — Bole Branch',
      category: 'More',
      description:
        "Ethiopia's largest bank, offering personal and business banking services including savings accounts, loans, and foreign currency exchange.",
      address: 'Bole Road, Addis Ababa',
      lat: 9.0110, lng: 38.7900,
      image: 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=800&q=80',
      price: '$',
    },
    {
      name: 'Wegagen Bank — Kazanchis Branch',
      category: 'More',
      description:
        'A private commercial bank offering retail banking, credit services, and mobile banking to individuals and small businesses.',
      address: 'Kazanchis, Addis Ababa',
      lat: 9.0170, lng: 38.7650,
      image: 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=800&q=80',
      price: '$',
    },
  ];

  const insertBusiness = db.prepare(`
    INSERT INTO businesses (name, category_id, description, address, city, latitude, longitude, image_url, price_range)
    VALUES (@name, @category_id, @description, @address, 'Addis Ababa', @lat, @lng, @image, @price)
  `);

  const businessIds = {};
  for (const b of businesses) {
    const info = insertBusiness.run({
      name: b.name,
      category_id: categoryIds[b.category],
      description: b.description,
      address: b.address,
      lat: b.lat,
      lng: b.lng,
      image: b.image,
      price: b.price,
    });
    businessIds[b.name] = info.lastInsertRowid;
  }

  // ---------------------------------------------------------------
  // Reviews (each one tied to a seeded user account via user_id)
  // ---------------------------------------------------------------
  const insertReview = db.prepare(`
    INSERT INTO reviews (business_id, user_id, author_name, rating, comment, created_at)
    VALUES (?, ?, ?, ?, ?, datetime('now', ?))
  `);

  const reviewsData = {
    'Sishu': [
      ['Hana Getachew', 5, 'The tibs here are the best in Bole. Great service and cozy atmosphere.', '-10 days'],
      ['Dawit Alemu', 4, 'Solid Ethiopian food, gets busy on weekends but worth the wait.', '-6 days'],
      ['Selam Tesfaye', 5, 'My go-to place for lunch with colleagues. Never disappoints.', '-2 days'],
    ],
    'Pizza Corner': [
      ['Nardos Fikru', 4, 'Loved the wood-fired crust. Great spot for a casual dinner.', '-15 days'],
      ['Yonas Bekele', 3, 'Good pizza but a bit pricey for the portion size.', '-4 days'],
    ],
    'Yod Abyssinia': [
      ['Liya Solomon', 5, 'Amazing cultural show plus delicious food. Took my visiting family here and they loved it.', '-20 days'],
      ['Abel Girma', 5, 'A must for tourists. The dancing performance was incredible.', '-9 days'],
      ['Meron Tadesse', 4, 'Great experience overall, slightly slow service during peak hours.', '-1 days'],
    ],
    '2000 Habesha': [
      ['Kalkidan Worku', 5, 'Best cultural restaurant in the city. The decor alone is worth the visit.', '-18 days'],
      ['Biniam Assefa', 4, 'Fantastic atmosphere and food, a bit expensive but worth it for special occasions.', '-3 days'],
    ],
    'Tomoca Coffee': [
      ['Ruth Mekonnen', 5, 'The original and still the best. This is what Ethiopian coffee should taste like.', '-25 days'],
      ['Samuel Tesema', 5, 'A historic spot, always packed but the coffee is worth the standing room only crowd.', '-7 days'],
      ['Tigist Haile', 4, 'Great coffee, small space so it can get crowded fast.', '-2 days'],
    ],
    "Kaldi's Coffee": [
      ['Elias Yohannes', 4, 'Good spot to work from with reliable wifi and comfortable seating.', '-12 days'],
      ['Sara Mulu', 4, 'Consistent quality across branches, my favorite for a quick latte.', '-5 days'],
    ],
    'Garden of Coffee': [
      ['Betelhem Ashenafi', 5, 'Such a peaceful place to relax outdoors with great coffee.', '-14 days'],
      ['Henok Wondimu', 4, 'Lovely garden setting, a nice break from the busy city.', '-3 days'],
    ],
    'Ethiopian Skylight Hotel': [
      ['Mahlet Tsegaye', 5, 'Excellent service and very close to the airport, perfect for layovers.', '-30 days'],
      ['Robel Kebede', 4, 'Modern rooms and great rooftop view, breakfast could be more varied.', '-8 days'],
    ],
    'Hyatt Regency Addis Ababa': [
      ['Frehiwot Alene', 5, 'Top-notch luxury hotel with impeccable service. Highly recommend for business trips.', '-22 days'],
      ['Yared Mengistu', 5, 'The spa and restaurants are excellent. Great central location too.', '-6 days'],
    ],
    'Golden Tulip Addis Ababa': [
      ['Hilina Getu', 4, 'Comfortable stay with friendly staff, good value for the price.', '-11 days'],
      ['Amanuel Zerihun', 3, 'Decent hotel but rooms could use a refresh.', '-4 days'],
    ],
    'Edna Mall': [
      ['Sosina Tefera', 4, 'Great variety of shops and the cinema is a nice bonus.', '-16 days'],
      ['Natnael Girma', 4, 'Good food court options and easy parking.', '-5 days'],
    ],
    'Friendship Business Center': [
      ['Hiwot Alemayehu', 4, 'Nice mix of boutiques, good place for gifts shopping.', '-13 days'],
      ['Dagim Solomon', 3, 'Decent selection but can get crowded on weekends.', '-2 days'],
    ],
    "St. Paul's Hospital Millennium Medical College": [
      ['Meskerem Bogale', 5, 'Excellent doctors and staff, very professional care during my visit.', '-19 days'],
      ['Tewodros Alemu', 4, 'Good service though wait times can be long due to high patient volume.', '-7 days'],
    ],
    'Myungsung Christian Medical Center': [
      ['Rahel Desta', 5, 'Very clean facility with modern equipment and attentive staff.', '-21 days'],
      ['Bereket Fikadu', 4, 'Great specialist care, slightly higher cost but worth the quality.', '-9 days'],
    ],
    'Sabegn Hair & Beauty Salon': [
      ['Eden Mamo', 5, 'Left with exactly the cut I asked for. Booking again next month.', '-8 days'],
      ['Feven Assefa', 4, 'Great color work, a little slow on a Saturday afternoon.', '-2 days'],
    ],
    'Habesha Braids Studio': [
      ['Yohannes Tadesse', 5, 'Booked this for my sister — beautiful, neat braids and very patient stylists.', '-12 days'],
      ['Bethlehem Girma', 5, 'My braids lasted over a month and still looked great. Highly recommend.', '-4 days'],
    ],
    'Glow Nail Bar': [
      ['Kidus Alemayehu', 4, 'Clean space, good attention to detail on nail art.', '-6 days'],
      ['Mekdes Haile', 5, 'Best gel manicure I have had in Addis. Will be back.', '-1 days'],
    ],
    'Serenity Wellness Spa': [
      ['Fitsum Bekele', 5, 'Exactly what I needed after a stressful week. The massage was excellent.', '-9 days'],
      ['Lidya Worku', 4, 'Lovely, calm atmosphere. Slightly pricey but worth it for a treat.', '-3 days'],
    ],
    'Century Mall': [
      ['Getu Mengesha', 4, 'Good variety of stores and an easy place to grab groceries and a coffee in one trip.', '-7 days'],
    ],
    'Noah Real Estate': [
      ['Demo User', 5, 'Helped me find an apartment in under two weeks. Communicated clearly the whole way.', '-5 days'],
    ],
    'Commercial Bank of Ethiopia — Bole Branch': [
      ['Demo User', 3, 'Reliable but lines can be long during lunch hours. Mobile banking helps a lot.', '-10 days'],
    ],
    'Wegagen Bank — Kazanchis Branch': [
      ['Demo User', 4, 'Friendly staff and quick account setup.', '-2 days'],
    ],
  };

  // "Demo User" isn't in the reviewerNames list above, so add it to the lookup map
  const demoUser = db.prepare('SELECT id FROM users WHERE email = ?').get('demo@adisreview.com');
  userIds['Demo User'] = demoUser.id;

  let reviewCount = 0;
  for (const [businessName, reviews] of Object.entries(reviewsData)) {
    const businessId = businessIds[businessName];
    for (const [author, rating, comment, offset] of reviews) {
      insertReview.run(businessId, userIds[author], author, rating, comment, offset);
      reviewCount += 1;
    }
  }

  console.log('✅ Database seeded successfully!');
  console.log(`   - ${reviewerNames.length + 1} users (shared password: ${DEMO_PASSWORD})`);
  console.log(`   - ${categories.length} categories`);
  console.log(`   - ${businesses.length} businesses`);
  console.log(`   - ${reviewCount} reviews`);
  console.log(`   - Demo login: demo@adisreview.com / ${DEMO_PASSWORD}`);
}

module.exports = seed;

// Allow running directly via `node database/seed.js` or `npm run seed`
if (require.main === module) {
  try {
    seed();
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}
