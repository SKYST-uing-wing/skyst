import React, { useState, useRef } from 'react';

const RECORDING_DURATION_MS = 5000; // 5 seconds

const AudioRecorder: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        uploadAudio(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Auto-stop after fixed time
      setTimeout(() => {
        mediaRecorder.stop();
        setIsRecording(false);
      }, RECORDING_DURATION_MS);
    } catch (error) {
      console.error('Microphone access denied or error:', error);
    }
  };

  const uploadAudio = async (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append('file', audioBlob, 'recording.wav');

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');
      console.log('Upload successful');
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <button
        onClick={startRecording}
        disabled={isRecording}
        className={`w-16 h-16 rounded-full bg-red-600 focus:outline-none relative
          ${isRecording ? 'animate-pulse' : 'hover:scale-110 transition-transform duration-300'}`}
        title="Record"
      >
        {isRecording && (
          <div className="absolute inset-0 border-4 border-white rounded-full animate-ping"></div>
        )}
      </button>

      {audioURL && (
        <audio controls src={audioURL} className="w-full max-w-md" />
      )}
    </div>
  );
};

export default AudioRecorder;
