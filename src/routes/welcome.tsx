import React, { useRef, useState } from "react";
import { Box, Button, Input, VStack, Text, HStack, Image } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import logoIcon from "../assets/output.png";
import textIcon from "../assets/icon2.png"
import reactLogo from "../assets/react.svg"; // Add the appropriate path
import chakraLogo from "../assets/chakra-logo.png"; // Add the appropriate path

const SnapScrollComponent: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleScroll = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    localStorage.setItem("userName", name);
    navigate("/voice_input");
  };

  return (
    <Box
      ref={containerRef}
      height="200vh"
      width="100vw"
      scrollSnapType="y mandatory"
      overflow="hidden"
      position="relative"
    >
      <Box
        height="100vh"
        width="100%"
        scrollSnapAlign="start"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        pb={24}
        bg="blue.100"
        position="relative"
      >
        <VStack position="absolute" top={24}>
          <HStack spacing={3} justifyContent="center">
            <Image src={logoIcon} alt="Logo" boxSize={12} />
            <Image src={textIcon} alt="Logo" height={12} />           
          </HStack>
          <Text mt={5} fontSize="lg" textAlign="center">
            <Text as="span" fontWeight="bold">그대</Text>와 <Text as="span" fontWeight="bold" color="purple.500">호흡</Text>이 얼마나 잘 맞을까...?
          </Text>
        <Button onClick={handleScroll} colorScheme="blue" mt={15}>
          Get Started
        </Button>
        </VStack>
      </Box>

      <Box
        ref={bottomRef}
        height="100vh"
        width="100%"
        scrollSnapAlign="start"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        bg="gray.100"
      >
        <VStack spacing={4}>
          <Input
            placeholder="Enter your name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError("");
            }}
          />
          {error && <Text color="red.500">{error}</Text>}
          <Button onClick={handleSubmit} colorScheme="green">
            Submit
          </Button>
        </VStack>
        <HStack spacing={4} position="absolute" bottom={4}>
          <Text fontSize="sm">Made with</Text>
          <Image src={reactLogo} alt="React Logo" boxSize={6} />
          <Image src={chakraLogo} alt="Chakra UI Logo" boxSize={6} />
          <Text fontSize="sm">React & Chakra UI</Text>
        </HStack>
      </Box>
    </Box>
  );
};

export default SnapScrollComponent;
