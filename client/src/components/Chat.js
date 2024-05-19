"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophone,
  faStop,
  faPlus,
  faCamera,
} from "@fortawesome/free-solid-svg-icons";
import { useMediaRecorder } from "../hooks/useMediaRecorder";
import { sendMessage, transcribeAudio, generateTTS } from "../utils/api";
import ChatMessage from "./ChatMessage";
import Webcam from "react-webcam";
import Modal from "./Modal";

const videoConstraints = {
  width: 640,
  height: 480,
  facingMode: "user",
};

const Chat = () => {
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef(null);
  const webcamRef = useRef(null);
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

    let imageToSend = null;
    if (imgSrc) {
      const response = await fetch(imgSrc);
      const blob = await response.blob();
      imageToSend = new File([blob], "webcam.jpg", { type: "image/jpeg" });
      updatedConversation.push({
        role: "user",
        content: imgSrc,
        type: "image",
      });
    }

    if (selectedImage) {
      imageToSend = selectedImage;
      updatedConversation.push({
        role: "user",
        content: URL.createObjectURL(selectedImage),
        type: "image",
      });
    }

    setConversation(updatedConversation);

    const botReply = await sendMessage(updatedConversation, imageToSend);
    if (botReply) {
      setConversation((prev) => [
        ...prev,
        { role: "assistant", content: botReply },
      ]);
    }

    setMessage("");
    setSelectedImage(null);
    setImgSrc(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
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
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleCameraClick = () => {
    setIsModalOpen(true);
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
    setImagePreview(imageSrc);
    setIsModalOpen(false);
  }, [webcamRef, setImgSrc]);

  return (
    <div className="chat-container">
      <div className="chat-box">
        {conversation.map((entry, index) => (
          <div key={index}>
            {entry.type === "image" ? (
              <div className="image-message">
                <img
                  src={entry.content}
                  alt="Uploaded"
                  className="uploaded-image"
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
      <div className="taskbar">
        <div className="buttons-container">
          <button onClick={handleCameraClick} className="icon-button">
            <FontAwesomeIcon icon={faCamera} />
          </button>
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className="icon-button"
          >
            <FontAwesomeIcon icon={isRecording ? faStop : faMicrophone} />
          </button>
          <button onClick={handleImageClick} className="icon-button">
            <FontAwesomeIcon icon={faPlus} />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageInput}
            accept="image/png, image/jpeg, image/jpg, image/webp"
            className="hidden"
            capture="environment"
          />
        </div>
        <div className="input-container">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="message-input"
          />
          <button
            onClick={() => handleSendMessage(message)}
            className="arrow-button"
          >
            &#x27A4;
          </button>
        </div>
      </div>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            minScreenshotWidth={180}
            minScreenshotHeight={180}
            className="webcam"
          />
          <button onClick={capture} className="capture-button">
            Take Photo
          </button>
        </Modal>
      )}
    </div>
  );
};

export default Chat;
