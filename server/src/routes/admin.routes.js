const { Router } = require('express');
const { authMiddleware } = require('../middleware/auth');
const { attachProfile } = require('../middleware/attachProfile');
const { roleGuard } = require('../middleware/roleGuard');
const { validate } = require('../middleware/validate');
const { assignDonationSchema, updateMessageStatusSchema } = require('../schemas/admin.schema');
const adminController = require('../controllers/admin.controller');

const router = Router();

router.use(authMiddleware);
router.use(attachProfile);
router.use(roleGuard('admin'));

router.get('/donations/:status', adminController.getDonationsByStatus);
router.patch('/donations/:id/approve', adminController.approveDonation);
router.patch('/donations/:id/reject', adminController.rejectDonation);
router.patch('/donations/:id/assign', validate(assignDonationSchema), adminController.assignDonation);
router.get('/orders', adminController.getAllOrders);
router.get('/messages', adminController.getContactMessages);
router.patch('/messages/:id', validate(updateMessageStatusSchema), adminController.updateMessageStatus);

module.exports = router;
