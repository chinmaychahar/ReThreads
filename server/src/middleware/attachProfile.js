const { userRepository } = require('../repositories/user.repository');

async function attachProfile(req, res, next) {
  try {
    if (req.user) {
      const profile = await userRepository.getByUserId(req.user.$id);
      req.userProfile = profile;
    }
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = { attachProfile };
