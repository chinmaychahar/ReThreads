const { volunteerRepository } = require('../repositories/volunteer.repository');
const { donationRepository } = require('../repositories/donation.repository');
const { AppError } = require('../utils/errors');

async function registerVolunteer(userId, data) {
  const existing = await volunteerRepository.getByUserId(userId);
  if (existing) throw new AppError(409, 'Volunteer profile already exists');

  return volunteerRepository.create({
    userId,
    name: data.name,
    specializations: JSON.stringify(data.specializations || []),
    capacity: data.capacity || 5,
    activeAssignments: 0,
    completedCount: 0,
    totalAssigned: 0,
    completedCategories: JSON.stringify([]),
    city: data.city || null,
    rating: 5.0,
  });
}

async function getProfile(userId) {
  const profile = await volunteerRepository.getByUserId(userId);
  if (!profile) throw new AppError(404, 'Volunteer profile not found');
  return profile;
}

async function getAssignments(userId) {
  const profile = await volunteerRepository.getByUserId(userId);
  if (!profile) throw new AppError(404, 'Volunteer profile not found');
  return donationRepository.getByVolunteer(profile.userId);
}

async function updateAssignmentStatus(userId, donationId, newStatus) {
  const profile = await volunteerRepository.getByUserId(userId);
  if (!profile) throw new AppError(404, 'Volunteer profile not found');

  const donation = await donationRepository.getById(donationId);
  if (donation.assignedVolunteer !== profile.userId) {
    throw new AppError(403, 'This donation is not assigned to you');
  }

  const allowedTransitions = ['converting', 'converted'];
  if (!allowedTransitions.includes(newStatus)) {
    throw new AppError(400, 'Volunteers can only mark as converting or converted');
  }

  const donationService = require('./donation.service');
  const updated = await donationService.updateStatus(donationId, newStatus, userId);

  if (newStatus === 'converted') {
    const completedCategories = JSON.parse(profile.completedCategories || '[]');
    if (!completedCategories.includes(donation.category)) {
      completedCategories.push(donation.category);
    }
    await volunteerRepository.update(profile.$id, {
      completedCount: (profile.completedCount || 0) + 1,
      activeAssignments: Math.max(0, (profile.activeAssignments || 0) - 1),
      completedCategories: JSON.stringify(completedCategories),
    });
  }

  return updated;
}

module.exports = { registerVolunteer, getProfile, getAssignments, updateAssignmentStatus };
