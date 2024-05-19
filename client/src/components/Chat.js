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

    let imageToSend = selectedImage;
    if (imgSrc) {
      const byteString = atob(imgSrc.split(",")[1]);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      imageToSend = new Blob([ab], { type: "image/jpeg" });

      updatedConversation.push({
        role: "user",
        content: imgSrc,
        type: "image",
      });
    }

    if (selectedImage) {
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

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
    setImagePreview(imageSrc);
  }, [webcamRef, setImgSrc]);

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
      {imagePreview && (
        <div className="flex justify-end mt-2">
          <img
            src={imagePreview}
            alt="Preview"
            className="max-w-xs rounded-md"
          />
        </div>
      )}
      <div className="flex justify-between items-center mt-2">
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
        <button
          onClick={capture}
          className="ml-2 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          <FontAwesomeIcon icon={faCamera} />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageInput}
          accept="image/png, image/jpeg, image/jpg, image/webp"
          className="hidden"
        />
      </div>
      <div className="mt-5 flex flex-row items-center">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          minScreenshotWidth={180}
          minScreenshotHeight={180}
          className="rounded-lg"
        />
        {imgSrc && (
          <div className="mt-2">
            <img src={imgSrc} alt="Captured" className="max-w-xs rounded-md" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
