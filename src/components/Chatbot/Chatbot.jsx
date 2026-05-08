import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Trash2, Bot, User } from 'lucide-react';
import { fetchChatResponse } from '../../services/api';
import toast from 'react-hot-toast';

export default function Chatbot({ contextData }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('chat_history');
    let loadedMessages = null;
    if (saved) {
      try {
        loadedMessages = JSON.parse(saved);
        if (!Array.isArray(loadedMessages) || loadedMessages.length === 0) {
          loadedMessages = null;
        }
      } catch (e) {
        console.error("Failed to load chat history");
      }
    }

    if (loadedMessages) {
      setMessages(loadedMessages);
    } else {
      setMessages([
        { role: 'assistant', content: 'Hello! I can answer questions based on the ISS and News dashboard data. How can I help you today?' }
      ]);
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      // Keep only last 30 messages
      const limitedMessages = messages.slice(-30);
      localStorage.setItem('chat_history', JSON.stringify(limitedMessages));
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage = { role: 'user', content: input.trim() };
    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      // Create context block for system prompt is handled in api.js
      // We pass the new messages array, excluding the initial assistant greeting
      const apiMessages = newMessages.filter((m, i) => !(i === 0 && m.role === 'assistant') && (m.role === 'user' || m.role === 'assistant'));
      const responseContent = await fetchChatResponse(apiMessages, contextData);

      setMessages(prev => [...prev, { role: 'assistant', content: responseContent }]);
    } catch (error) {
      toast.error("Failed to get AI response");
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I couldn't process that request right now." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    const initial = [{ role: 'assistant', content: 'Chat cleared. How can I help you with the dashboard data?' }];
    setMessages(initial);
    localStorage.setItem('chat_history', JSON.stringify(initial));
    toast.success("Chat history cleared");
  };

  return (
    <>
      {/* FAB Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 p-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-2xl transition-transform hover:scale-110 z-50 focus:outline-none focus:ring-4 focus:ring-indigo-300"
        aria-label="Toggle AI Chat"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-6 w-80 sm:w-96 h-[500px] max-h-[80vh] glass-card shadow-2xl flex flex-col z-50 origin-bottom-right animate-in slide-in-from-bottom-4"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-indigo-600 text-white rounded-t-xl">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              <h3 className="font-bold">Dashboard AI Assistant</h3>
            </div>
            <div className="flex gap-2">
              <button onClick={clearChat} className="p-1 hover:bg-indigo-500 rounded transition-colors" title="Clear chat">
                <Trash2 className="w-4 h-4" />
              </button>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-indigo-500 rounded transition-colors" title="Close">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-900/50">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl p-3 shadow-sm ${msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-tl-none'
                  }`}>
                  <div className="flex items-center gap-2 mb-1 opacity-70">
                    {msg.role === 'user' ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                    <span className="text-[10px] uppercase font-bold">{msg.role}</span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-tl-none p-4 shadow-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <form onSubmit={handleSend} className="p-3 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-b-xl flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about ISS or News..."
              className="flex-1 px-3 py-2 bg-slate-100 dark:bg-slate-700 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 dark:text-slate-200 transition-colors"
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
