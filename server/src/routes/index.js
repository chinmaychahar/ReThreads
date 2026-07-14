const { Router } = require('express');
const productRoutes = require('./product.routes');
const searchRoutes = require('./search.routes');
const userRoutes = require('./user.routes');
const cartRoutes = require('./cart.routes');
const orderRoutes = require('./order.routes');
const donationRoutes = require('./donation.routes');
const volunteerRoutes = require('./volunteer.routes');
const buyerRequestRoutes = require('./buyerRequest.routes');
const contactRoutes = require('./contact.routes');
const recommendationRoutes = require('./recommendation.routes');
const adminRoutes = require('./admin.routes');

const router = Router();

router.use('/products', productRoutes);
router.use('/search', searchRoutes);
router.use('/users', userRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/donations', donationRoutes);
router.use('/volunteer', volunteerRoutes);
router.use('/buyer-requests', buyerRequestRoutes);
router.use('/contact', contactRoutes);
router.use('/recommendations', recommendationRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
