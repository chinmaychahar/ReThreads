const { BaseRepository } = require('./base.repository');

class ContactRepository extends BaseRepository {
  constructor() {
    super('contactMessages');
  }
}

module.exports = { ContactRepository, contactRepository: new ContactRepository() };
