"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophone,
  faStop,
  faPlus,
  faCamera,
  faFilePdf,
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

const Chat = ({ favoriteLanguages }) => {
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedPDF, setSelectedPDF] = useState(null);
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

    let fileToSend = null;
    let fileType = null;

    if (imgSrc) {
      const response = await fetch(imgSrc);
      const blob = await response.blob();
      fileToSend = new File([blob], "webcam.jpg", { type: "image/jpeg" });
      updatedConversation.push({
        role: "user",
        content: imgSrc,
        type: "image",
      });
      fileType = "image";
    }

    if (selectedImage) {
      fileToSend = selectedImage;
      updatedConversation.push({
        role: "user",
        content: URL.createObjectURL(selectedImage),
        type: "image",
      });
      fileType = "image";
    }

    if (selectedPDF) {
      fileToSend = selectedPDF;
      updatedConversation.push({
        role: "user",
        content: selectedPDF.name,
        type: "pdf",
      });
      fileType = "pdf";
    }

    setConversation(updatedConversation);
    setMessage("");
    setSelectedImage(null);
    setSelectedPDF(null);
    setImgSrc(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }

    const botReply = await sendMessage(
      updatedConversation,
      fileToSend,
      favoriteLanguages,
      fileType
    );
    if (botReply) {
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
    }
  };

  const handleImageInput = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    } else if (file && file.type === "application/pdf") {
      setSelectedPDF(file);
    }
  };

  const handleFileClick = () => {
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
        <h1 className="sm:text-[40px] mb-8">Chat with AVA</h1>
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
            ) : entry.type === "pdf" ? (
              <div className="pdf-message">
                <a
                  href={entry.content}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {entry.content}
                </a>
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
      {imagePreview && (
        <div className="image-preview">
          <img src={imagePreview} alt="Preview" className="uploaded-image" />
        </div>
      )}
      {selectedPDF && (
        <div className="pdf-preview">
          <a
            href={URL.createObjectURL(selectedPDF)}
            target="_blank"
            rel="noopener noreferrer"
          >
            {selectedPDF.name}
          </a>
        </div>
      )}
      <div className="taskbar flex-col md:flex-row">
        <div className="buttons-container flex md:mr-4">
          <button onClick={handleCameraClick} className="icon-button">
            <FontAwesomeIcon icon={faCamera} />
          </button>
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className="icon-button"
          >
            <FontAwesomeIcon icon={isRecording ? faStop : faMicrophone} />
          </button>
          <button onClick={handleFileClick} className="icon-button">
            <FontAwesomeIcon icon={faPlus} />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageInput}
            accept="image/png, image/jpeg, image/jpg, image/webp, application/pdf"
            className="hidden"
            capture="environment"
          />
        </div>
        <div className="input-container mt-2 md:mt-0 p-4">
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
