import React from "react";

const PushButton = ({ onClick, disabled, text = "Push" }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      width: "100%",
      margin: "8px 0",
      padding: "10px",
      background: "#2563EB",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      cursor: disabled ? "not-allowed" : "pointer",
      fontWeight: 600
    }}
  >
    {text}
  </button>
);

export default PushButton;