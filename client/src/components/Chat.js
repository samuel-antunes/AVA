"use client";
import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophone,
  faStop,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { useMediaRecorder } from "../hooks/useMediaRecorder";
import { sendMessage, transcribeAudio, generateTTS } from "../utils/api";
import ChatMessage from "./ChatMessage";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);
  const { audioBlob, isRecording, startRecording, stopRecording } =
    useMediaRecorder();

  useEffect(() => {
    const handleTranscription = async () => {
      if (audioBlob) {
        const transcribedText = await transcribeAudio(audioBlob);
        if (transcribedText) {
          handleSendMessage(transcribedText);
        }
      }
    };
    handleTranscription();
  }, [audioBlob]);

  const handleSendMessage = async (messageText) => {
    const userMessage = { role: "user", content: messageText };
    let updatedConversation = [...conversation, userMessage];

    if (selectedImage) {
      const imageMessage = {
        role: "user",
        content: URL.createObjectURL(selectedImage),
        type: "image",
      };
      updatedConversation = [...updatedConversation, imageMessage];
    }

    setConversation(updatedConversation);

    const botReply = await sendMessage(updatedConversation, selectedImage);
    if (botReply) {
      setConversation((prev) => [
        ...prev,
        { role: "assistant", content: botReply },
      ]);
    }

    setMessage("");
    setSelectedImage(null); // Clear the selected image
    if (fileInputRef.current) {
      fileInputRef.current.value = null; // Clear the file input
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
    }
  };

  const handleImageInput = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="p-5 max-w-lg mx-auto">
      <div className="mb-5 h-96 overflow-y-scroll border border-gray-300 p-4 bg-gray-50 rounded-lg">
        {conversation.map((entry, index) => (
          <div key={index}>
            {entry.type === "image" ? (
              <div className="flex justify-end mt-2">
                <img
                  src={entry.content}
                  alt="Uploaded"
                  className="max-w-xs rounded-md"
                />
              </div>
            ) : (
              <ChatMessage
                sender={entry.role}
                text={entry.content}
                onPlayTTS={() => handlePlayTTS(entry.content)}
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center">
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
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className="ml-2 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          <FontAwesomeIcon icon={isRecording ? faStop : faMicrophone} />
        </button>
        <button
          onClick={handleImageClick}
          className="ml-2 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          <FontAwesomeIcon icon={faPlus} />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageInput}
          accept="image/png, image/jpeg, image/jpg, image/webp"
          className="hidden"
        />
      </div>
    </div>
  );
};

export default Chat;
