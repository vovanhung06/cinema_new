/**
 * Lưu trữ phiên thanh toán trong bộ nhớ (In-memory payment sessions store)
 * Các phiên sẽ hết hạn sau 5 phút (300 giây)
 */

const sessions = new Map(); // key: mã ngẫu nhiên (4 ký tự), value: đối tượng phiên thanh toán

const SESSION_TTL_MS = 5 * 60 * 1000; // 5 phút (Thời gian sống của phiên)

exports.createSession = (userId, username, randomCode, amount) => {
    const now = Date.now();
    const session = {
        userId,
        username,
        randomCode,
        amount,
        status: 'pending', // Trạng thái: pending (chờ) | completed (hoàn thành) | expired (hết hạn)
        createdAt: new Date(now).toISOString(),
        expiresAt: new Date(now + SESSION_TTL_MS).toISOString(),
        expiresAtMs: now + SESSION_TTL_MS,
    };
    sessions.set(randomCode, session);
    return session;
};

exports.getSession = (randomCode) => {
    const session = sessions.get(randomCode);
    if (!session) return null;

    // Tự động hết hạn (Auto-expire)
    if (Date.now() > session.expiresAtMs && session.status === 'pending') {
        session.status = 'expired';
        sessions.set(randomCode, session);
    }
    return session;
};

exports.completeSession = (randomCode) => {
    const session = sessions.get(randomCode);
    if (session) {
        session.status = 'completed';
        sessions.set(randomCode, session);
    }
    return session;
};

exports.getAllSessions = (page = 1, limit = 20, statusFilter = 'all') => {
    const all = Array.from(sessions.values()).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    
    // Tự động đánh dấu hết hạn và đếm trạng thái (Auto-expire and count statuses)
    const counts = { all: all.length, completed: 0, pending: 0, expired: 0 };
    
    all.forEach(s => {
        if (s.status === 'pending' && Date.now() > s.expiresAtMs) {
            s.status = 'expired';
        }
        if (counts[s.status] !== undefined) {
            counts[s.status]++;
        }
    });

    // Bộ lọc (Filter)
    const filtered = statusFilter === 'all' 
        ? all 
        : all.filter(s => s.status === statusFilter);

    // Phân trang (Paginate)
    const offset = (page - 1) * limit;
    const paginated = filtered.slice(offset, offset + limit);

    return {
        sessions: paginated,
        pagination: {
            total: filtered.length,
            page,
            limit,
            totalPages: Math.ceil(filtered.length / limit)
        },
        counts
    };
};

// Dọn dẹp các phiên quá cũ (>1 giờ) để tránh rò rỉ bộ nhớ (Clean up very old sessions)
exports.cleanOldSessions = () => {
    const ONE_HOUR = 60 * 60 * 1000;
    const now = Date.now();
    for (const [key, session] of sessions.entries()) {
        if (now - new Date(session.createdAt).getTime() > ONE_HOUR) {
            sessions.delete(key);
        }
    }
};
