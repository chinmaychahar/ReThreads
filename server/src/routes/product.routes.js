const { Router } = require('express');
const productController = require('../controllers/product.controller');

const router = Router();

router.get('/', productController.getAll);
router.get('/featured', productController.getFeatured);
router.get('/category/:category', productController.getByCategory);
router.get('/:id', productController.getById);

module.exports = router;
