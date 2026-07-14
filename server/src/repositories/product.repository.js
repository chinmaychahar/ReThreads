const { Query } = require('node-appwrite');
const { BaseRepository } = require('./base.repository');

class ProductRepository extends BaseRepository {
  constructor() {
    super('products');
  }

  async getFeatured(limit = 8) {
    return this.list([Query.equal('featured', true)], limit);
  }

  async getByCategory(category, limit = 20, offset = 0) {
    return this.list([Query.equal('category', category)], limit, offset);
  }

  async search({ q, category, adaptiveType, condition, gender, minPrice, maxPrice, size, sort } = {}, limit = 20, offset = 0) {
    const queries = [];

    if (q) queries.push(Query.search('title', q));
    if (category) queries.push(Query.equal('category', category));
    if (adaptiveType) queries.push(Query.equal('adaptiveType', adaptiveType));
    if (condition) queries.push(Query.equal('condition', condition));
    if (gender) queries.push(Query.equal('gender', gender));
    if (minPrice) queries.push(Query.greaterThanEqual('price', parseFloat(minPrice)));
    if (maxPrice) queries.push(Query.lessThanEqual('price', parseFloat(maxPrice)));
    if (size) queries.push(Query.contains('sizes', size));

    if (sort === 'price_asc') queries.push(Query.orderAsc('price'));
    else if (sort === 'price_desc') queries.push(Query.orderDesc('price'));

    return this.list(queries, limit, offset);
  }
}

module.exports = { ProductRepository, productRepository: new ProductRepository() };
