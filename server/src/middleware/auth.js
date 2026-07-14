const { Client, Account } = require('node-appwrite');
const { env } = require('../config/env');
const { AppError } = require('../utils/errors');

async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(401, 'Authentication required');
    }

    const jwt = authHeader.split(' ')[1];

    const client = new Client()
      .setEndpoint(env.APPWRITE_ENDPOINT)
      .setProject(env.APPWRITE_PROJECT_ID)
      .setJWT(jwt);

    const acc = new Account(client);
    const user = await acc.get();

    req.user = user;
    next();
  } catch (err) {
    if (err instanceof AppError) return next(err);
    next(new AppError(401, 'Invalid or expired token'));
  }
}

module.exports = { authMiddleware };
