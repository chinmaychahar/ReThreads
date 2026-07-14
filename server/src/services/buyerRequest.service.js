const { buyerRequestRepository } = require('../repositories/buyerRequest.repository');
const { eventBus } = require('../events/eventBus');
const { AppError } = require('../utils/errors');

async function createRequest(userId, data) {
  const request = await buyerRequestRepository.create({
    userId,
    category: data.category,
    adaptiveType: data.adaptiveType || null,
    size: data.size || null,
    medicalCondition: data.medicalCondition || null,
    urgency: data.urgency,
    maxBudget: data.maxBudget || null,
    status: 'open',
    matchedProducts: JSON.stringify([]),
  });

  eventBus.emit('request.created', { requestId: request.$id, request });

  return request;
}

async function getMyRequests(userId) {
  return buyerRequestRepository.getByUserId(userId);
}

async function deleteRequest(userId, requestId) {
  const request = await buyerRequestRepository.getById(requestId);
  if (request.userId !== userId) {
    throw new AppError(403, 'Not authorized');
  }
  await buyerRequestRepository.delete(requestId);
  return { deleted: true };
}

module.exports = { createRequest, getMyRequests, deleteRequest };
