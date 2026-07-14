const { eventBus } = require('../eventBus');
const { logger } = require('../../utils/logger');

eventBus.on('donation.received', async ({ donationId, donation }) => {
  try {
    const { findBestVolunteer } = require('../../services/assignment.service');
    const donationService = require('../../services/donation.service');
    const { volunteerRepository } = require('../../repositories/volunteer.repository');

    const volunteer = await findBestVolunteer(donation);
    if (volunteer) {
      await donationService.assignVolunteer(donationId, volunteer.userId);
      await volunteerRepository.update(volunteer.$id, {
        activeAssignments: (volunteer.activeAssignments || 0) + 1,
        totalAssigned: (volunteer.totalAssigned || 0) + 1,
      });
      logger.info(`Donation ${donationId} auto-assigned to volunteer ${volunteer.name}`);
    } else {
      logger.info(`Donation ${donationId} needs manual assignment (no qualified volunteer found)`);
    }
  } catch (err) {
    logger.error(`Failed to auto-assign donation ${donationId}: ${err.message}`);
  }
});

eventBus.on('donation.converted', async ({ donationId, donation }) => {
  try {
    const donationService = require('../../services/donation.service');
    await donationService.updateStatus(donationId, 'quality_check', 'system');
    logger.info(`Donation ${donationId} moved to quality_check`);
  } catch (err) {
    logger.error(`Failed to move donation ${donationId} to quality_check: ${err.message}`);
  }
});

eventBus.on('donation.listed', async ({ donationId, donation }) => {
  try {
    const { ID } = require('node-appwrite');
    const { databases } = require('../../config/appwrite');
    const { env } = require('../../config/env');

    // Create a product from the donation
    const createdProduct = await databases.createDocument(env.APPWRITE_DATABASE_ID, 'products', ID.unique(), {
      title: donation.title,
      price: 299, // Base price for donated-converted items
      desc: donation.description,
      img: donation.images || '/assets/images/img6.jpg',
      category: donation.category,
      adaptiveType: 'general',
      condition: donation.itemCondition,
      sizes: JSON.stringify([donation.size || 'M']),
      gender: donation.gender || 'unisex',
      stock: 1,
      featured: false,
      sourceDonationId: donationId,
      convertedBy: donation.assignedVolunteer,
    });

    logger.info(`Product created from donation ${donationId}`);

    // Emit event so matching handler can safely query the product
    eventBus.emit('product.created.from.donation', { product: createdProduct, donationId });
  } catch (err) {
    logger.error(`Failed to create product from donation ${donationId}: ${err.message}`);
  }
});

module.exports = {};
