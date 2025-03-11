import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
function Login({ setIsLoggedIn }) {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    const validPassword = 'kns123'; // Change this to your desired password

    if (password === validPassword) {
      setIsLoggedIn(true);
      navigate('/'); // Redirect to the chat page
    } else {
      alert('Incorrect password. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <h1>Login to KNS Chat App</h1>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter the password"
      />
      <button onClick={handleLogin}>Proceed</button>
    </div>
  );
}

export default Login;
