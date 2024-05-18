import React from "react";

const RecordButton = ({ isRecording, onStart, onStop }) => (
  <button
    onMouseDown={onStart}
    onMouseUp={onStop}
    className={`p-2 text-white rounded-md ${
      isRecording
        ? "bg-red-500 hover:bg-red-600"
        : "bg-green-500 hover:bg-green-600"
    }`}
  >
    {isRecording ? "Recording..." : "Hold to Record"}
  </button>
);

export default RecordButton;
