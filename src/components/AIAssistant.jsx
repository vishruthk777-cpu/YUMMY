import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Loader2, ListPlus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { MENU_ITEMS } from '../../server/menuData.js';
import './AIAssistant.css';

const MENU_DATA = MENU_ITEMS;

const getDynamicSuggestions = () => {
  const hour = new Date().getHours();
  if (hour < 11) return ["Recommend breakfast", "Order 1 Masala Dosa", "Is coffee available?", "Show morning specials"];
  if (hour < 16) return ["What's in the Thali?", "Suggest a quick lunch", "Order 2 Biryanis", "Any desserts?"];
  return ["Dinner recommendations", "Order Paneer Butter Masala", "Is there Biryani?", "Show night treats"];
};

const SUGGESTIONS = getDynamicSuggestions();

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: "Namaste! 🙏 I'm your Yummy Assistant. I'm here to help you explore our authentic flavors in Shadnagar. I can recommend dishes, answer questions, or even add items to your cart while we chat! What are you craving today?", sender: 'ai' }
  ]);
  
  const messagesEndRef = useRef(null);
  const { addToCart, clearCart } = useCart();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen, isTyping, streamingText]);

  // Advanced NLP to extract multiple items & quantities from a single string
  const extractOrdersFromText = (text) => {
    const orders = [];
    const lowerText = text.toLowerCase();
    
    // Improved extraction: handles "2 masala dosas", "one coffee", "vada and idli"
    const numberMap = { 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5 };
    
    // Split by common separators
    const parts = lowerText.split(/(?:and|,|&|\+)/);
    
    parts.forEach(part => {
      let quantity = 1;
      
      // Try to find digit quantity: "2 masala dosa"
      const digitMatch = part.match(/(\d+)/);
      if (digitMatch) {
         quantity = parseInt(digitMatch[1], 10);
      } else {
         // Try to find word quantity: "two masala dosa"
         for (const [word, num] of Object.entries(numberMap)) {
            if (part.includes(word)) {
              quantity = num;
              break;
            }
         }
      }
      
      // Match against MENU_DATA
      const foundItem = MENU_DATA.find(item => {
        const name = item.name.toLowerCase();
        // Exact match or significant keyword match
        return part.includes(name) || (name.length > 5 && part.includes(name.substring(0, 5)));
      });

      if (foundItem) {
        orders.push({ item: foundItem, quantity });
      }
    });
    return orders;
  };

  const processAI = (input) => {
    const query = input.toLowerCase();
    
    // Command detection
    const isOrderIntent = ['order', 'want', 'add', 'give', 'get', 'buy', 'hungry', 'craving', 'need'].some(w => query.includes(w));
    const isRemovalIntent = ['remove', 'delete', 'cancel', 'don\'t want'].some(w => query.includes(w));
    const isClearIntent = ['clear cart', 'empty cart', 'remove everything'].some(w => query.includes(w));
    const isGreeting = ['hi', 'hello', 'hey', 'who are you', 'how are you'].some(w => query.includes(w));
    const isMenuQuery = ['menu', 'show', 'list', 'what do you have'].some(w => query.includes(w));

    // 1. Clear Cart
    if (isClearIntent) {
      if (clearCart) clearCart();
      return "Consider it done! I've cleared your cart. You're ready for a fresh start—what's on your mind now?";
    }

    // 2. Greetings
    if (isGreeting && !isOrderIntent) {
      return "Greetings! 🙏 I'm your dedicated Yummy Assistant. I'm an expert on our menu here in Shadnagar. Feel free to ask for my recommendations, or just say *'Order 2 Masala Dosas'* and I'll take care of it for you instantly!";
    }

    // 3. Menu/List inquiry
    if (isMenuQuery && !isOrderIntent) {
      return "Our kitchen is busy preparing everything from authentic **South Indian Breakfasts** to hearty **Vegetable Dum Biryanis**. We also have a fantastic **Bakery** and **Cake Shop** for your sweet cravings! What can I help you find?";
    }

    // 4. Extraction & Ordering
    const exactOrders = extractOrdersFromText(query);
    
    if (isOrderIntent && exactOrders.length > 0) {
      let response = `Excellent choice! I've added these to your cart:\n\n`;
      let total = 0;

      exactOrders.forEach(order => {
        for(let i=0; i<order.quantity; i++) {
          addToCart(order.item);
        }
        response += `✅ **${order.quantity}x ${order.item.name}** (₹${order.item.price * order.quantity})\n`;
        total += order.item.price * order.quantity;
      });
      
      response += `\nThat's a total of **₹${total}**. Ready to head to the checkout, or is there anything else you'd like to add?`;
      return response;
    }

    // 5. Recommendations
    if (query.includes('popular') || query.includes('best') || query.includes('recommend')) {
      return "You can't go wrong with our **Premium Masala Dosa**—it's a Shadnagar legend! For something more filling, our **Hyderabadi Veg Dum Biryani** is exceptional. If you have a sweet tooth, our **Signature Black Forest Pastry** is always a hit. Should I add one of these to your cart?";
    }

    if (query.includes('spicy')) {
      return "For a real kick, I recommend our **Veg Dum Biryani** or **Paneer Butter Masala**. We can even make it extra spicy if you leave a note in the instructions! Shall I add it?";
    }

    // Fallback
    if (exactOrders.length > 0) {
       const info = exactOrders[0].item;
       return `The **${info.name}** is one of our favorites! It's just ₹${info.price}. Would you like me to add it to your cart now?`;
    }

    return "I'm sorry, I didn't quite catch that. Try asking something like: *'What do you recommend for breakfast?'* or *'Add 2 coffees and a slice of cake'*!";
  };


  const simulateStreaming = (finalText) => {
    setIsTyping(false);
    let i = 0;
    setStreamingText('');
    
    const interval = setInterval(() => {
      setStreamingText(prev => prev + finalText.charAt(i));
      i++;
      if (i >= finalText.length) {
        clearInterval(interval);
        setMessages(prev => [...prev, { id: Date.now(), text: finalText, sender: 'ai' }]);
        setStreamingText('');
      }
    }, 15); // Speed of typing simulation in ms per character
  };

  const triggerInteraction = (text) => {
    if (!text.trim()) return;
    const userMessage = { id: Date.now(), text: text, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const aiResponseText = processAI(text);
      simulateStreaming(aiResponseText);
    }, 800); // Initial "thinking" delay
  };

  const handleSend = (e) => {
    e.preventDefault();
    triggerInteraction(inputText);
  };

  const renderFormattedText = (text) => {
    // Simple parser for bold (**text**) and newlines (\n)
    return text.split('\n').map((line, lIndex) => (
      <span key={lIndex}>
        {line.split('**').map((part, i) => i % 2 === 1 ? <strong key={i}>{part}</strong> : part)}
        {lIndex < text.split('\n').length - 1 && <br/>}
      </span>
    ));
  };

  return (
    <div className="ai-container">
      <button className={`ai-fab ${isOpen ? 'hidden' : ''}`} onClick={() => setIsOpen(true)}>
        <MessageSquare size={24} />
      </button>

      {isOpen && (
        <div className="ai-chat-window fade-in" style={{width: '380px', height: '550px'}}>
          <div className="ai-header" style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)', color: 'white' }}>
            <div className="ai-header-title">
              <Bot size={24} color="#f97316" />
              <div style={{display: 'flex', flexDirection: 'column'}}>
                <h3 style={{margin: 0, fontSize: '1.1rem', lineHeight: 1.2}}>Yummy AI</h3>
                <span style={{fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)'}}>Smart Assistant · Online</span>
              </div>
            </div>
            <button className="btn-icon-small" onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <div className="ai-messages" style={{paddingBottom: '20px'}}>
            {messages.map(msg => (
              <div key={msg.id} className={`message-wrapper ${msg.sender}`}>
                {msg.sender === 'ai' && <div className="avatar ai-avatar"><Bot size={16} /></div>}
                <div className={`message-bubble ${msg.sender}`}>
                  {renderFormattedText(msg.text)}
                </div>
              </div>
            ))}
            
            {/* Streaming UI */}
            {streamingText && (
               <div className="message-wrapper ai">
                 <div className="avatar ai-avatar"><Bot size={16} /></div>
                 <div className="message-bubble ai streaming-cursor">
                   {renderFormattedText(streamingText)}
                 </div>
               </div>
            )}

            {isTyping && (
              <div className="message-wrapper ai">
                <div className="avatar ai-avatar"><Bot size={16} /></div>
                <div className="message-bubble ai typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="ai-interaction-area">
            {!isTyping && !streamingText && messages.length < 4 && (
              <div className="ai-suggestions scroll-x">
                {SUGGESTIONS.map((sug, i) => (
                  <button key={i} className="ai-chip" onClick={() => triggerInteraction(sug)}>
                    {sug}
                  </button>
                ))}
              </div>
            )}

            <form className="ai-input-area" onSubmit={handleSend}>
              <button type="button" className="ai-voice-btn text-muted" title="Menu Actions">
                <ListPlus size={20} />
              </button>
              <input 
                type="text" 
                placeholder="Ask or order anything..." 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={isTyping || streamingText.length > 0}
              />
              <button 
                type="submit" 
                disabled={!inputText.trim() || isTyping || streamingText.length > 0} 
                className="ai-send-btn"
              >
                {isTyping ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
