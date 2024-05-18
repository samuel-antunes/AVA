import { useState, useEffect, useCallback } from "react";

export const useMediaRecorder = () => {
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    const setupMediaRecorder = async () => {
      if (typeof window !== "undefined") {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
          });
          const recorder = new MediaRecorder(stream);

          recorder.ondataavailable = (event) => {
            setAudioBlob(event.data);
          };

          setMediaRecorder(recorder);
        } catch (error) {
          console.error("Error accessing media devices.", error);
        }
      }
    };

    setupMediaRecorder();
  }, []);

  const startRecording = useCallback(() => {
    if (mediaRecorder && mediaRecorder.state === "inactive") {
      mediaRecorder.start();
      setIsRecording(true);
    }
  }, [mediaRecorder]);

  const stopRecording = useCallback(() => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  }, [mediaRecorder]);

  return {
    audioBlob,
    isRecording,
    startRecording,
    stopRecording,
  };
};
