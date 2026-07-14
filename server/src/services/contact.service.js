const { contactRepository } = require('../repositories/contact.repository');

async function submitMessage(data) {
  return contactRepository.create({
    name: data.name,
    email: data.email,
    message: data.message,
    status: 'unread',
  });
}

module.exports = { submitMessage };
