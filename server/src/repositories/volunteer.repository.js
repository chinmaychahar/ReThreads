const { Query } = require('node-appwrite');
const { BaseRepository } = require('./base.repository');

class VolunteerRepository extends BaseRepository {
  constructor() {
    super('volunteers');
  }

  async getByUserId(userId) {
    const result = await this.list([Query.equal('userId', userId)], 1);
    return result.documents[0] || null;
  }

  async getAll(limit = 50) {
    return this.list([], limit);
  }
}

module.exports = { VolunteerRepository, volunteerRepository: new VolunteerRepository() };
