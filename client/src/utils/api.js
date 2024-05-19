import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000/api";

export const generateTTS = async (text) => {
  try {
    const response = await axios.post(
      `${API_URL}/tts`,
      { text },
      {
        headers: {
          "Content-Type": "application/json",
        },
        responseType: "blob", // Ensure the response is handled as a blob
      }
    );

    // Create a URL for the blob and return it
    const audioUrl = URL.createObjectURL(
      new Blob([response.data], { type: "audio/mpeg" })
    );
    console.log(audioUrl);
    return audioUrl;
  } catch (error) {
    console.error("Error generating text-to-speech:", error);
    return null;
  }
};

export const sendMessage = async (
  conversation,
  file,
  favoriteLanguages,
  fileType
) => {
  const formData = new FormData();
  formData.append("messages", JSON.stringify(conversation));
  formData.append("favoriteLanguages", JSON.stringify(favoriteLanguages));

  if (file) {
    if (fileType === "image") {
      formData.append("image", file, "image.jpg");
    } else if (fileType === "pdf") {
      formData.append("pdf", file, "file.pdf");
    }
  }

  try {
    const response = await axios.post(`${API_URL}/chat`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.reply;
  } catch (error) {
    console.error("Error sending message:", error);
    return null;
  }
};

export const transcribeAudio = async (audioBlob) => {
  const formData = new FormData();
  formData.append("audio", audioBlob, "audio.webm");

  try {
    const response = await axios.post(`${API_URL}/transcribe`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.transcription;
  } catch (error) {
    console.error("Error transcribing audio:", error);
    return null;
  }
};
