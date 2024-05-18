"use client";
import React, { useState } from "react";
import { useMediaRecorder } from "../hooks/useMediaRecorder";
import { sendMessage, transcribeAudio, generateTTS } from "../utils/api";
import ChatMessage from "./ChatMessage";
import RecordButton from "./RecordButton";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState([]);
  const { audioBlob, isRecording, startRecording, stopRecording } =
    useMediaRecorder();

  const handleSendMessage = async (messageText) => {
    const userMessage = { sender: "user", text: messageText };
    setConversation((prev) => [...prev, userMessage]);

    const botReply = await sendMessage(messageText);
    if (botReply) {
      setConversation((prev) => [...prev, { sender: "bot", text: botReply }]);
    }
  };

  const handlePlayTTS = async (text) => {
    const audioUrl = await generateTTS(text);
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage(message);
      setMessage("");
    }
  };

  const handleTranscription = async () => {
    if (audioBlob) {
      const transcribedText = await transcribeAudio(audioBlob);
      if (transcribedText) {
        handleSendMessage(transcribedText);
      }
    }
  };

  return (
    <div className="p-5 max-w-lg mx-auto">
      <div className="mb-5 h-96 overflow-y-scroll border border-gray-300 p-4 bg-gray-50 rounded-lg">
        {conversation.map((entry, index) => (
          <ChatMessage
            key={index}
            sender={entry.sender}
            text={entry.text}
            onPlayTTS={() => handlePlayTTS(entry.text)}
          />
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
          onClick={() => handleSendMessage(message)}
          className="ml-2 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Send
        </button>
      </div>
      <div className="mt-5 flex flex-col items-center">
        <RecordButton
          isRecording={isRecording}
          onStart={startRecording}
          onStop={stopRecording}
        />
        {audioBlob && (
          <button
            onClick={handleTranscription}
            className="mt-2 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Transcribe and Send
          </button>
        )}
      </div>
    </div>
  );
};

export default Chat;
