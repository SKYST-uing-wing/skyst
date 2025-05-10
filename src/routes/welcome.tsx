import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Center, Heading, Input, VStack } from "@chakra-ui/react";


const WelcomeScreen: React.FC = () => {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (!name.trim()) return;
    localStorage.setItem('userName', name.trim());
    navigate('/voice_input');
  };

  return (
    <VStack h="200vh" w="100vw" overflow={'hidden'}>
      <Center h="100vh" w="100%">
        <Heading>Lovepower Calculator</Heading>
      </Center>

      <Center h="100vh" w="100%">
        <VStack spacing={6}>
          <Heading size="lg">Welcome</Heading>
          <Input
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            size="md"
            textAlign="center"
            w="16rem"
          />
          <Button colorScheme="blue" onClick={handleSubmit}>
            Continue
          </Button>
        </VStack>
      </Center>
    </VStack>
  );
};

export default WelcomeScreen;
