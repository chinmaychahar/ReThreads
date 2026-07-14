const donationService = require('../services/donation.service');
const { orderRepository } = require('../repositories/order.repository');
const { contactRepository } = require('../repositories/contact.repository');

async function getDonationsByStatus(req, res, next) {
  try {
    const result = await donationService.getDonationsByStatus(req.params.status);
    res.json({ donations: result.documents, total: result.total });
  } catch (err) {
    next(err);
  }
}

async function approveDonation(req, res, next) {
  try {
    const updated = await donationService.updateStatus(req.params.id, 'listed', req.user.$id);
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

async function rejectDonation(req, res, next) {
  try {
    const updated = await donationService.updateStatus(req.params.id, 'rejected', req.user.$id);
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

async function assignDonation(req, res, next) {
  try {
    const updated = await donationService.assignVolunteer(req.params.id, req.validatedBody.volunteerId);
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

async function getAllOrders(req, res, next) {
  try {
    const result = await orderRepository.list([], 50);
    res.json({ orders: result.documents, total: result.total });
  } catch (err) {
    next(err);
  }
}

async function getContactMessages(req, res, next) {
  try {
    const result = await contactRepository.list([], 50);
    res.json({ messages: result.documents, total: result.total });
  } catch (err) {
    next(err);
  }
}

async function updateMessageStatus(req, res, next) {
  try {
    const updated = await contactRepository.update(req.params.id, { status: req.validatedBody.status });
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

module.exports = { getDonationsByStatus, approveDonation, rejectDonation, assignDonation, getAllOrders, getContactMessages, updateMessageStatus };
