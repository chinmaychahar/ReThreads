const { Query } = require('node-appwrite');
const { BaseRepository } = require('./base.repository');

class OrderRepository extends BaseRepository {
  constructor() {
    super('orders');
  }

  async getByUserId(userId, limit = 20, offset = 0) {
    return this.list([Query.equal('userId', userId), Query.orderDesc('$createdAt')], limit, offset);
  }

  async getByOrderNumber(orderNumber) {
    const result = await this.list([Query.equal('orderNumber', orderNumber)], 1);
    return result.documents[0] || null;
  }
}

module.exports = { OrderRepository, orderRepository: new OrderRepository() };
