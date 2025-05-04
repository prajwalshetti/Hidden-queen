import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const ChatBox = ({ socket, roomID, username, playerRole }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  // Set up chat message handling
  useEffect(() => {
    // Clear previous listeners
    socket.off("chatMessage");
    socket.off("chatHistory");

    socket.on("chatMessage", (msg) => {
      setMessages(prevMessages => [...prevMessages, {
        ...msg,
        isOwnMessage: msg.username === username
      }]);
    });

    socket.on("chatHistory", (history) => {
      const formattedHistory = history.map(msg => ({
        ...msg,
        isOwnMessage: msg.username === username
      }));
      setMessages(formattedHistory);
    });

    return () => {
      socket.off("chatMessage");
      socket.off("chatHistory");
    };
  }, [socket, username]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const chatMessage = {
        roomID,
        username,
        text: message,
        playerRole: playerRole,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      socket.emit("sendMessage", chatMessage);
      setMessage('');
    }
  };

  const getChatTitle = () => {
    if (playerRole === 'w' || playerRole === 'b') return "Player Chat";
    return "Spectator Chat";
  };

  const getChatDescription = () => {
    if (playerRole === 'w' || playerRole === 'b') return "Chat with your opponent";
    return "Chat with other spectators";
  };

  return (
    <motion.div
    className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700 h-screen max-h-screen flex flex-col p-4"
    initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="text-purple-400 font-bold mb-2 text-lg border-b border-gray-700 pb-2">
        {getChatTitle()}
      </div>

      <div className="text-gray-500 text-xs mb-3 italic">
        {getChatDescription()}
      </div>

      <div
        className="flex-grow overflow-y-auto flex flex-col-reverse scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 mb-3 px-1"
        ref={messagesEndRef}
      >
        {messages.length === 0 ? (
          <div className="text-gray-500 text-center py-4">
            No messages yet. Start the conversation!
          </div>
        ) : (
          [...messages].reverse().map((msg, index) => (
            <motion.div
              key={index}
              className={`mb-2 ${msg.isOwnMessage ? 'text-right' : ''}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className={`inline-block max-w-xs rounded-lg px-3 py-2 ${
                msg.isOwnMessage
                  ? 'bg-purple-800 text-white rounded-br-none'
                  : 'bg-gray-700 text-gray-100 rounded-bl-none'
              }`}>
                <div className="text-xs font-bold mb-1">
                  {msg.isOwnMessage ? 'Me' : msg.username}
                </div>
                <div className="text-sm">{msg.text}</div>
                <div className="text-xs text-gray-400 text-right mt-1">{msg.timestamp}</div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <form onSubmit={sendMessage} className="mt-auto">
        <div className="flex">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-grow bg-gray-700 border border-gray-600 rounded-l-lg py-2 px-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Type a message..."
          />
          <motion.button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-r-lg px-4"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Send
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default ChatBox;
