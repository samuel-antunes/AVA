import axios from "axios";

export const sendMessage = async (message) => {
  try {
    const response = await axios.post("http://localhost:4000/chat", {
      message,
    });
    return response.data.reply;
  } catch (error) {
    console.error("Error sending message:", error);
    return null;
  }
};

export const transcribeAudio = async (audioBlob) => {
  const formData = new FormData();
  formData.append("file", audioBlob, "speech.mp3");

  try {
    const response = await axios.post(
      "http://localhost:4000/transcribe",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.transcription;
  } catch (error) {
    console.error("Error transcribing audio:", error);
    return null;
  }
};

export const generateTTS = async (text) => {
  try {
    const response = await axios.post(
      "http://localhost:4000/tts",
      { text },
      { responseType: "blob" }
    );
    return URL.createObjectURL(response.data);
  } catch (error) {
    console.error("Error generating TTS:", error);
    return null;
  }
};
