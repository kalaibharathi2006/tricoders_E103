import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Sparkles, Bot } from 'lucide-react';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
}

export function AIChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: "Hi! I'm your AI productivity assistant. How can I help you focus today?",
            sender: 'ai',
            timestamp: new Date(),
        },
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputValue,
            sender: 'user',
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        // Simulate AI delay
        setTimeout(() => {
            const responses = [
                "I've added that to your task list.",
                "That sounds important. I've marked it as high priority.",
                "I can help you schedule that. Would you like a reminder?",
                "Based on your habits, you might want to tackle that tomorrow morning.",
                "I've analyzed your workload and detected a potential bottleneck.",
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];

            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: randomResponse,
                sender: 'ai',
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, aiMessage]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <div className="fixed bottom-24 right-6 z-50 flex flex-col items-end pointer-events-none">
            {/* Chat Window */}
            <div
                className={`pointer-events-auto bg-white rounded-2xl shadow-2xl border border-gray-200 w-80 mb-4 transition-all duration-300 origin-bottom-right overflow-hidden ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-10 pointer-events-none'
                    }`}
                style={{ maxHeight: '500px' }}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white">
                        <div className="bg-white/20 p-1.5 rounded-lg">
                            <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-sm">TriCoders AI</h3>
                            <p className="text-xs text-blue-100 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                                Online
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-white/80 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Messages */}
                <div className="p-4 h-80 overflow-y-auto bg-gray-50">
                    <div className="space-y-4">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] p-3 rounded-2xl text-sm ${message.sender === 'user'
                                            ? 'bg-blue-600 text-white rounded-br-none'
                                            : 'bg-white border border-gray-200 text-gray-700 rounded-bl-none shadow-sm'
                                        }`}
                                >
                                    {message.text}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Input */}
                <div className="p-3 bg-white border-t border-gray-200">
                    <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask anything..."
                            className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!inputValue.trim()}
                            className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`pointer-events-auto w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 ${isOpen ? 'bg-gray-200 text-gray-600 rotate-90' : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                    }`}
            >
                {isOpen ? <X className="w-6 h-6" /> : <Bot className="w-8 h-8" />}
            </button>
        </div>
    );
}
