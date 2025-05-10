import React, { useState } from 'react';
import { useAudioRecorder } from 'react-use-audio-recorder';
import CircularWaveform from '../components/CircularWaveForm';
import { useNavigate } from 'react-router-dom';

const VoiceInput: React.FC = () => {
    const {
        startRecording,
        stopRecording,
        recordingStatus,
        recordingTime,
        getBlob,
    } = useAudioRecorder();

    const [showModal, setShowModal] = useState(false);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [audioURL, setAudioURL] = useState<string | null>(null);
    const navigate = useNavigate();



    const handleRecord = () => {
        startRecording();

        setTimeout(() => {
        stopRecording();

        setTimeout(async () => {
            const blob = await getBlob();
            setAudioBlob(blob);
            setShowModal(true);
            const url = URL.createObjectURL(blob);
            setAudioURL(url);
        }, 500);
        }, 5000); // 5-second fixed recording
    };

    const handleConfirm = async () => {
        if (!audioBlob) return;
        
        const userName = localStorage.getItem('userName') ?? 'unknown';
        const formData = new FormData();
        formData.append('file', audioBlob, `${userName}.wav`);

        try {
        const response = await fetch(`http://192.168.1.253:8080/upload-mp3?name=${encodeURIComponent(userName)}`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) throw new Error('Upload failed');

        console.log('Upload successful');
        navigate('/visualize'); // Redirect after confirmation
        } catch (error) {
        console.error('Upload error:', error);
        }
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
                <CircularWaveform />
            </div>
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style={{ zIndex: 1000, position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", backgroundColor: 'rgba(0, 0, 0, 0.8)'}}>
                <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md space-y-4 text-center">
                    <h2 className="text-xl font-semibold">Review Your Recording</h2>

                    <audio controls src={audioURL as string} className="w-full" />

                    <div className="flex justify-end space-x-4 mt-4">
                    <button
                        onClick={() => {setShowModal(false); setAudioBlob(null); setAudioURL(null);}}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Confirm & Continue
                    </button>
                    </div>
                </div>
                </div>
            )}
        </div>
    );
};

export default VoiceInput;
