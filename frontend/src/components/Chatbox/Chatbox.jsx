import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Minus, Trash2, Zap, Film, Crown, Sparkles } from 'lucide-react';
import ChatMessage from './ChatMessage';
import MovieCard from './MovieCard';
import { useAuth } from '../../context/AuthContext';
import API_BASE_URL from '../../config/api';
import './Chatbox.css';

const Chatbox = () => {
    const { token, user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const [quickActions, setQuickActions] = useState([
        { id: 'trending', icon: '🔥', label: 'Phim hot', prompt: 'Cho tôi xem phim đang hot nhất' },
        { id: 'vip', icon: '👑', label: 'Gói VIP', prompt: 'Cho tôi biết về các gói VIP' },
        { id: 'recommend', icon: '🎬', label: 'Gợi ý phim', prompt: 'Gợi ý phim hay để xem' }
    ]);
    const [statusText, setStatusText] = useState('');
    const [showConfirm, setShowConfirm] = useState(false);

    // Scroll to bottom whenever messages change
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isTyping, statusText]);

    // [FIX-IMP-05] Thêm messages.length vào dependency array
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            fetchHistory();
        }
    }, [isOpen, messages.length]);

    const fetchHistory = async () => {
        try {
            const headers = {};
            if (token) headers['Authorization'] = `Bearer ${token}`;

            // [FIX-FE-03] Thêm credentials: 'include' để gửi cookie cho guest user
            const res = await fetch(`${API_BASE_URL}/ai/history`, {
                headers,
                credentials: 'include'
            });
            const data = await res.json();
            if (data.success) {
                setMessages(data.history);
            }
        } catch (err) {
            console.error("Lỗi lấy lịch sử chat:", err);
        }
    };

    const handleSend = async (e, customPrompt = null) => {
        if (e) e.preventDefault();
        const userMessage = customPrompt || input.trim();
        if (!userMessage || loading) return;

        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage, timestamp: new Date() }]);
        setLoading(true);
        setIsTyping(true);
        setStatusText('Đang xử lý...');

        try {
            const headers = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;

            // [FIX-FE-03] Thêm credentials: 'include' để gửi cookie cho guest user
            const response = await fetch(`${API_BASE_URL}/ai/chat`, {
                method: 'POST',
                headers,
                credentials: 'include',
                body: JSON.stringify({ message: userMessage })
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let assistantMessage = '';
            let firstChunkReceived = false;

            // Thêm tin nhắn rỗng của assistant để bắt đầu streaming vào
            setMessages(prev => [...prev, { role: 'assistant', content: '', timestamp: new Date() }]);

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const dataStr = line.slice(6).trim();
                        if (dataStr === '[DONE]') break;
                        
                        try {
                            const data = JSON.parse(dataStr);

                            // 1. Xử lý Trạng thái (Layer 1 Intent)
                            if (data.type === 'status') {
                                setStatusText(data.message);
                                continue;
                            }

                            // 2. Xử lý Lỗi
                            if (data.error) {
                                assistantMessage = `⚠️ ${data.error}`;
                                setIsTyping(false);
                                setStatusText('');
                                setMessages(prev => {
                                    const newMessages = [...prev];
                                    newMessages[newMessages.length - 1] = {
                                        ...newMessages[newMessages.length - 1],
                                        content: assistantMessage
                                    };
                                    return newMessages;
                                });
                                break;
                            }

                            // 3. Xử lý Content (Layer 2 Response)
                            if (data.content) {
                                if (!firstChunkReceived) {
                                    setIsTyping(false);
                                    setStatusText('');
                                    firstChunkReceived = true;
                                }

                                assistantMessage += data.content;
                                setMessages(prev => {
                                    const newMessages = [...prev];
                                    newMessages[newMessages.length - 1] = {
                                        ...newMessages[newMessages.length - 1],
                                        content: assistantMessage
                                    };
                                    return newMessages;
                                });
                            }

                            // 4. Xử lý Kết thúc & Quick Actions
                            if (data.done) {
                                if (data.quickActions) {
                                    setQuickActions(data.quickActions);
                                }
                                setStatusText('');
                                setIsTyping(false);
                            }
                        } catch (e) { }
                    }
                }
            }
        } catch (err) {
            console.error("Lỗi chat:", err);
            setStatusText('');
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Xin lỗi, hệ thống đang bận. Vui lòng thử lại sau.',
                timestamp: new Date()
            }]);
        } finally {
            setLoading(false);
            setIsTyping(false);
            setStatusText('');
        }
    };

    const clearHistory = async () => {
        try {
            const headers = {};
            if (token) headers['Authorization'] = `Bearer ${token}`;

            // [FIX-FE-03] credentials: 'include' cho delete request
            await fetch(`${API_BASE_URL}/ai/history`, {
                method: 'DELETE',
                headers,
                credentials: 'include'
            });
            setMessages([]);
            setShowConfirm(false);
        } catch (err) {
            console.error("Lỗi xóa lịch sử:", err);
        }
    };

    const quickAction = (action) => {
        handleSend(null, action.prompt);
    };

    return (
        <div className="chatbox-container">
            {!isOpen ? (
                <button className="chat-toggle-btn" onClick={() => setIsOpen(true)}>
                    <MessageCircle size={28} />
                </button>
            ) : (
                <div className="chat-window">
                    <div className="chat-header">
                        <div className="bot-info">
                            <div className="bot-avatar">
                                <Sparkles size={20} color="white" />
                            </div>
                            <div>
                                <div className="bot-name">AI Assistant</div>
                                <div className="bot-status"><div className="status-dot"></div> Online</div>
                            </div>
                        </div>
                        <div className="chat-actions">
                            <button className="icon-btn" onClick={() => setShowConfirm(true)} title="Xóa lịch sử">
                                <Trash2 size={16} color="#9ca3af" />
                            </button>
                            <button className="icon-btn" onClick={() => setIsOpen(false)}>
                                <Minus size={18} color="#9ca3af" />
                            </button>
                            <button className="icon-btn" onClick={() => setIsOpen(false)}>
                                <X size={18} color="#9ca3af" />
                            </button>
                        </div>
                    </div>

                    <div className="chat-messages">
                        {messages.length === 0 && (
                            <div className="welcome-msg">
                                <div className="welcome-icon"><Crown size={40} color="#fbbf24" /></div>
                                <h3>Chào bạn {user?.name || 'mới'}!</h3>
                                <p>Tôi là trợ lý ảo sẵn sàng hỗ trợ bạn tìm phim và nâng cấp VIP. Hãy hỏi tôi bất cứ điều gì!</p>
                            </div>
                        )}
                        {messages.map((m, i) => (
                            <ChatMessage key={i} role={m.role} content={m.content} timestamp={m.timestamp} />
                        ))}

                        {statusText && (
                            <div className="chat-status-indicator">
                                <Zap size={14} className="spin-icon" /> {statusText}
                            </div>
                        )}

                        {isTyping && !statusText && (
                            <div className="message assistant typing">
                                <span className="dot"></span>
                                <span className="dot"></span>
                                <span className="dot"></span>
                            </div>
                        )}

                        {showConfirm && (
                            <div className="chat-confirm-overlay">
                                <div className="chat-confirm-card">
                                    <div className="confirm-icon"><Trash2 size={24} color="#f43f5e" /></div>
                                    <p>Bạn có chắc muốn xóa vĩnh viễn toàn bộ lịch sử trò chuyện không?</p>
                                    <div className="confirm-btn-group">
                                        <button className="confirm-back-btn" onClick={() => setShowConfirm(false)}>Hủy</button>
                                        <button className="confirm-clear-btn" onClick={clearHistory}>Xóa sạch</button>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="quick-actions">
                        {quickActions.map(action => (
                            <button 
                                key={action.id} 
                                className="quick-btn" 
                                onClick={() => quickAction(action)}
                            >
                                {action.icon} {action.label}
                            </button>
                        ))}
                    </div>

                    <form className="chat-input-area" onSubmit={handleSend}>
                        <textarea
                            ref={inputRef}
                            className="chat-input"
                            placeholder="Hỏi tôi về phim, VIP..."
                            rows="1"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                        />
                        <button type="submit" className="send-btn" disabled={loading || (!input.trim() && !loading)}>
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Chatbox;
