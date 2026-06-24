// src/popup/PushButton.jsx
import React from 'react';

const PushButton = ({ onClick, disabled }) => (
    <button
        id="pushBtn"
        onClick={onClick}
        disabled={disabled}
        style={{
            width: '100%',
            margin: '5px 0',
            padding: '6px',
            background: '#2563EB',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: disabled ? 'not-allowed' : 'pointer',
        }}
    >
        Push
    </button>
);

export default PushButton;
