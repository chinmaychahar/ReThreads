/**
 * Seeds existing hardcoded product data into the Appwrite products collection.
 * Run once after setupCollections.js: node src/scripts/seedProducts.js
 */
require('dotenv').config();
const { ID } = require('node-appwrite');
const { databases } = require('../config/appwrite');
const { env } = require('../config/env');

const DB = env.APPWRITE_DATABASE_ID;
const COLLECTION = 'products';

const TOPFEATURED = [
  { id: 0, title: "Blue Women's Adaptive T-shirt", price: 450, desc: "Easy Dressing: Features discreet adaptive openings for hassle-free dressing and undressing. Convenient Velcro Closure: The t-shirt is equipped with a convenient Velcro closure system, allowing for easy fastening and adjusting.", img: "/assets/images/img6.jpg", adaptiveType: "velcro", gender: "women" },
  { id: 1, title: "Cotton White Adaptive T-shirt", price: 400, desc: "A breathable cotton adaptive t-shirt designed for easy dressing with discreet openings and soft fabric that's gentle on sensitive skin.", img: "/assets/images/img7.jpg", adaptiveType: "open_back", gender: "unisex" },
  { id: 2, title: "White Unisex Adaptive Shirt", price: 550, desc: "Versatile unisex adaptive shirt with side openings for easy dressing. Suitable for individuals with limited arm mobility.", img: "/assets/images/img8.jpg", adaptiveType: "side_zip", gender: "unisex" },
  { id: 3, title: "Adaptive Nursing Suit", price: 500, desc: "Full-body nursing suit with front flap design for easy caregiving access. Designed for individuals requiring assisted dressing.", img: "/assets/images/img9.jpg", adaptiveType: "front_flap", gender: "unisex" },
  { id: 4, title: "Women T-Shirt with front flap", price: 499, desc: "Comfortable women's t-shirt featuring a discreet front flap for easy medical access while maintaining a stylish appearance.", img: "/assets/images/img1.jpeg", adaptiveType: "front_flap", gender: "women" },
  { id: 5, title: "Shirt with Zipper on Shoulder", price: 500, desc: "Adaptive shirt with shoulder zipper design that makes dressing easier for individuals with limited overhead arm movement.", img: "/assets/images/products/netapp_img9.png", adaptiveType: "side_zip", gender: "unisex" },
  { id: 6, title: "Adaptive T-Shirt with front flap", price: 550, desc: "Unisex adaptive t-shirt with a front flap opening, designed for easy access during medical care or assisted dressing.", img: "/assets/images/img11.jpg", adaptiveType: "front_flap", gender: "unisex" },
  { id: 7, title: "Shirt with Magnetic buttons", price: 599, desc: "Elegant shirt with magnetic button closures that snap together effortlessly, ideal for individuals with limited fine motor skills.", img: "/assets/images/img12.jpg", adaptiveType: "magnetic_closure", gender: "unisex" },
];

const SHOPDATA = [
  { id: 0, title: "Women's Black Adaptive T-shirt", price: 450, desc: "Easy Dressing: Features discreet adaptive openings for hassle-free dressing and undressing. Versatile and Fashionable: The vibrant blue color adds a touch of sophistication.", img: "/assets/shop/1.PNG", adaptiveType: "open_back", gender: "women" },
  { id: 1, title: "Side zip cotton pants", price: 500, desc: "Adaptive cotton pants with full-length side zippers for easy dressing. Ideal for wheelchair users or those with limited lower body mobility.", img: "/assets/shop/2.PNG", adaptiveType: "side_zip", gender: "unisex" },
  { id: 2, title: "White Unisex Adaptive Top", price: 499, desc: "Lightweight adaptive top with velcro shoulder closures for easy on-and-off dressing without overhead arm movement.", img: "/assets/shop/3.PNG", adaptiveType: "velcro", gender: "unisex" },
  { id: 3, title: "Side open adaptive pants", price: 500, desc: "Adaptive pants with side openings and magnetic buttons that effortlessly snap into place, eliminating the need for manual buttoning.", img: "/assets/shop/4.PNG", adaptiveType: "magnetic_closure", gender: "unisex" },
  { id: 4, title: "Women adaptive sweater vest", price: 450, desc: "Cozy adaptive sweater vest with front opening and large buttons for easy self-dressing. Warm and fashionable for cooler weather.", img: "/assets/shop/5.PNG", adaptiveType: "velcro", gender: "women" },
  { id: 5, title: "Men's shirt with adaptive open back", price: 499, desc: "Men's shirt with full open-back design for easy dressing while seated. Maintains a professional appearance from the front.", img: "/assets/shop/6.PNG", adaptiveType: "open_back", gender: "men" },
  { id: 6, title: "Adaptive front flap on pants", price: 600, desc: "Adaptive pants with front flap design providing easy access while maintaining dignity and comfort throughout the day.", img: "/assets/shop/7.PNG", adaptiveType: "front_flap", gender: "unisex" },
  { id: 7, title: "Shirt with Magnetic buttons", price: 499, desc: "Shirt with magnetic closures designed to look like regular buttons. Easy to fasten one-handed for individuals with dexterity challenges.", img: "/assets/shop/8.PNG", adaptiveType: "magnetic_closure", gender: "unisex" },
  { id: 8, title: "Women's adaptive skirt", price: 600, desc: "Pull-Over Style with Velcro closures ensuring quick and secure fastening, perfect for individuals with limited hand dexterity or mobility impairments.", img: "/assets/shop/9.PNG", adaptiveType: "velcro", gender: "women" },
  { id: 9, title: "Zipper adaptive pants", price: 499, desc: "Adaptive pants with full-length side zippers for easy dressing and undressing. Suitable for individuals who dress while seated.", img: "/assets/shop/10.PNG", adaptiveType: "side_zip", gender: "unisex" },
  { id: 10, title: "T-Shirt with front buttons", price: 550, desc: "Adaptive t-shirt with large front buttons spaced for easy gripping. Suitable for individuals with arthritis or limited hand strength.", img: "/assets/shop/11.PNG", adaptiveType: "magnetic_closure", gender: "unisex" },
  { id: 11, title: "Shirt with velcro closure", price: 499, desc: "Adaptive shirt with hidden velcro closures that provide the appearance of a button-up while offering easy fastening.", img: "/assets/shop/12.PNG", adaptiveType: "velcro", gender: "unisex" },
];

const ALDATA = [
  { id: 0, title: "Blue Women's Adaptive Gown", price: 350, desc: "Comfortable adaptive gown with rear overlap opening for easy dressing by caregivers. Designed for individuals with Alzheimer's.", img: "/assets/al/1.PNG", adaptiveType: "open_back", gender: "women" },
  { id: 1, title: "Women's open back cotton pant", price: 400, desc: "Soft cotton pants with open-back design allowing easy changes without full undressing. Ideal for those needing caregiver assistance.", img: "/assets/al/2.PNG", adaptiveType: "open_back", gender: "women" },
  { id: 2, title: "Adaptive T-Shirt with front flap", price: 450, desc: "T-shirt with front flap for easy medical access. Designed for Alzheimer's patients who need regular health monitoring.", img: "/assets/al/3.PNG", adaptiveType: "front_flap", gender: "unisex" },
  { id: 3, title: "Men's nursing suit flap", price: 500, desc: "Full nursing suit with strategic flap openings for caregiving. Maintains patient dignity while enabling easy care.", img: "/assets/al/4.PNG", adaptiveType: "front_flap", gender: "men" },
  { id: 4, title: "Pull-on pajama set", price: 300, desc: "Easy pull-on pajama set with elastic waistband and no buttons or zippers. Perfect for individuals who dress independently.", img: "/assets/al/5.PNG", adaptiveType: "elastic_waist", gender: "unisex" },
  { id: 5, title: "Wire-free camisole", price: 499, desc: "Comfortable wire-free camisole with wide straps and pull-on design. No clasps or hooks that could cause confusion.", img: "/assets/al/6.PNG", adaptiveType: "pull_on", gender: "women" },
  { id: 6, title: "Adaptive Men's cardigan with flaps on both arms", price: 350, desc: "Men's cardigan with arm flaps for easy blood pressure checks and IV access without removing the garment.", img: "/assets/al/7.PNG", adaptiveType: "front_flap", gender: "men" },
  { id: 7, title: "Shirt with Magnetic buttons", price: 399, desc: "Magnetic button shirt that looks conventional but snaps together with minimal effort. Reduces frustration during dressing.", img: "/assets/al/8.PNG", adaptiveType: "magnetic_closure", gender: "unisex" },
  { id: 8, title: "Women T-Shirt with front flap", price: 300, desc: "Women's t-shirt with front flap for caregiver access. Soft fabric and tagless design to prevent skin irritation.", img: "/assets/al/9.PNG", adaptiveType: "front_flap", gender: "women" },
  { id: 9, title: "Shirt with Zipper on Shoulder", price: 499, desc: "Adaptive shirt with shoulder zipper enabling overhead-free dressing. Useful for Alzheimer's patients with limited coordination.", img: "/assets/al/10.PNG", adaptiveType: "side_zip", gender: "unisex" },
  { id: 10, title: "Magnetic zip jacket", price: 350, desc: "Jacket with magnetic zipper that connects automatically when brought close together. Makes putting on a jacket independent.", img: "/assets/al/11.PNG", adaptiveType: "magnetic_closure", gender: "unisex" },
  { id: 11, title: "Shirt with Magnetic buttons", price: 399, desc: "Magnetic button shirt providing easy closure for individuals who struggle with traditional buttons due to cognitive or motor challenges.", img: "/assets/al/12.PNG", adaptiveType: "magnetic_closure", gender: "unisex" },
];

function mapProduct(item, source, category, featured) {
  return {
    title: item.title.trim(),
    price: item.price,
    desc: item.desc,
    img: item.img,
    category,
    adaptiveType: item.adaptiveType || 'general',
    condition: 'new',
    sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
    gender: item.gender || 'unisex',
    stock: 10,
    featured,
    sourceDonationId: null,
    convertedBy: null,
  };
}

async function main() {
  if (!env.APPWRITE_PROJECT_ID || !env.APPWRITE_API_KEY) {
    console.error('ERROR: APPWRITE_PROJECT_ID and APPWRITE_API_KEY must be set in .env');
    process.exit(1);
  }

  console.log('Seeding products into Appwrite...\n');

  const allProducts = [
    ...TOPFEATURED.map((item) => mapProduct(item, 'topfeatured', 'general', true)),
    ...SHOPDATA.map((item) => mapProduct(item, 'shopdata', 'general', false)),
    ...ALDATA.map((item) => mapProduct(item, 'aldata', 'alzheimers', false)),
  ];

  let created = 0;
  let failed = 0;

  for (const product of allProducts) {
    try {
      await databases.createDocument(DB, COLLECTION, ID.unique(), product);
      created++;
      console.log(`  + ${product.title}`);
    } catch (err) {
      failed++;
      console.error(`  ! Failed: ${product.title} — ${err.message}`);
    }
  }

  console.log(`\nDone! Created: ${created}, Failed: ${failed}, Total: ${allProducts.length}`);
}

main().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
