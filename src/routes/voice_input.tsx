import React, { useState } from 'react';
import { useAudioRecorder } from 'react-use-audio-recorder';
import CircularWaveform from '../components/CircularWaveForm';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Center, HStack, Image } from '@chakra-ui/react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Heading,
    Text,
} from "@chakra-ui/react";
import logoIcon from "../assets/output.png";
import { URI } from "../../const";

const VoiceInput: React.FC = () => {
    const {
        startRecording,
        stopRecording,
        recordingStatus,
        getBlob,
    } = useAudioRecorder();

    const [showModal, setShowModal] = useState(false);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [audioURL, setAudioURL] = useState<string | null>(null);
    const navigate = useNavigate();
    const [isPressed, setIsPressed] = useState(false);


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
        setIsPressed(true);

        try {
            const response = await fetch(`${URI}upload-mp3?name=${encodeURIComponent(userName)}`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Upload failed');


            console.log('Upload successful');
            navigate('/visualize'); // Redirect after confirmation
        } catch (error) {
            console.error('Upload error:', error);
            setIsPressed(false);
        }
    };

    const onClose = () => {
        setShowModal(false);
        setAudioBlob(null);
        setAudioURL(null);
    };

    return (
        <Box w="100vw" h="100vh">
            <HStack
                position="absolute"
                top="1rem"
                left="1rem"
                spacing={2}
                alignItems="center"
                zIndex={1}
            >
                <Image src={logoIcon} alt="Logo" boxSize={12} />
                <Heading fontSize="4xl" fontWeight="bold" color={'white'}>숨: 고르기</Heading>
            </HStack>
            <Box style={{ position: "absolute", top: 0 }}>
                <CircularWaveform recordingStatus={recordingStatus === "recording"} />
            </Box>
            <Center w="100%" h="100%">
                <Button
                    onClick={handleRecord}
                    disabled={recordingStatus === "recording"}
                >
                    {recordingStatus === "recording" ? "듣는 중..." : "녹음 시작!"}
                </Button>
            </Center>
            <Center>
                <Text color={'white'} zIndex={1} position={'absolute'} top={'80%'} fontSize={22} >5초 동안 숨소리를 들려주세요...</Text>
            </Center>
            <Modal isOpen={showModal} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader textAlign="center">다시 들어 보기</ModalHeader>
                    <ModalBody>
                        <audio controls src={audioURL ?? ""} style={{ width: "100%" }} />
                    </ModalBody>
                    <ModalFooter justifyContent="flex-end">
                        <Button onClick={onClose} mr={3} colorScheme="gray">
                            취소
                        </Button>
                        <Button onClick={handleConfirm} colorScheme="blue" disabled={isPressed}>
                            {!isPressed ? "확인 & 진행!": "진행 중..."}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default VoiceInput;
