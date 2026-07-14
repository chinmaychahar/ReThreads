/**
 * Creates all 9 Appwrite collections with attributes and indexes.
 * Run once: node src/scripts/setupCollections.js
 */
require('dotenv').config();
const { databases } = require('../config/appwrite');
const { env } = require('../config/env');

const DB = env.APPWRITE_DATABASE_ID;

const collections = [
  {
    id: 'products',
    name: 'Products',
    attributes: [
      { type: 'string', key: 'title', size: 256, required: true },
      { type: 'float', key: 'price', required: true },
      { type: 'string', key: 'desc', size: 4096, required: true },
      { type: 'string', key: 'img', size: 512, required: true },
      { type: 'string', key: 'category', size: 64, required: true },
      { type: 'string', key: 'adaptiveType', size: 64, required: false },
      { type: 'string', key: 'condition', size: 32, required: false },
      { type: 'string', key: 'sizes', size: 128, required: false },
      { type: 'string', key: 'gender', size: 16, required: false },
      { type: 'integer', key: 'stock', required: false },
      { type: 'boolean', key: 'featured', required: false },
      { type: 'string', key: 'sourceDonationId', size: 64, required: false },
      { type: 'string', key: 'convertedBy', size: 64, required: false },
    ],
    indexes: [
      { key: 'idx_category', type: 'key', attributes: ['category'] },
      { key: 'idx_featured', type: 'key', attributes: ['featured'] },
      { key: 'idx_category_adaptive', type: 'key', attributes: ['category', 'adaptiveType'] },
      { key: 'idx_fulltext_title', type: 'fulltext', attributes: ['title'] },
    ],
  },
  {
    id: 'users',
    name: 'Users',
    attributes: [
      { type: 'string', key: 'userId', size: 64, required: true },
      { type: 'string', key: 'name', size: 128, required: true },
      { type: 'string', key: 'email', size: 256, required: true },
      { type: 'string', key: 'role', size: 32, required: true },
      { type: 'string', key: 'adaptiveNeeds', size: 512, required: false },
      { type: 'string', key: 'preferredSizes', size: 128, required: false },
      { type: 'string', key: 'address', size: 1024, required: false },
      { type: 'string', key: 'city', size: 64, required: false },
      { type: 'string', key: 'phone', size: 20, required: false },
    ],
    indexes: [
      { key: 'idx_userId', type: 'unique', attributes: ['userId'] },
      { key: 'idx_role', type: 'key', attributes: ['role'] },
    ],
  },
  {
    id: 'carts',
    name: 'Carts',
    attributes: [
      { type: 'string', key: 'userId', size: 64, required: true },
      { type: 'string', key: 'items', size: 16384, required: true },
    ],
    indexes: [
      { key: 'idx_cart_userId', type: 'unique', attributes: ['userId'] },
    ],
  },
  {
    id: 'orders',
    name: 'Orders',
    attributes: [
      { type: 'string', key: 'userId', size: 64, required: true },
      { type: 'string', key: 'orderNumber', size: 32, required: true },
      { type: 'string', key: 'items', size: 16384, required: true },
      { type: 'float', key: 'subtotal', required: true },
      { type: 'float', key: 'gst', required: true },
      { type: 'float', key: 'shipping', required: true },
      { type: 'float', key: 'total', required: true },
      { type: 'string', key: 'status', size: 32, required: true },
      { type: 'string', key: 'statusHistory', size: 4096, required: false },
      { type: 'string', key: 'shippingAddress', size: 1024, required: true },
      { type: 'string', key: 'paymentMethod', size: 32, required: true },
    ],
    indexes: [
      { key: 'idx_order_userId', type: 'key', attributes: ['userId'] },
      { key: 'idx_orderNumber', type: 'unique', attributes: ['orderNumber'] },
      { key: 'idx_order_status', type: 'key', attributes: ['status'] },
    ],
  },
  {
    id: 'donations',
    name: 'Donations',
    attributes: [
      { type: 'string', key: 'donorId', size: 64, required: true },
      { type: 'string', key: 'title', size: 256, required: true },
      { type: 'string', key: 'description', size: 2048, required: true },
      { type: 'string', key: 'category', size: 64, required: true },
      { type: 'string', key: 'itemCondition', size: 32, required: true },
      { type: 'string', key: 'images', size: 2048, required: false },
      { type: 'string', key: 'size', size: 16, required: false },
      { type: 'string', key: 'gender', size: 16, required: false },
      { type: 'string', key: 'city', size: 64, required: false },
      { type: 'string', key: 'status', size: 32, required: true },
      { type: 'string', key: 'assignedVolunteer', size: 64, required: false },
      { type: 'string', key: 'statusHistory', size: 4096, required: false },
    ],
    indexes: [
      { key: 'idx_donation_donorId', type: 'key', attributes: ['donorId'] },
      { key: 'idx_donation_status', type: 'key', attributes: ['status'] },
      { key: 'idx_donation_status_cat', type: 'key', attributes: ['status', 'category'] },
    ],
  },
  {
    id: 'volunteers',
    name: 'Volunteers',
    attributes: [
      { type: 'string', key: 'userId', size: 64, required: true },
      { type: 'string', key: 'name', size: 128, required: true },
      { type: 'string', key: 'specializations', size: 512, required: true },
      { type: 'integer', key: 'capacity', required: true },
      { type: 'integer', key: 'activeAssignments', required: false },
      { type: 'integer', key: 'completedCount', required: false },
      { type: 'integer', key: 'totalAssigned', required: false },
      { type: 'string', key: 'completedCategories', size: 512, required: false },
      { type: 'string', key: 'city', size: 64, required: false },
      { type: 'float', key: 'rating', required: false },
    ],
    indexes: [
      { key: 'idx_vol_userId', type: 'unique', attributes: ['userId'] },
    ],
  },
  {
    id: 'buyerRequests',
    name: 'Buyer Requests',
    attributes: [
      { type: 'string', key: 'userId', size: 64, required: true },
      { type: 'string', key: 'category', size: 64, required: true },
      { type: 'string', key: 'adaptiveType', size: 64, required: false },
      { type: 'string', key: 'size', size: 16, required: false },
      { type: 'string', key: 'medicalCondition', size: 64, required: false },
      { type: 'string', key: 'urgency', size: 16, required: true },
      { type: 'float', key: 'maxBudget', required: false },
      { type: 'string', key: 'status', size: 32, required: true },
      { type: 'string', key: 'matchedProducts', size: 2048, required: false },
    ],
    indexes: [
      { key: 'idx_br_userId', type: 'key', attributes: ['userId'] },
      { key: 'idx_br_status', type: 'key', attributes: ['status'] },
      { key: 'idx_br_cat_adaptive', type: 'key', attributes: ['category', 'adaptiveType', 'status'] },
    ],
  },
  {
    id: 'contactMessages',
    name: 'Contact Messages',
    attributes: [
      { type: 'string', key: 'name', size: 128, required: true },
      { type: 'string', key: 'email', size: 256, required: true },
      { type: 'string', key: 'message', size: 4096, required: true },
      { type: 'string', key: 'status', size: 32, required: true },
    ],
    indexes: [
      { key: 'idx_contact_status', type: 'key', attributes: ['status'] },
    ],
  },
  {
    id: 'reviews',
    name: 'Reviews',
    attributes: [
      { type: 'string', key: 'userId', size: 64, required: true },
      { type: 'string', key: 'productId', size: 64, required: true },
      { type: 'integer', key: 'rating', required: true },
      { type: 'string', key: 'title', size: 256, required: false },
      { type: 'string', key: 'body', size: 2048, required: false },
    ],
    indexes: [
      { key: 'idx_review_productId', type: 'key', attributes: ['productId'] },
      { key: 'idx_review_userId', type: 'key', attributes: ['userId'] },
    ],
  },
];

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function createCollection(col) {
  console.log(`Creating collection: ${col.name}...`);
  try {
    await databases.createCollection(DB, col.id, col.name);
  } catch (err) {
    if (err.code === 409) {
      console.log(`  Collection "${col.name}" already exists, skipping creation.`);
    } else {
      throw err;
    }
  }

  for (const attr of col.attributes) {
    try {
      if (attr.type === 'string') {
        await databases.createStringAttribute(DB, col.id, attr.key, attr.size, attr.required, attr.default || undefined);
      } else if (attr.type === 'integer') {
        await databases.createIntegerAttribute(DB, col.id, attr.key, attr.required, undefined, undefined, attr.default || undefined);
      } else if (attr.type === 'float') {
        await databases.createFloatAttribute(DB, col.id, attr.key, attr.required, undefined, undefined, attr.default || undefined);
      } else if (attr.type === 'boolean') {
        await databases.createBooleanAttribute(DB, col.id, attr.key, attr.required, attr.default || undefined);
      }
      console.log(`  + attribute: ${attr.key}`);
    } catch (err) {
      if (err.code === 409) {
        console.log(`  ~ attribute "${attr.key}" already exists`);
      } else {
        console.error(`  ! Failed to create attribute "${attr.key}": ${err.message}`);
      }
    }
    await sleep(1000);
  }

  await sleep(2000);

  for (const idx of col.indexes || []) {
    try {
      await databases.createIndex(DB, col.id, idx.key, idx.type, idx.attributes);
      console.log(`  + index: ${idx.key}`);
    } catch (err) {
      if (err.code === 409) {
        console.log(`  ~ index "${idx.key}" already exists`);
      } else {
        console.error(`  ! Failed to create index "${idx.key}": ${err.message}`);
      }
    }
    await sleep(1000);
  }
}

async function main() {
  console.log(`\nSetting up collections in database: "${DB}"\n`);

  if (!env.APPWRITE_PROJECT_ID || !env.APPWRITE_API_KEY) {
    console.error('ERROR: APPWRITE_PROJECT_ID and APPWRITE_API_KEY must be set in .env');
    console.log('Copy .env.example to .env and fill in your Appwrite credentials.');
    process.exit(1);
  }

  try {
    await databases.get(DB);
    console.log(`Database "${DB}" found.\n`);
  } catch (err) {
    if (err.code === 404) {
      console.log(`Creating database "${DB}"...`);
      await databases.create(DB, DB);
    } else {
      throw err;
    }
  }

  for (const col of collections) {
    await createCollection(col);
    console.log('');
  }

  console.log('All collections set up successfully!');
}

main().catch((err) => {
  console.error('Setup failed:', err.message);
  process.exit(1);
});
