import { useState, useRef } from "react";

export default function Voicetest() {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [transcription, setTranscription] = useState("");
  const [intent, setIntent] = useState("");
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  // Start recording
  const startRecording = async () => {
    setRecording(true);
    audioChunksRef.current = [];
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    mediaRecorderRef.current.ondataavailable = (e) => {
      if (e.data.size > 0) audioChunksRef.current.push(e.data);
    };
    mediaRecorderRef.current.start();
  };

  // Stop recording and send to FastAPI
  const stopRecording = () => {
    setRecording(false);
    mediaRecorderRef.current.stop();
    mediaRecorderRef.current.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioURL(audioUrl);

      // Send audio to FastAPI
      const formData = new FormData();
      formData.append("file", audioBlob, "recording.webm");

      try {
        const response = await fetch("${API_BASE_URL}/testaudio/testaudio", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        setTranscription(data.transcription || "N/A");
        setIntent(data.intent || "N/A");
      } catch (err) {
        console.error("Error sending audio:", err);
      }
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <h1 className="text-3xl font-bold mb-6">Voice Test Page</h1>

      <div className="mb-4">
        {!recording && (
          <button
            className="px-4 py-2 bg-green-500 text-white rounded mr-2"
            onClick={startRecording}
          >
            Start Recording
          </button>
        )}
        {recording && (
          <button
            className="px-4 py-2 bg-red-500 text-white rounded"
            onClick={stopRecording}
          >
            Stop Recording
          </button>
        )}
      </div>

      {audioURL && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Recorded Audio</h2>
          <audio controls src={audioURL}></audio>
        </div>
      )}

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Transcription</h2>
        <p>{transcription}</p>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Intent</h2>
        <p>{intent}</p>
      </div>
    </div>
  );
}
