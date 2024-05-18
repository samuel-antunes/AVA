import React from "react";

const ChatMessage = ({ sender, text, onPlayTTS }) => (
  <div
    className={`flex items-center my-2 ${
      sender === "user" ? "justify-end" : "justify-start"
    }`}
  >
    <strong className="mr-2">{sender === "user" ? "You" : "Bot"}:</strong>
    <span>{text}</span>
    {sender === "bot" && (
      <button
        onClick={onPlayTTS}
        className="ml-2 text-blue-500 hover:text-blue-700"
      >
        🔊
      </button>
    )}
  </div>
);

export default ChatMessage;
