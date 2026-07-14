const { volunteerRepository } = require('../repositories/volunteer.repository');
const { logger } = require('../utils/logger');

const CATEGORY_SKILL_MAP = {
  alzheimers: 'magnetic_closure',
  parkinsons: 'velcro',
  cerebral_palsy: 'elastic_waist',
  elderly: 'front_flap',
  general: 'side_zip',
};

const RELATED_SKILLS = {
  magnetic_closure: ['velcro', 'front_flap'],
  velcro: ['magnetic_closure', 'elastic_waist'],
  side_zip: ['open_back', 'front_flap'],
  open_back: ['side_zip', 'front_flap'],
  elastic_waist: ['pull_on', 'velcro'],
  front_flap: ['open_back', 'side_zip'],
  pull_on: ['elastic_waist'],
};

const RELATED_CATEGORIES = {
  alzheimers: ['elderly'],
  elderly: ['alzheimers', 'parkinsons'],
  parkinsons: ['elderly', 'cerebral_palsy'],
  cerebral_palsy: ['parkinsons'],
};

function scoreVolunteer(volunteer, donation) {
  let score = 0;

  // Specialization match (35 pts)
  const requiredSkill = CATEGORY_SKILL_MAP[donation.category] || 'general';
  const specializations = JSON.parse(volunteer.specializations || '[]');

  if (specializations.includes(requiredSkill)) {
    score += 35;
  } else if (specializations.some((s) => RELATED_SKILLS[requiredSkill]?.includes(s))) {
    score += 20;
  }

  // Current capacity (25 pts)
  const loadRatio = (volunteer.activeAssignments || 0) / Math.max(volunteer.capacity, 1);
  if (loadRatio < 0.3) score += 25;
  else if (loadRatio < 0.7) score += 15;
  else score += 5;

  // Track record (20 pts)
  const totalAssigned = volunteer.totalAssigned || 0;
  const completedCount = volunteer.completedCount || 0;
  if (totalAssigned > 0) {
    score += Math.round((completedCount / totalAssigned) * 20);
  } else {
    score += 10; // New volunteer gets benefit of the doubt
  }

  // Category experience (15 pts)
  const completedCategories = JSON.parse(volunteer.completedCategories || '[]');
  if (completedCategories.includes(donation.category)) {
    score += 15;
  } else if (completedCategories.some((c) => RELATED_CATEGORIES[donation.category]?.includes(c))) {
    score += 8;
  }

  // Location proximity (5 pts)
  if (donation.city && volunteer.city && donation.city.toLowerCase() === volunteer.city.toLowerCase()) {
    score += 5;
  }

  return score;
}

async function findBestVolunteer(donation) {
  const result = await volunteerRepository.getAll(50);
  const volunteers = result.documents;

  if (volunteers.length === 0) {
    logger.warn(`No volunteers available for donation ${donation.$id}`);
    return null;
  }

  const scored = volunteers
    .map((v) => ({ volunteer: v, score: scoreVolunteer(v, donation) }))
    .sort((a, b) => b.score - a.score);

  logger.info(`Assignment scores for donation ${donation.$id}: ${scored.map((s) => `${s.volunteer.name}=${s.score}`).join(', ')}`);

  const best = scored[0];
  if (best.score >= 50) {
    return best.volunteer;
  }

  logger.warn(`No volunteer scored >= 50 for donation ${donation.$id}. Best: ${best.volunteer.name} (${best.score})`);
  return null;
}

module.exports = { findBestVolunteer, scoreVolunteer };
