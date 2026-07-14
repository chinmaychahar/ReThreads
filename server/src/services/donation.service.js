const { donationRepository } = require('../repositories/donation.repository');
const { eventBus } = require('../events/eventBus');
const { AppError } = require('../utils/errors');

const VALID_TRANSITIONS = {
  received: ['assigned'],
  assigned: ['converting'],
  converting: ['converted'],
  converted: ['quality_check'],
  quality_check: ['listed', 'rejected'],
  rejected: ['assigned'],
};

function isValidTransition(from, to) {
  return VALID_TRANSITIONS[from]?.includes(to) || false;
}

async function createDonation(donorId, data) {
  const statusHistory = JSON.stringify([
    { status: 'received', timestamp: new Date().toISOString() },
  ]);

  const donation = await donationRepository.create({
    donorId,
    title: data.title,
    description: data.description,
    category: data.category,
    itemCondition: data.itemCondition,
    size: data.size || null,
    gender: data.gender || null,
    city: data.city || null,
    images: data.images || null,
    status: 'received',
    assignedVolunteer: null,
    statusHistory,
  });

  eventBus.emit('donation.received', { donationId: donation.$id, donation });

  return donation;
}

async function updateStatus(donationId, newStatus, userId) {
  const donation = await donationRepository.getById(donationId);

  if (!isValidTransition(donation.status, newStatus)) {
    throw new AppError(400, `Invalid transition: ${donation.status} → ${newStatus}`);
  }

  const history = JSON.parse(donation.statusHistory || '[]');
  history.push({ status: newStatus, timestamp: new Date().toISOString(), by: userId });

  const updates = {
    status: newStatus,
    statusHistory: JSON.stringify(history),
  };

  const updated = await donationRepository.update(donationId, updates);

  if (newStatus === 'converted') {
    eventBus.emit('donation.converted', { donationId, donation: updated });
  }
  if (newStatus === 'listed') {
    eventBus.emit('donation.listed', { donationId, donation: updated });
  }

  return updated;
}

async function assignVolunteer(donationId, volunteerId) {
  const donation = await donationRepository.getById(donationId);

  if (donation.status !== 'received' && donation.status !== 'rejected') {
    throw new AppError(400, 'Can only assign volunteers to received or rejected donations');
  }

  const history = JSON.parse(donation.statusHistory || '[]');
  history.push({ status: 'assigned', timestamp: new Date().toISOString(), volunteerId });

  const updated = await donationRepository.update(donationId, {
    status: 'assigned',
    assignedVolunteer: volunteerId,
    statusHistory: JSON.stringify(history),
  });

  eventBus.emit('volunteer.assigned', { donationId, volunteerId });

  return updated;
}

async function getDonationsByDonor(donorId) {
  return donationRepository.getByDonorId(donorId);
}

async function getDonationById(id) {
  return donationRepository.getById(id);
}

async function getDonationsByStatus(status) {
  return donationRepository.getByStatus(status);
}

module.exports = {
  createDonation,
  updateStatus,
  assignVolunteer,
  getDonationsByDonor,
  getDonationById,
  getDonationsByStatus,
};
