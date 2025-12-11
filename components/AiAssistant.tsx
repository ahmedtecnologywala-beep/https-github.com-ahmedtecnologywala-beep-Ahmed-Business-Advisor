import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, User, Bot, Mic, Volume2, Loader2 } from 'lucide-react';
import { chatWithAdvisor, generateSpeech } from '../services/geminiService';
import { AdvisorResponse } from '../types';

interface AiAssistantProps {
  contextData: AdvisorResponse | null;
}

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export const AiAssistant: React.FC<AiAssistantProps> = ({ contextData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'As-salamu alaykum! I am Ahmed, your Business Advisor. Speak to me or type your question.' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || inputValue;
    if (!textToSend.trim()) return;

    setInputValue('');
    setMessages(prev => [...prev, { role: 'user', text: textToSend }]);
    setIsTyping(true);

    try {
      const historyForApi = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const responseText = await chatWithAdvisor(historyForApi, textToSend, contextData);
      
      if (responseText) {
        setMessages(prev => [...prev, { role: 'model', text: responseText }]);
        // Automatically play audio for the response
        playResponseAudio(responseText);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Maaf kijiye, connection issue. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const playResponseAudio = async (text: string) => {
    try {
      setIsPlayingAudio(true);
      const base64Audio = await generateSpeech(text);
      
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const audioCtx = audioContextRef.current;
      const binaryString = atob(base64Audio);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const audioBuffer = await audioCtx.decodeAudioData(bytes.buffer);
      const source = audioCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioCtx.destination);
      source.start(0);
      
      source.onended = () => setIsPlayingAudio(false);

    } catch (e) {
      console.error("Audio playback failed", e);
      setIsPlayingAudio(false);
    }
  };

  const startListening = () => {
    if ('webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-PK'; // Optimizing for Pakistani English

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        handleSend(transcript); // Auto-send on voice end
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert("Voice input is not supported in this browser. Please use Chrome.");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 md:w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-fade-in-up">
          {/* Header */}
          <div className="bg-emerald-600 p-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="bg-white/20 p-1.5 rounded-full">
                {isPlayingAudio ? <Volume2 className="w-5 h-5 text-white animate-pulse" /> : <Bot className="w-5 h-5 text-white" />}
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Ahmed AI Assistant</h3>
                <span className="text-emerald-100 text-xs flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span> Online
                </span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-emerald-600 text-white rounded-br-none' 
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-bl-none shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-slate-100">
            <div className="relative flex items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask me anything..."
                className="flex-grow bg-slate-50 text-slate-900 border border-slate-200 rounded-xl pl-4 pr-3 py-3 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 placeholder-slate-400"
              />
              
              {/* Mic Button */}
              <button
                onClick={startListening}
                className={`p-2.5 rounded-lg transition-colors ${
                  isListening 
                    ? 'bg-red-500 text-white animate-pulse' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
                title="Speak"
              >
                <Mic className="w-5 h-5" />
              </button>

              {/* Send Button */}
              <button 
                onClick={() => handleSend()}
                disabled={!inputValue.trim() || isTyping}
                className="p-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="text-center mt-2">
                 <p className="text-[10px] text-slate-400">AI voice active. Click Mic to speak.</p>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-4 rounded-full shadow-xl transition-all duration-300 flex items-center justify-center border-2 border-emerald-50 ${
            isOpen 
            ? 'bg-slate-800 text-white rotate-90' 
            : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:scale-110'
        }`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </div>
  );
};