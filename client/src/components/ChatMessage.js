import React from "react";

const ChatMessage = ({ sender, text, onPlayTTS }) => (
  <div
    className={`flex my-2 ${
      sender === "user" ? "justify-end" : "justify-start"
    }`}
  >
    <div
      className={`flex items-center ${
        sender === "user" ? "flex-row-reverse" : ""
      }`}
    >
      <div className="profile-picture">
        {sender === "user" ? (
          <img src="user.png" alt="User Profile" className="profile-icon" />
        ) : (
          <div className="profile-icon bot-icon">a.</div>
        )}
      </div>
      <div
        className={`message ${
          sender === "user" ? "user-message" : "bot-message"
        }`}
      >
        <span>{text}</span>
        {sender === "assistant" && (
          <button onClick={onPlayTTS} className="play-tts">
            🔊
          </button>
        )}
      </div>
    </div>
  </div>
);

export default ChatMessage;
