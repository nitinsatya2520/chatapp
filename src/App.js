import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';

const socket = io('https://chatserver-psi.vercel.app/');

function App() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    socket.on('message', (payload) => {
      setChat((prevChat) => [...prevChat, payload]);
    });

    socket.on('typing', (typingUser) => {
      if (typingUser !== username) {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 2000);
      }
    });

    return () => {
      socket.off('message');
      socket.off('typing');
    };
  }, [username]);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('message', { username, message });
      setMessage('');
    }
  };

  const handleTyping = () => {
    socket.emit('typing', username);
  };

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const login = () => {
    if (username.trim()) {
      setIsLoggedIn(true);
    }
  };

  return (
    <div className={darkMode ? 'dark-mode' : ''}>
      <div className="chat-app">
        {!isLoggedIn ? (
          <div className="username-screen">
            <h1>Enter your username to join the chat</h1>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
            />
            <button onClick={login}>Join Chat</button>
          </div>
        ) : (
          <div>
            <div className="chat-header">
              Chat App
              <button className="dark-mode-toggle" onClick={toggleDarkMode}>
                {darkMode ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m8.66-10H21m-16 0H3m13.86 7.86L19.07 19.07M4.93 4.93l1.41 1.41m11.32 0L19.07 4.93M4.93 19.07l1.41-1.41" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9 9 0 0020.354 15.354z" />
                  </svg>
                )}
              </button>
            </div>
            <div className="chat-window">
              {chat.map((msg, index) => (
                <div key={index} className={`message ${msg.username === username ? 'sent' : 'received'}`}>
                  
                  <div className="bubble">
                    <strong>{msg.message}: </strong> {msg.username}
                  </div>
                </div>
              ))}
              {isTyping && <div className="typing-indicator">Someone is typing...</div>}
            </div>
            <div className="message-input">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyUp={handleTyping}
                placeholder="Type a message..."
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
