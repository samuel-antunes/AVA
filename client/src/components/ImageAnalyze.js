import React, { useState } from "react";
import axios from 'axios';

const ImageAnalyze = () => {
    const [message, setMessage] = useState("");

    const handleResponse = async () => {
        try {
            const response = await axios.post("http://localhost:4000/imageAnalyze");
            const data = response.data;
            setMessage(data.message);

        } catch (error) {
            console.error("Error sending message:", error);
        }
    }

    return (

        <div>
            <button onClick={handleResponse}>Analyze Image</button>
            {message && <p>Message: {message}</p>}
        </div>
    );

};

export default ImageAnalyze;
