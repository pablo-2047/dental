import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

export const WhatsAppButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Array<{ id: string; sender: 'clinic' | 'user'; text: string; time: string }>>([
    {
      id: 'wa-1',
      sender: 'clinic',
      text: "Hello! Thank you for visiting DentalCare. I'm Priya from our reception desk. How can I help you today? 🦷✨",
      time: '11:42 PM'
    }
  ]);
  const [hasSent, setHasSent] = useState(false);

  const handleSendWAMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || hasSent) return;

    const userText = inputText;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Add user message
    const userMsg = {
      id: `wa-user-${Date.now()}`,
      sender: 'user' as const,
      text: userText,
      time: now
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setHasSent(true);

    // Trigger clinic auto-reply after 1 second
    setTimeout(() => {
      const systemReply = {
        id: `wa-system-${Date.now()}`,
        sender: 'clinic' as const,
        text: "Thank you! A representative will connect with you shortly on your WhatsApp number to answer your questions. 📞💚",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, systemReply]);
    }, 1200);
  };

  return (
    <>
      {/* WhatsApp Floating Bubble */}
      <div className="whatsapp-bubble" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={26} /> : <MessageCircle size={26} fill="#ffffff" />}
      </div>

      {/* WhatsApp Window */}
      {isOpen && (
        <div className="whatsapp-chat animate-slide-up">
          {/* Header */}
          <div className="whatsapp-header">
            <div style={{ position: 'relative' }}>
              <div 
                style={{ 
                  width: '38px', 
                  height: '38px', 
                  borderRadius: '50%', 
                  background: '#128c7e', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}
              >
                P
              </div>
              <div 
                style={{ 
                  width: '10px', 
                  height: '10px', 
                  borderRadius: '50%', 
                  background: '#4ade80', 
                  position: 'absolute', 
                  bottom: '0', 
                  right: '0', 
                  border: '1.5px solid #075e54' 
                }} 
              />
            </div>
            <div>
              <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: 600 }}>Priya (Reception Desk)</h4>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '10px' }}>Online</p>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', marginLeft: 'auto' }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <div className="whatsapp-body">
            {messages.map(msg => (
              <div 
                key={msg.id} 
                className="wa-msg"
                style={{
                  alignSelf: msg.sender === 'clinic' ? 'flex-start' : 'flex-end',
                  background: msg.sender === 'clinic' ? '#ffffff' : '#dcf8c6',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  maxWidth: '85%',
                  boxShadow: '0 1px 1px rgba(0,0,0,0.1)',
                  position: 'relative'
                }}
              >
                <p style={{ fontSize: '12.5px', color: '#303030' }}>{msg.text}</p>
                <span 
                  style={{ 
                    fontSize: '9px', 
                    color: '#808080', 
                    display: 'block', 
                    textAlign: 'right', 
                    marginTop: '4px' 
                  }}
                >
                  {msg.time}
                </span>
              </div>
            ))}
          </div>

          {/* Form */}
          <form className="wa-input-row" onSubmit={handleSendWAMessage}>
            <input
              type="text"
              placeholder="Type your WhatsApp message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={hasSent}
              style={{
                flex: 1,
                border: 'none',
                borderRadius: '20px',
                padding: '6px 12px',
                fontSize: '12px',
                outline: 'none',
                background: '#ffffff'
              }}
            />
            <button type="submit" className="wa-send-btn">
              <Send size={14} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
