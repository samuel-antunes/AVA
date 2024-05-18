import axios from "axios";

export const sendMessage = async (conversation) => {
  try {
    const response = await axios.post("http://localhost:4000/api/chat", {
      conversation,
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
      "http://localhost:4000/api/transcribe",
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
      "http://localhost:4000/api/tts",
      { text },
      { responseType: "blob" }
    );
    return URL.createObjectURL(response.data);
  } catch (error) {
    console.error("Error generating TTS:", error);
    return null;
  }
};
