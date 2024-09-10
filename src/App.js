import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const chatWindowRef = useRef(null);

  useEffect(() => {
    // Fetch messages from the server
    const fetchMessages = async () => {
      try {
        const response = await fetch('https://chatserver-psi.vercel.app/messages');
        if (response.ok) {
          const data = await response.json();
          setChat(data);
        } else {
          console.error('Error fetching messages:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, []);

  useEffect(() => {
    // Auto-scroll chat window
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [chat]);

  const sendMessage = async () => {
    if (message.trim()) {
      try {
        const recipient = 'some-recipient-id'; // Replace with actual recipient ID
        const response = await fetch('https://chatserver-psi.vercel.app/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sender: username,
            recipient,
            content: message
          }),
        });

        if (response.ok) {
          setMessage('');
          // Refresh chat messages
          const data = await fetch('https://chatserver-psi.vercel.app/messages');
          const messages = await data.json();
          setChat(messages);
        } else {
          const errorText = await response.text();
          console.error('Error response from server:', errorText);
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const handleLeaveChat = async () => {
    try {
      await fetch('https://chatserver-psi.vercel.app/leave-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sender: username }),
      });

      // Clear chat state
      setChat([]);
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Error leaving chat:', error);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
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
            <div className="chat-window" ref={chatWindowRef}>
              {chat.map((msg) => (
                <div key={msg.id} className={`message ${msg.sender === username ? 'sent' : 'received'}`}>
                  <div className="bubble">
                    <strong>{msg.sender}:</strong> {msg.content}
                    <div className="timestamp">{new Date(msg.timestamp).toLocaleTimeString()}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="message-input">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
              />
              <button onClick={sendMessage}>Send</button>
            </div>
            <button className="leave-chat" onClick={handleLeaveChat}>Leave Chat</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
