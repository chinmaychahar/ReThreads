const { ID, Query } = require('node-appwrite');
const { databases } = require('../config/appwrite');
const { env } = require('../config/env');
const { AppError } = require('../utils/errors');

class BaseRepository {
  constructor(collectionId) {
    this.databaseId = env.APPWRITE_DATABASE_ID;
    this.collectionId = collectionId;
  }

  async create(data) {
    try {
      return await databases.createDocument(
        this.databaseId,
        this.collectionId,
        ID.unique(),
        data
      );
    } catch (err) {
      throw new AppError(500, `Failed to create document: ${err.message}`);
    }
  }

  async getById(id) {
    try {
      return await databases.getDocument(this.databaseId, this.collectionId, id);
    } catch (err) {
      if (err.code === 404) {
        throw new AppError(404, 'Document not found');
      }
      throw new AppError(500, `Failed to get document: ${err.message}`);
    }
  }

  async list(queries = [], limit = 20, offset = 0) {
    try {
      const allQueries = [
        ...queries,
        Query.limit(limit),
        Query.offset(offset),
      ];
      return await databases.listDocuments(this.databaseId, this.collectionId, allQueries);
    } catch (err) {
      throw new AppError(500, `Failed to list documents: ${err.message}`);
    }
  }

  async update(id, data) {
    try {
      return await databases.updateDocument(this.databaseId, this.collectionId, id, data);
    } catch (err) {
      if (err.code === 404) {
        throw new AppError(404, 'Document not found');
      }
      throw new AppError(500, `Failed to update document: ${err.message}`);
    }
  }

  async delete(id) {
    try {
      return await databases.deleteDocument(this.databaseId, this.collectionId, id);
    } catch (err) {
      if (err.code === 404) {
        throw new AppError(404, 'Document not found');
      }
      throw new AppError(500, `Failed to delete document: ${err.message}`);
    }
  }
}

module.exports = { BaseRepository };
