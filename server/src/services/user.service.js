const { userRepository } = require('../repositories/user.repository');
const { AppError } = require('../utils/errors');

async function createProfile(userId, data) {
  const existing = await userRepository.getByUserId(userId);
  if (existing) {
    throw new AppError(409, 'Profile already exists');
  }
  return userRepository.create({
    userId,
    name: data.name,
    email: data.email || '',
    role: data.role || 'buyer',
    adaptiveNeeds: data.adaptiveNeeds || null,
    preferredSizes: data.preferredSizes || null,
    address: data.address || null,
    city: data.city || null,
    phone: data.phone || null,
  });
}

async function getProfile(userId) {
  const profile = await userRepository.getByUserId(userId);
  if (!profile) {
    throw new AppError(404, 'Profile not found');
  }
  return profile;
}

async function updateProfile(userId, data) {
  const profile = await userRepository.getByUserId(userId);
  if (!profile) {
    throw new AppError(404, 'Profile not found');
  }
  const allowedFields = ['name', 'adaptiveNeeds', 'preferredSizes', 'address', 'city', 'phone'];
  const updates = {};
  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      updates[field] = data[field];
    }
  }
  return userRepository.update(profile.$id, updates);
}

module.exports = { createProfile, getProfile, updateProfile };
