import React from 'react';
import { useAudioRecorder } from 'react-use-audio-recorder';
import CircularWaveform from '../components/CircularWaveForm';

const AudioRecorderWithUpload: React.FC = () => {
  const {
    startRecording,
    stopRecording,
    recordingStatus,
    recordingTime,
    getBlob,
  } = useAudioRecorder();

  const uploadAudio = async () => {

    const recordingBlob = getBlob();
    const formData = new FormData();
    formData.append("file", recordingBlob, "recording.webm");
    console.log("Uploading audio...");

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");
      console.log("Upload successful");
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  const handleRecord = () => {
    startRecording();
    setTimeout(() => {
      console.log("Stopping recording...");
      stopRecording();
      setTimeout(uploadAudio, 500); // slight delay to ensure blob is ready
    }, 5000); // Record for 5 seconds
  };

  return (
    <div className="p-4 flex flex-col items-center space-y-4">
        <button
            onClick={handleRecord}
            className={`px-4 py-2 rounded ${
            recordingStatus === "recording" ? "bg-red-500" : "bg-blue-500"
            } text-white`}
            style={{position: "absolute", zIndex: 1, top: "50%", left: "50%", transform: "translate(-50%, -50%)"}}
            disabled={recordingStatus === "recording"}
        >
            {recordingStatus === "recording" ? "Recording..." : "Start Recording"}
        </button>
        <div style={{position: "absolute", top: 0}}>
            <CircularWaveform recordingStatus={recordingStatus === "recording"}/>
        </div>
    </div>
  );
};

export default AudioRecorderWithUpload;
