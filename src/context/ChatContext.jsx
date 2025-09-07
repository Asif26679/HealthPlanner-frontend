import React, { createContext, useState } from "react";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  return (
    <ChatContext.Provider value={{ messages, setMessages, isTyping, setIsTyping }}>
      {children}
    </ChatContext.Provider>
  );
};
