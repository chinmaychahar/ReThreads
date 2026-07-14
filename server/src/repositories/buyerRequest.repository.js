const { Query } = require('node-appwrite');
const { BaseRepository } = require('./base.repository');

class BuyerRequestRepository extends BaseRepository {
  constructor() {
    super('buyerRequests');
  }

  async getByUserId(userId, limit = 20) {
    return this.list([Query.equal('userId', userId), Query.orderDesc('$createdAt')], limit);
  }

  async getOpen(limit = 50) {
    return this.list([Query.equal('status', 'open')], limit);
  }

  async getOpenByCategory(category, limit = 50) {
    return this.list([Query.equal('status', 'open'), Query.equal('category', category)], limit);
  }
}

module.exports = { BuyerRequestRepository, buyerRequestRepository: new BuyerRequestRepository() };
