import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Link, useNavigate } from 'react-router-dom';
import MovieCard from './MovieCard';

// [FIX-FE-04] Khai báo parseMovieCards dùng regex LOCAL (không dùng biến ngoài)
// Regex với flag /g bên ngoài hàm sẽ giữ lastIndex giữa các lần gọi → bỏ sót card
const ChatMessage = ({ role, content, timestamp }) => {
    const navigate = useNavigate();

    // Parse movie cards
    const parseMovieCards = (text) => {
        const cards = [];
        let cleanText = text;

        // [FIX-FE-04] Regex linh hoạt hơn để bắt được cả khi thiếu xuống dòng ở cuối
        const regex = /```moviecard\s*([\s\S]*?)```/g;
        let match;

        while ((match = regex.exec(text)) !== null) {
            try {
                const rawContent = match[1].trim();
                
                // Trích xuất phần JSON nằm giữa { và } (phòng trường hợp AI bịa thêm chữ ở ngoài)
                const startIdx = rawContent.indexOf('{');
                const endIdx = rawContent.lastIndexOf('}');
                
                if (startIdx !== -1 && endIdx !== -1) {
                    const jsonStr = rawContent.substring(startIdx, endIdx + 1);
                    const movieData = JSON.parse(jsonStr);
                    
                    if (movieData.id && movieData.title) {
                        cards.push(movieData);
                    }
                }
            } catch (e) {
                // Chỉ log khi thực sự có gì đó sai (không dùng console.warn bừa bãi)
                console.error('⚠️ Moviecard JSON extraction failed:', e.message);
            }
        }

        // Xóa blocks đã parse
        cleanText = text.replace(/```moviecard\s*[\s\S]*?```/g, '').trim();

        return { cards, cleanText };
    };

    const { cards, cleanText: textAfterCards } = parseMovieCards(content || '');

    // Phát hiện và xử lý các nút bấm CTA (Call To Action) - Ví dụ: [CTA:Mua VIP|/vip]
    const ctaRegex = /\[CTA:([^|\]]+)\|([^\]]+)\]/g;
    const ctaButtons = [];
    let matchCTA;
    while ((matchCTA = ctaRegex.exec(textAfterCards)) !== null) {
        ctaButtons.push({ label: matchCTA[1], path: matchCTA[2] });
    }

    // Làm sạch text khỏi các flag
    const hasLoginFlag = textAfterCards.includes('[NEED_LOGIN]');
    const cleanText = textAfterCards
        .replace(/\[CTA:[^\]]+\]/g, '')
        .replace('[NEED_LOGIN]', '')
        .trim();

    // [FIX-IMP-03] Hiển thị thời gian từ prop timestamp thay vì Date.now()
    // Fallback về thời gian hiện tại nếu không có timestamp
    const displayTime = (() => {
        if (!timestamp) return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const d = timestamp instanceof Date ? timestamp : new Date(timestamp);
        return isNaN(d.getTime())
            ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    })();

    // Custom link renderer
    const customRenderers = {
        a: ({ href, children }) => {
            if (href && href.startsWith('/')) {
                return (
                    <span
                        className="chat-link"
                        onClick={() => navigate(href)}
                        style={{
                            color: '#818cf8',
                            textDecoration: 'underline',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}
                    >
                        {children}
                    </span>
                );
            }
            return <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>;
        }
    };

    return (
        <div className={`message ${role}`}>
            <div className="message-content">
                <ReactMarkdown components={customRenderers}>{cleanText}</ReactMarkdown>

                {cards.length > 0 && (
                    <div className="movie-cards-container">
                        {cards.map((movie, idx) => (
                            <MovieCard key={idx} {...movie} />
                        ))}
                    </div>
                )}

                {ctaButtons.length > 0 && role === 'assistant' && (
                    <div className="login-prompt-area" style={{ marginTop: '10px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {ctaButtons.map((btn, i) => (
                            <Link key={i} to={btn.path} className="login-prompt-btn">
                                ⚡ {btn.label}
                            </Link>
                        ))}
                    </div>
                )}

                {hasLoginFlag && role === 'assistant' && (
                    <div className="login-prompt-area">
                        <Link to="/login" className="login-prompt-btn">
                            🔑 Đăng nhập ngay
                        </Link>
                    </div>
                )}
            </div>
            {/* [FIX-IMP-03] Dùng displayTime tính từ prop timestamp */}
            <div className="message-time">
                {displayTime}
            </div>
        </div>
    );
};

export default ChatMessage;