const { Query } = require('node-appwrite');
const { BaseRepository } = require('./base.repository');

class UserRepository extends BaseRepository {
  constructor() {
    super('users');
  }

  async getByUserId(userId) {
    const result = await this.list([Query.equal('userId', userId)], 1);
    return result.documents[0] || null;
  }
}

module.exports = { UserRepository, userRepository: new UserRepository() };
