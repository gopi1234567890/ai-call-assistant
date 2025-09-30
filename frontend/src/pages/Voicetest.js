import React, { useState, useRef } from "react";
import TopTabs from "../components/TopTabs";

export default function VoiceTestPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState({ transcription: "", intent: "", department: "" });
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Start recording
  const handleRecord = async () => {
    setResult({ transcription: "", intent: "", department: "" }); // clear previous result
    audioChunksRef.current = [];
    setIsRecording(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        setAudioBlob(blob);
      };
      mediaRecorderRef.current.start();
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setIsRecording(false);
    }
  };

  // Stop recording and send audio to backend
  const handleStop = async () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setLoading(true);

      // Wait a short time to ensure Blob is ready
      setTimeout(async () => {
        if (!audioBlob && audioChunksRef.current.length > 0) {
          const blob = new Blob(audioChunksRef.current, { type: "audio/wav" });
          setAudioBlob(blob);
        }

        try {
          const formData = new FormData();
          formData.append("audio", new Blob(audioChunksRef.current, { type: "audio/wav" }), "recording.wav");

          const response = await fetch("http://backend:8000/test-intent", {
            method: "POST",
            body: formData,
          });

          if (response.ok) {
            const data = await response.json();
            setResult({
              transcription: data.transcription || "",
              intent: data.intent || "",
              department: data.department || "",
            });
          } else {
            console.error("Backend error:", response.statusText);
            setResult({ transcription: "Error processing audio", intent: "", department: "" });
          }
        } catch (err) {
          console.error("Error sending audio:", err);
          setResult({ transcription: "Error sending audio", intent: "", department: "" });
        } finally {
          setLoading(false);
        }
      }, 500);
    }
  };

  return (
    <div>
      <TopTabs />
      <div className="pt-20 px-4 flex flex-col items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6 flex flex-col items-center gap-4">
          <h2 className="text-2xl font-semibold mb-2">Voice Test</h2>
          <p className="text-gray-600 text-sm text-center">
            Record your voice and see how our AI detects the intent and routes it to the correct department.
          </p>

          <div className="flex gap-4 mt-4">
            <button
              onClick={handleRecord}
              disabled={isRecording}
              className={`px-4 py-2 rounded font-medium text-white ${
                isRecording ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
              }`}
            >
              Record
            </button>
            <button
              onClick={handleStop}
              disabled={!isRecording}
              className={`px-4 py-2 rounded font-medium text-white ${
                !isRecording ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
              }`}
            >
              Stop
            </button>
          </div>

          {loading && <p className="text-gray-500 mt-2">Processing audio...</p>}

          {result.transcription && (
            <div className="mt-4 w-full">
              <h3 className="font-medium mb-1">Transcription:</h3>
              <p className="border border-gray-300 rounded px-2 py-1 bg-gray-50">{result.transcription}</p>

              <h3 className="font-medium mt-2 mb-1">Detected Intent:</h3>
              <p className="border border-gray-300 rounded px-2 py-1 bg-gray-50">{result.intent}</p>

              <h3 className="font-medium mt-2 mb-1">Department Number:</h3>
              <p className="border border-gray-300 rounded px-2 py-1 bg-gray-50">{result.department}</p>
            </div>
          )}

          {/* Optional: play recorded audio */}
          {audioBlob && (
            <audio controls className="mt-4 w-full">
              <source src={URL.createObjectURL(audioBlob)} type="audio/wav" />
              Your browser does not support the audio element.
            </audio>
          )}
        </div>
      </div>
    </div>
  );
}
