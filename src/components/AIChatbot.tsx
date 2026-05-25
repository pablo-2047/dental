import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';


interface AIChatbotProps {
  setViewMode: (mode: 'patient' | 'clinic') => void;
  setPatientTab: (tab: 'home' | 'services' | 'booking' | 'portal') => void;
}

export const AIChatbot: React.FC<AIChatbotProps> = ({ setViewMode, setPatientTab }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Array<{ id: string; sender: 'bot' | 'user'; text: string; options?: string[] }>>([
    {
      id: 'welcome',
      sender: 'bot',
      text: "Hi there! 👋 I am DentalCare's AI assistant. How can I help you today?",
      options: ['📅 Book Appointment', '🦷 Services & Pricing', '🛡️ Insurances Accepted', '❓ Implants painful?']
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMsgId = `user-${Date.now()}`;
    const newMessages = [...messages, { id: userMsgId, sender: 'user' as const, text }];
    setMessages(newMessages);
    setInputText('');

    // Trigger AI response after a short delay
    setTimeout(() => {
      let botResponse = '';
      let options: string[] = [];

      const cleanText = text.toLowerCase();

      if (cleanText.includes('book') || cleanText.includes('appointment') || cleanText.includes('schedule')) {
        botResponse = "I can definitely help you with that! Click the button below to open our live booking wizard, select your preferred doctor, and pick an available date.";
        options = ['Go to Booking Flow ➡️', 'Ask something else'];
      } else if (cleanText.includes('service') || cleanText.includes('price') || cleanText.includes('cost')) {
        botResponse = "We offer a wide range of consultation-first procedures: \n\n• Routine Scaling & Polish (₹1,499)\n• Clinical Laser Whitening (₹5,000-₹12,000)\n• Premium Veneers (₹8,000-₹15,000 per tooth)\n• Advanced Dental Implants (₹35,000)\n\nWhich service would you like to know more about?";
        options = ['🦷 Cleanings', '💎 Teeth Whitening', '🦷 Dental Implants', 'Other services'];
      } else if (cleanText.includes('insurance') || cleanText.includes('star') || cleanText.includes('bupa') || cleanText.includes('pay') || cleanText.includes('emi')) {
        botResponse = "Yes! We accept all major Indian health insurance policies including Star Health, Niva Bupa, HDFC ERGO, Care Health, and ICICI Lombard. We also offer No-Cost EMI options through Bajaj Finserv!";
        options = ['📅 Book Appointment', 'Contact clinic'];
      } else if (cleanText.includes('implant') || cleanText.includes('pain') || cleanText.includes('hurt')) {
        botResponse = "Dental implants are performed under advanced local anesthesia, so you will feel no pain during the procedure. Most patients only report minor soreness for 2-3 days, easily managed with standard pain relievers.";
        options = ['📅 Book Appointment', 'How long do they take?'];
      } else {
        botResponse = "I understand! For specific medical advice or custom procedures, I recommend scheduling a comprehensive consultation with one of our specialized dentists.";
        options = ['📅 Book Appointment', '🦷 View All Services', 'Call Clinic Support'];
      }

      setMessages(prev => [...prev, {
        id: `bot-${Date.now()}`,
        sender: 'bot' as const,
        text: botResponse,
        options: options.length > 0 ? options : undefined
      }]);
    }, 700);
  };

  const handleOptionClick = (option: string) => {
    // Check custom trigger actions
    if (option.includes('Booking') || option.includes('📅 Book')) {
      handleSendMessage(option);
      setTimeout(() => {
        setIsOpen(false);
        setViewMode('patient');
        setPatientTab('booking');
      }, 500);
    } else if (option === 'Go to Booking Flow ➡️') {
      setIsOpen(false);
      setViewMode('patient');
      setPatientTab('booking');
    } else if (option.includes('Services') || option === '🦷 View All Services') {
      handleSendMessage(option);
      setTimeout(() => {
        setIsOpen(false);
        setViewMode('patient');
        setPatientTab('services');
      }, 500);
    } else {
      handleSendMessage(option);
    }
  };

  return (
    <>
      {/* Floating Chat Bubble */}
      <div className="chatbot-bubble" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={26} /> : <MessageSquare size={26} />}
      </div>

      {/* Expanded Chat Window */}
      {isOpen && (
        <div className="chatbot-window">
          <div className="chat-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ background: 'rgba(255,255,255,0.2)', padding: '6px', borderRadius: '50%', display: 'flex' }}>
                <Sparkles size={16} />
              </div>
              <div>
                <h4 style={{ color: '#ffffff', fontSize: '14px', fontWeight: 600 }}>DentalCare AI</h4>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '10px' }}>Replies instantly</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>
          </div>

          <div className="chat-messages">
            {messages.map(msg => (
              <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div className={`chat-msg ${msg.sender === 'bot' ? 'chat-msg-bot' : 'chat-msg-user'}`}>
                  {msg.text.split('\n').map((line, i) => (
                    <span key={i} style={{ display: 'block' }}>{line}</span>
                  ))}
                </div>
                {msg.sender === 'bot' && msg.options && (
                  <div className="chat-options">
                    {msg.options.map((opt, i) => (
                      <button 
                        key={i} 
                        className="chat-opt-btn"
                        onClick={() => handleOptionClick(opt)}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form 
            className="chat-input-area"
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputText);
            }}
          >
            <input
              type="text"
              placeholder="Ask me about booking, prices, insurance..."
              className="chat-input"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button 
              type="submit" 
              className="btn btn-primary"
              style={{ padding: '8px 12px', border: 'none', borderRadius: '8px' }}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
