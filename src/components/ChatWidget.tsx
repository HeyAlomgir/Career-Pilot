"use client";

import React, { useState, useRef, useEffect } from "react";
import { FiMessageCircle, FiX, FiSend } from "react-icons/fi";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

interface Message {
    role: "user" | "assistant";
    content: string;
}

const suggestedPrompts = [
    "How do I post a job?",
    "How can I apply to a job?",
    "What is CareerPilot?",
];

export default function ChatWidget(): React.JSX.Element {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: "assistant", content: "Hi! I'm CareerPilot's AI assistant. How can I help you today?" },
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }, [messages, isTyping]);

    const sendMessage = async (text: string) => {
        if (!text.trim()) return;

        const newMessages: Message[] = [...messages, { role: "user", content: text }];
        setMessages(newMessages);
        setInput("");
        setIsTyping(true);

        try {
            const res = await fetch(`${BACKEND_URL}/api/ai/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: newMessages }),
            });

            const data = await res.json();
            setMessages((prev) => [...prev, { role: "assistant", content: data.reply || "Sorry, something went wrong." }]);
        } catch (err) {
            console.error("Chat error:", err);
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: "Sorry, I couldn't connect right now. Please try again." },
            ]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <>
            {/* Floating toggle button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-5 right-5 z-[90] w-14 h-14 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg hover:bg-indigo-700 transition-colors"
                aria-label="Open AI chat assistant"
            >
                {isOpen ? <FiX size={22} /> : <FiMessageCircle size={22} />}
            </button>

            {/* Chat panel */}
            {isOpen && (
                <div className="fixed bottom-24 right-5 z-[90] w-[90vw] max-w-sm h-[500px] max-h-[70vh] rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-2xl flex flex-col overflow-hidden">

                    {/* Header */}
                    <div className="px-4 py-3 bg-indigo-600 text-white flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
                            AI
                        </div>
                        <div>
                            <p className="text-sm font-semibold">CareerPilot Assistant</p>
                            <p className="text-[10px] text-indigo-100">Always here to help</p>
                        </div>
                    </div>

                    {/* Messages */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={`max-w-[85%] px-3 py-2 rounded-2xl text-xs leading-relaxed ${msg.role === "user"
                                        ? "self-end bg-indigo-600 text-white rounded-br-sm"
                                        : "self-start bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 rounded-bl-sm"
                                    }`}
                            >
                                {msg.content}
                            </div>
                        ))}

                        {/* Typing indicator */}
                        {isTyping && (
                            <div className="self-start bg-gray-100 dark:bg-gray-900 px-3 py-2 rounded-2xl rounded-bl-sm flex gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.3s]" />
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.15s]" />
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" />
                            </div>
                        )}

                        {/* Suggested prompts - শুধু প্রথম মেসেজের সময় দেখাবে */}
                        {messages.length === 1 && (
                            <div className="flex flex-col gap-2 mt-2">
                                {suggestedPrompts.map((prompt) => (
                                    <button
                                        key={prompt}
                                        onClick={() => sendMessage(prompt)}
                                        className="text-left text-xs px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                                    >
                                        {prompt}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            sendMessage(input);
                        }}
                        className="flex items-center gap-2 p-3 border-t border-gray-100 dark:border-gray-800"
                    >
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask me anything..."
                            className="flex-1 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                            type="submit"
                            disabled={isTyping}
                            className="p-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-50 flex-shrink-0"
                        >
                            <FiSend size={14} />
                        </button>
                    </form>
                </div>
            )}
        </>
    );
}