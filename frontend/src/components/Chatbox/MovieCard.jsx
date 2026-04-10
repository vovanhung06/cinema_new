import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MovieCard.css';

// [FIX-IMP-04] Poster fallback dùng data URI SVG thay vì '/placeholder.jpg'
// Tránh lỗi 404 nếu file không tồn tại trong /public
const POSTER_FALLBACK = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='160' viewBox='0 0 120 160'%3E%3Crect width='120' height='160' fill='%231e1e2e'/%3E%3Crect x='10' y='10' width='100' height='140' rx='4' fill='%23252535'/%3E%3Ctext x='60' y='75' font-family='Arial' font-size='28' text-anchor='middle' fill='%236366f1'%3E%F0%9F%8E%AC%3C/text%3E%3Ctext x='60' y='105' font-family='Arial' font-size='9' text-anchor='middle' fill='%23888'%3ENo Poster%3C/text%3E%3C/svg%3E`;

const MovieCard = ({ id, title, poster, rating, year, genre, is_vip }) => {
    const navigate = useNavigate();
    // [FIX-IMP-04] Dùng state để xử lý lỗi poster động
    const [imgSrc, setImgSrc] = useState(poster || POSTER_FALLBACK);

    const handleWatch = () => {
        // ✅ LINK ĐÚNG: /movie/{ID}
        if (id) {
            navigate(`/movie/${id}`);
        }
    };

    return (
        <div className="movie-card-chat" onClick={handleWatch}>
            <div className="movie-card-poster-wrapper">
                <img
                    src={imgSrc}
                    alt={title}
                    className="movie-card-poster"
                    // [FIX-IMP-04] onError fallback về data URI SVG thay vì /placeholder.jpg (tránh vòng lặp lỗi)
                    onError={(e) => {
                        if (e.target.src !== POSTER_FALLBACK) {
                            setImgSrc(POSTER_FALLBACK);
                        }
                    }}
                />
                {is_vip && (
                    <div className="vip-badge-overlay">👑</div>
                )}
            </div>

            <div className="movie-card-info">
                <h4 className="movie-card-title">{title}</h4>
                <div className="movie-card-meta">
                    <span>📅 {year || 'N/A'}</span>
                    <span>⭐ {rating || '0.0'}</span>
                </div>
                <div className="movie-card-genre">{genre}</div>
                <button className="movie-card-btn" onClick={(e) => { e.stopPropagation(); handleWatch(); }}>
                    🎬 Xem ngay
                </button>
            </div>
        </div>
    );
};

export default MovieCard;