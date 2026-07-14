const { Query } = require('node-appwrite');
const { BaseRepository } = require('./base.repository');

class DonationRepository extends BaseRepository {
  constructor() {
    super('donations');
  }

  async getByDonorId(donorId, limit = 20, offset = 0) {
    return this.list([Query.equal('donorId', donorId), Query.orderDesc('$createdAt')], limit, offset);
  }

  async getByStatus(status, limit = 20, offset = 0) {
    return this.list([Query.equal('status', status)], limit, offset);
  }

  async getByVolunteer(volunteerId, limit = 20, offset = 0) {
    return this.list([Query.equal('assignedVolunteer', volunteerId), Query.orderDesc('$createdAt')], limit, offset);
  }

  async getActiveByVolunteer(volunteerId) {
    return this.list([
      Query.equal('assignedVolunteer', volunteerId),
      Query.notEqual('status', 'listed'),
    ], 50);
  }
}

module.exports = { DonationRepository, donationRepository: new DonationRepository() };
