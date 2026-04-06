const db = require('../db');

exports.sepayWebhook = async (req, res) => {
    try {
        const payload = req.body;
        // payload from SePay contains:
        // { id, gateway, transactionDate, accountNumber, content, transferType, transferAmount, ... }

        console.log('--- SEPAY WEBHOOK RECEIVED ---');
        console.log(JSON.stringify(payload, null, 2));

        // We only care about incoming transfers
        if (payload.transferType !== 'in') {
             return res.json({ success: true, message: "Ignored, not an incoming transaction." });
        }

        const content = payload.content ? payload.content.toUpperCase() : '';
        const amount = parseInt(payload.transferAmount, 10) || 0;

        // Pattern matching: CINEMA VIP <USER_ID>
        const match = content.match(/CINEMA\s*VIP\s*(\d+)/);
        if (!match) {
            return res.json({ success: true, message: "Transaction content does not match VIP syntax." });
        }

        const userId = parseInt(match[1], 10);

        // Perform VIP Upgrade Logic
        
        // 1. Get default VIP package to check price
        const [vipPackages] = await db.promise().query('SELECT id, title, price FROM vip LIMIT 1');
        if (vipPackages.length === 0) {
            return res.json({ success: false, message: 'VIP config not found in DB.' });
        }
        const vip = vipPackages[0];

        // 2. Compute expire date (30 days from now)
        const expireDate = new Date();
        expireDate.setDate(expireDate.getDate() + 30);

        // 3. Update users table: Set is_vip = 1 and role_id = 2 if they are currently just regular user (role 3)
        // First check if user exists
        const [userCheck] = await db.promise().query('SELECT id, username FROM users WHERE id = ?', [userId]);
        if (userCheck.length === 0) {
            return res.json({ success: false, message: "User not found." });
        }

        await db.promise().query(
            'UPDATE users SET is_vip = 1, vip_expired_at = ?, role_id = CASE WHEN role_id = 1 THEN 1 ELSE 2 END WHERE id = ?',
            [expireDate, userId]
        );

        // 4. Save to vip_history
        const startDate = new Date();
        await db.promise().query(
            'INSERT INTO vip_history (user_id, vip_id, price_paid, start_date, end_date) VALUES (?, ?, ?, ?, ?)',
            [userId, vip.id, amount.toLocaleString('vi-VN') + 'đ', startDate, expireDate]
        );

        // 5. Add Notification for User
        const notifTitle = 'Thanh toán tự động thành công';
        const notifMessage = `Hệ thống đã ghi nhận khoản thanh toán ${amount.toLocaleString('vi-VN')}đ. Gói VIP của bạn đã được lập tức kích hoạt, hạn sử dụng đến ${expireDate.toLocaleDateString('vi-VN')}.`;
        await db.promise().query(
            'INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)',
            [userId, notifTitle, notifMessage, 'billing']
        );

        // 6. Notify Admin
        const { sendToAdmins } = require("../utils/notificationUtils");
        const username = userCheck[0].username;
        sendToAdmins('SePay Auto-Pay', `${username} vừa chuyển khoản tự động và mua thành công gói VIP Cinema+.`, 'billing');

        return res.json({ success: true, message: "User upgraded to VIP successfully via SePay." });
    } catch (err) {
        console.error('SePay Webhook Error:', err);
        return res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
    }
};
