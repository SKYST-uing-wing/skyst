import React, { useState } from 'react';
import { useAudioRecorder } from 'react-use-audio-recorder';
import CircularWaveform from '../components/CircularWaveForm';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Center } from '@chakra-ui/react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "@chakra-ui/react";

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

    const onClose = () => {
        setShowModal(false);
        setAudioBlob(null);
        setAudioURL(null);
    };

    return (
        <Box w="100vw" h="100vh">
            <Box style={{ position: "absolute", top: 0 }}>
                <CircularWaveform recordingStatus={recordingStatus === "recording"} />
            </Box>
            <Center w="100%" h="100%">
                <Button
                    onClick={handleRecord}
                    disabled={recordingStatus === "recording"}
                >
                    {recordingStatus === "recording" ? "Recording..." : "Start Recording"}
                </Button>
            </Center>
            <Modal isOpen={showModal} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader textAlign="center">Review Your Recording</ModalHeader>
                    <ModalBody>
                        <audio controls src={audioURL ?? ""} style={{ width: "100%" }} />
                    </ModalBody>
                    <ModalFooter justifyContent="flex-end">
                        <Button onClick={onClose} mr={3} colorScheme="gray">
                            Cancel
                        </Button>
                        <Button onClick={handleConfirm} colorScheme="blue">
                            Confirm & Continue
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default VoiceInput;
