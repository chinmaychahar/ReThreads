const buyerRequestService = require('../services/buyerRequest.service');

async function create(req, res, next) {
  try {
    const request = await buyerRequestService.createRequest(req.user.$id, req.validatedBody);
    res.status(201).json(request);
  } catch (err) {
    next(err);
  }
}

async function getMyRequests(req, res, next) {
  try {
    const result = await buyerRequestService.getMyRequests(req.user.$id);
    res.json({ requests: result.documents, total: result.total });
  } catch (err) {
    next(err);
  }
}

async function deleteRequest(req, res, next) {
  try {
    await buyerRequestService.deleteRequest(req.user.$id, req.params.id);
    res.json({ deleted: true });
  } catch (err) {
    next(err);
  }
}

module.exports = { create, getMyRequests, deleteRequest };
