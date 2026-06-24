// src/popup/Login.jsx
import React from 'react';

const Login = ({ onLogin }) => (
  <div style={{ marginBottom: '10px' }}>
    <button
      onClick={onLogin}
      style={{
        width: '100%',
        padding: '8px',
        background: '#2563EB',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
      }}
    >
      Login with GitHub
    </button>
  </div>
);

export default Login;
