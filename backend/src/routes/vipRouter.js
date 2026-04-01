const express = require('express');
const router = express.Router();
const vipController = require('../controllers/vipController');
const { verifyToken } = require('../middlewares/usersMiddleware');

router.get('/', vipController.getVipPackages);
router.get('/history', verifyToken, vipController.getVipHistory);
router.post('/upgrade', verifyToken, vipController.upgradeVip);
router.post('/cancel', verifyToken, vipController.cancelVip);

module.exports = router;
