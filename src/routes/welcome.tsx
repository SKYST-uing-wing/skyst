import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Heading, Input, VStack } from "@chakra-ui/react";


const WelcomeScreen: React.FC = () => {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (!name.trim()) return;
    localStorage.setItem('userName', name.trim());
    navigate('/voice_input');
  };

  return (
    <Box h="100vh" w="100vw" display="flex" alignItems="center" justifyContent="center">
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
    </Box>
  );
};

export default WelcomeScreen;
