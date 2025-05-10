import React, { useRef, useState } from "react";
import { Box, Button, Input, VStack, Text, Heading } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

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
    navigate("/next-page");
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
        bg="blue.100"
      >
        <Heading>Welcome to My Page</Heading>
        <Button onClick={handleScroll} colorScheme="blue">
          Get Started
        </Button>
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
      </Box>
    </Box>
  );
};

export default SnapScrollComponent;
