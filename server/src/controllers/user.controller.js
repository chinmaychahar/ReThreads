const userService = require('../services/user.service');

async function createProfile(req, res, next) {
  try {
    const profile = await userService.createProfile(req.user.$id, {
      name: req.body.name || req.user.name,
      email: req.user.email,
      role: req.body.role,
    });
    res.status(201).json(profile);
  } catch (err) {
    next(err);
  }
}

async function getProfile(req, res, next) {
  try {
    const profile = await userService.getProfile(req.user.$id);
    res.json(profile);
  } catch (err) {
    next(err);
  }
}

async function updateProfile(req, res, next) {
  try {
    const profile = await userService.updateProfile(req.user.$id, req.body);
    res.json(profile);
  } catch (err) {
    next(err);
  }
}

module.exports = { createProfile, getProfile, updateProfile };
