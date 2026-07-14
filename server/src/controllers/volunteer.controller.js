const volunteerService = require('../services/volunteer.service');

async function register(req, res, next) {
  try {
    const profile = await volunteerService.registerVolunteer(req.user.$id, req.body);
    res.status(201).json(profile);
  } catch (err) {
    next(err);
  }
}

async function getProfile(req, res, next) {
  try {
    const profile = await volunteerService.getProfile(req.user.$id);
    res.json(profile);
  } catch (err) {
    next(err);
  }
}

async function getAssignments(req, res, next) {
  try {
    const result = await volunteerService.getAssignments(req.user.$id);
    res.json({ assignments: result.documents, total: result.total });
  } catch (err) {
    next(err);
  }
}

async function updateAssignment(req, res, next) {
  try {
    const updated = await volunteerService.updateAssignmentStatus(
      req.user.$id,
      req.params.id,
      req.body.status
    );
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

module.exports = { register, getProfile, getAssignments, updateAssignment };
