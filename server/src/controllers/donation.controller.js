const donationService = require('../services/donation.service');

async function create(req, res, next) {
  try {
    const donation = await donationService.createDonation(req.user.$id, req.validatedBody);
    res.status(201).json(donation);
  } catch (err) {
    next(err);
  }
}

async function getMyDonations(req, res, next) {
  try {
    const result = await donationService.getDonationsByDonor(req.user.$id);
    res.json({ donations: result.documents, total: result.total });
  } catch (err) {
    next(err);
  }
}

async function getStatus(req, res, next) {
  try {
    const donation = await donationService.getDonationById(req.params.id);
    res.json(donation);
  } catch (err) {
    next(err);
  }
}

async function getByStatus(req, res, next) {
  try {
    const result = await donationService.getDonationsByStatus(req.params.status);
    res.json({ donations: result.documents, total: result.total });
  } catch (err) {
    next(err);
  }
}

module.exports = { create, getMyDonations, getStatus, getByStatus };
