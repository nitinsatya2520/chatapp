import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Navbar from './Navbar';

function Chat() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const chatWindowRef = useRef(null);

  useEffect(() => {
    // Function to fetch messages from the server
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

    fetchMessages(); // Initial fetch

    // Set up polling to fetch messages every 5 seconds
    const intervalId = setInterval(fetchMessages, 5000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    // Scroll chat window to the top
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = 0;
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
          // Fetch messages again to update the chat window
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

      // Clear chat state and log out
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
    <div>
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
            
            <div className="navbar">
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      
      </div>
          </div>
        ) : (
          <div>
            <div className="chat-header">
              KNS Chat App
              
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
            <Link to="/about" className="leave-chat">About</Link>
            
          </div>
        )}
      </div>
    </div>
    </div>
  );
}


function About() {
  return (
    <div className="about-page">
      <h1>About This Chat App</h1>
      <p>
        This is a simple chat application that allows users to join a chat room, send and receive messages, and toggle between dark and light modes.
      </p>
      <p>
        The app fetches messages every 5 seconds and ensures that new messages appear at the top of the chat window. You can easily switch between chat and this About page using the navigation links.
      </p>
      <Link to="/">Back to Chat</Link>
      
    </div>
  );
}

function App() {
  return (
    <Router>
      <div>
      <div className="chat-app">
      <Routes>
        <Route path="/" element={<Chat />} />
        <Route path="/about" element={<About />} />
      </Routes>
      
      
      </div>
      </div>
    </Router>
  );
}


export default App;
