"use client";

import { motion } from "framer-motion";
import { MessageSquare, User, Bot } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { fetchChatStream } from "../lib/api/analytics";

interface Message {
    id: number;
    sender: "bot" | "user";
    text: string;
    time: string;
}

export default function ChatMonitor() {
    const [messages, setMessages] = useState<Message[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Live backend stream
    useEffect(() => {
        const loadStream = async () => {
            try {
                const data = await fetchChatStream();
                setMessages(data);
            } catch (e) { console.error(e); }
        };

        loadStream();
        const interval = setInterval(loadStream, 3000); // Poll every 3s
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="glass-panel rounded-2xl border border-gray-800 flex flex-col h-[400px]">
            <div className="p-4 border-b border-gray-800 flex justify-between items-center">
                <h3 className="font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    Live AI Monitor
                </h3>
                <span className="text-xs text-gray-400">Monitoring +92 300...</span>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                    <motion.div
                        initial={{ opacity: 0, x: msg.sender === 'bot' ? -10 : 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        key={msg.id}
                        className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'bot' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-gray-700 text-gray-300'}`}>
                            {msg.sender === 'bot' ? <Bot size={16} /> : <User size={16} />}
                        </div>
                        <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender === 'bot' ? 'bg-gray-800 text-cyan-100 rounded-tl-none' : 'bg-blue-600/20 text-blue-100 rounded-tr-none'}`}>
                            <p>{msg.text}</p>
                            <p className="text-[10px] opacity-50 mt-1 text-right">{msg.time}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
