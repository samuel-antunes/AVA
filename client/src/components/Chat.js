"use client";
import React, { useState } from "react";
import axios from "axios";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState([]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = { sender: "user", text: message };
    setConversation([...conversation, userMessage]);

    try {
      const response = await axios.post("http://localhost:5000/chat", {
        message,
      });
      const botReply = { sender: "bot", text: response.data.reply };
      setConversation([...conversation, userMessage, botReply]);
    } catch (error) {
      console.error("Error sending message:", error);
    }

    setMessage("");
  };

  const handlePlayTTS = async (text) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/tts",
        { text },
        { responseType: "blob" }
      );
      const audioUrl = URL.createObjectURL(response.data);
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (error) {
      console.error("Error generating TTS:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="p-5 max-w-lg mx-auto">
      <div className="mb-5 h-96 overflow-y-scroll border border-gray-300 p-4 bg-gray-50 rounded-lg">
        {conversation.map((entry, index) => (
          <div
            key={index}
            className={`flex items-center my-2 ${
              entry.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <strong className="mr-2">
              {entry.sender === "user" ? "You" : "Bot"}:
            </strong>
            <span>{entry.text}</span>
            {entry.sender === "bot" && (
              <button
                onClick={() => handlePlayTTS(entry.text)}
                className="ml-2 text-blue-500 hover:text-blue-700"
              >
                🔊
              </button>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 p-2 border border-gray-300 rounded-md"
        />
        <button
          onClick={handleSendMessage}
          className="ml-2 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
