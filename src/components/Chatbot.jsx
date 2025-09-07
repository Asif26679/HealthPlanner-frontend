import React, { useState, useRef, useEffect, useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import { motion, AnimatePresence } from "framer-motion";
import { PaperAirplaneIcon, XMarkIcon } from "@heroicons/react/24/solid";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const { messages, setMessages, isTyping, setIsTyping } = useContext(ChatContext);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, type: "user", id: Date.now() };
    setMessages([...messages, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("http://localhost:7000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            ...messages.map((m) => ({ role: m.type === "user" ? "user" : "assistant", content: m.text })),
            { role: "user", content: input }
          ]
        })
      });

      const data = await response.json();
      const aiMessage = { text: data.choices[0].message.content, type: "ai", id: Date.now() + 1 };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      setMessages((prev) => [...prev, { text: "⚠️ AI is unavailable.", type: "ai", id: Date.now() + 1 }]);
    } finally {
      setIsTyping(false);
    }
  };

  const toggleChat = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        onClick={toggleChat}
        className="fixed bottom-5 right-5 w-16 h-16 rounded-full flex items-center justify-center z-50 bg-gray-900 text-white shadow-lg"
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.95 }}
      >
        💬
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-20 right-5 sm:right-8 w-80 sm:w-96 h-[480px] sm:h-[550px] bg-gray-900/90 backdrop-blur-3xl rounded-3xl shadow-2xl flex flex-col z-50 border border-gray-700 overflow-hidden"
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Header */}
            <div className="bg-gray-800 p-3 text-white font-semibold flex justify-between items-center rounded-t-3xl shadow-md">
              AI Fitness Coach
              <motion.button onClick={toggleChat} whileTap={{ scale: 0.9 }}>
                <XMarkIcon className="w-6 h-6 text-white hover:text-gray-300" />
              </motion.button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-3 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
              <AnimatePresence>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    className={`flex ${msg.type === "user" ? "justify-start" : "justify-end"}`}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  >
                    <div
                      className={`px-4 py-2 max-w-[75%] break-words ${
                        msg.type === "user"
                          ? "bg-gray-800 text-white rounded-2xl rounded-bl-none shadow-inner"
                          : "bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-2xl rounded-br-none shadow-lg shadow-indigo-500/50"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-end">
                  <motion.div
                    className="bg-indigo-600/80 text-white px-3 py-2 rounded-2xl rounded-br-none flex space-x-1 shadow-md"
                    animate={{ opacity: [0.5, 1, 0.5], y: [0, -3, 0] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  >
                    <span className="w-2 h-2 bg-white rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-white rounded-full animate-bounce delay-200"></span>
                    <span className="w-2 h-2 bg-white rounded-full animate-bounce delay-400"></span>
                  </motion.div>
                </div>
              )}
              <div ref={messagesEndRef}></div>
            </div>

            {/* Input */}
            <div className="flex border-t border-gray-700 p-2">
              <input
                type="text"
                className="flex-1 bg-gray-800 text-white placeholder-gray-400 px-4 py-3 rounded-l-3xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-inner backdrop-blur-lg transition-all duration-200"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <motion.button
                onClick={sendMessage}
                className="bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-5 sm:px-6 py-3 rounded-r-3xl text-white font-semibold flex items-center justify-center shadow-lg"
                whileTap={{ scale: 0.95 }}
              >
                <PaperAirplaneIcon className="w-5 h-5 rotate-45" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
