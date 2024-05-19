import axios from "axios";

export const sendMessage = async (conversation, image) => {
  const formData = new FormData();
  formData.append("messages", JSON.stringify(conversation));
  if (image) {
    formData.append("image", image, "image.jpg");
  }

  try {
    const response = await axios.post(
      "http://localhost:4000/api/chat",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.reply;
  } catch (error) {
    console.error("Error sending message:", error);
    return null;
  }
};

export const transcribeAudio = async (audioBlob) => {
  const formData = new FormData();
  formData.append("file", audioBlob, "audio.wav");

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
    const audioUrl = URL.createObjectURL(response.data);
    return audioUrl;
  } catch (error) {
    console.error("Error generating TTS:", error);
    return null;
  }
};
