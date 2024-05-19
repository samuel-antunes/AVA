"use client";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone, faStop } from "@fortawesome/free-solid-svg-icons";
import { useMediaRecorder } from "../hooks/useMediaRecorder";
import { sendMessage, transcribeAudio, generateTTS, translateImage } from "../utils/api";
import ChatMessage from "./ChatMessage";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState([]);
  const [image, setImage] = useState()
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
    const updatedConversation = [...conversation, userMessage];
    setConversation(updatedConversation);

    if(!image) {
      const botReply = await sendMessage(updatedConversation);
      if (botReply) {
        setConversation((prev) => [
          ...prev,
          { role: "assistant", content: botReply },
        ]);
      }
      return;
    }

    const botReply = await translateImage(image, messageText);
    if(botReply) {
      setConversation((prev) => [
        ...prev,
        { role: "assistant", content: botReply },
      ]);
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

<<<<<<< HEAD
=======
  const handleTranscription = async () => {
    if (audioBlob) {
      const transcribedText = await transcribeAudio(audioBlob);
      if (transcribedText) {
        handleSendMessage(transcribedText);
      }
    }
  };

  const handleImageInput = async (e) => {
    setImage(URL.createObjectURL(e.target.files[0]));
  }

>>>>>>> 6bdb2bb (Added function to send images and messages to the server)
  return (
    <div className="p-5 max-w-lg mx-auto">
      <div className="mb-5 h-96 overflow-y-scroll border border-gray-300 p-4 bg-gray-50 rounded-lg">
        {conversation.map((entry, index) => (
          <ChatMessage
            key={index}
            sender={entry.role}
            text={entry.content}
            onPlayTTS={() => handlePlayTTS(entry.content)}
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
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className="ml-2 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          <FontAwesomeIcon icon={isRecording ? faStop : faMicrophone} />
        </button>
      </div>
      <div className="mt-5 flex flex-col items-center">
        <h2 className="">Image Translator</h2>
        <input type="file" onChange={handleImageInput} accept="image/png, image/jpeg, image/jpg, image/webp" />
      </div>
    </div>
  );
};

export default Chat;
