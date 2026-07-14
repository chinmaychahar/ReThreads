const { Query } = require('node-appwrite');
const { BaseRepository } = require('./base.repository');

class CartRepository extends BaseRepository {
  constructor() {
    super('carts');
  }

  async getByUserId(userId) {
    const result = await this.list([Query.equal('userId', userId)], 1);
    return result.documents[0] || null;
  }
}

module.exports = { CartRepository, cartRepository: new CartRepository() };
