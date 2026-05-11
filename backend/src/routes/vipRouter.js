const express = require('express');
const router = express.Router();
const vipController = require('../controllers/vipController');
const { verifyToken } = require('../middlewares/usersMiddleware');
const paymentSessions = require('../utils/paymentSessions');
const db = require('../db'); // ← thêm dòng này

router.get('/', vipController.getVipPackages);
router.get('/history', verifyToken, vipController.getVipHistory);
router.post('/upgrade', verifyToken, vipController.upgradeVip);
router.post('/cancel', verifyToken, vipController.cancelVip);

// Payment session management
router.post('/session', verifyToken, async (req, res) => {
    const { randomCode, amount } = req.body;
    if (!randomCode || randomCode.length !== 4) {
        return res.status(400).json({ success: false, message: 'Invalid randomCode' });
    }
    if (req.user.is_vip) {
        return res.status(403).json({ success: false, message: 'User already has VIP' });
    }

    try {
        // Lấy username từ DB theo id
        const [rows] = await db.promise().query('SELECT username FROM users WHERE id = ?', [req.user.id]);
        const username = rows[0]?.username || `User#${req.user.id}`;

        paymentSessions.cleanOldSessions();
        const session = paymentSessions.createSession(
            req.user.id,
            username,
            randomCode.toUpperCase(),
            amount
        );
        res.json({ success: true, session });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.get('/session/:code', verifyToken, (req, res) => {
    const code = req.params.code.toUpperCase();
    const session = paymentSessions.getSession(code);
    if (!session) return res.json({ success: false, status: 'not_found' });
    res.json({ success: true, status: session.status, session });
});

module.exports = router;