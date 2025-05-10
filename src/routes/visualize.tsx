import React, { useEffect, useRef, useState } from 'react';
import BreathCircle from '../components/BreathCircle';
import { URI } from '../../const';
import TimeSeriesLineChart from '../components/BreathGraph';
import CircularBarChart from '../components/CircularBarNCS';
import CompareWithCeleb from '../components/CompareWithCeleb';
import { Box, Button, Input, VStack } from "@chakra-ui/react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Text,
} from "@chakra-ui/react";

const ResultPage: React.FC = () => {
  const sectionRefs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];

  const scrollToSection = (index: number) => {
    sectionRefs[index].current?.scrollIntoView({ behavior: "smooth" });
  };
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [finding, setFinding] = useState(false);
  const [highestPerson, setHighestPerson] = useState("");
  const [findingStatus, setFindingStatus] = useState<'idle' | 'loading' | 'done'>('idle');

  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [vectors, setVectors] = useState<number[][]>([[]]);
  const [spectrogram, setSpectrogram] = useState<number[][]>([[]]);

  const [targetUser, setTargetUser] = useState('');
  const [comparisonResult, setComparisonResult] = useState<number>(0);
  const [compareStatus, setCompareStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  const userName = localStorage.getItem('userName') ?? 'unknown';

  const fetchSpec = async () => {
    try {
      const res = await fetch(`${URI}spectrogram?name=${encodeURIComponent(userName)}`)
      const spec = await res.json();
      setSpectrogram(spec);
      setStatus('ready');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  }

  const [celebName, setCelebName] = useState('차은우');
  const [celebSimilarity, setCelebSimilarity] = useState(0.5);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const res = await fetch(`${URI}result?name=${encodeURIComponent(userName)}`);
        const data = await res.json();
        setVectors(data.vectors);
        setStatus('ready');
        setCelebName(data.similar_celeb["name"]);
        setCelebSimilarity(data.similar_celeb["cos_sim"]);
      } catch (err) {
        console.error(err);
        setStatus('error');
      }
    };

    fetchImage();
    fetchSpec();
  }, [userName]);




  // const handleCompare = async () => {
  //   if (!targetUser.trim()) return;
  //   setCompareStatus('loading');
  //   try {
  //     const res = await fetch(
  //       `/api/compare?name=${encodeURIComponent(userName)}&target=${encodeURIComponent(targetUser)}`
  //     );
  //     const data = await res.json();
  //     setComparisonResult(data.result);
  //     setCompareStatus('done');
  //   } catch (err) {
  //     console.error(err);
  //     setCompareStatus('error');
  //   }
  // };

  if (status === 'loading') {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500 animate-pulse">
        Loading your result...
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="h-screen flex items-center justify-center text-red-500">
        Failed to load result image.
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!targetUser.trim()) {
      setError("그대의 이름을 알려줘요!");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const response = await fetch(`${URI}compare?name=${encodeURIComponent(userName)}&target=${encodeURIComponent(targetUser)}`);
      const data = await response.json();

      if (response.status === 404) {
        setError("그대를 찾을 수 없어요...");
      } else {
        // handle success (e.g., store user or navigate)
        console.log("User found:", data);
        setComparisonResult(data.cos_sim);
        setCompareStatus('done');
      }
    } catch (err) {
      setError("Error fetching user");
    } finally {
      setLoading(false);
    }
  };

  const handleFind = async () => {
    setFinding(true);
    try {
      const res = await fetch(`${URI}compareall?name=${encodeURIComponent(userName)}`);
      const data = await res.json();
      
      const items = Object.keys(data.list_cos_sim).map(function(key) {
        return [key, data.list_cos_sim[key]];
      });
      items.sort(function(first, second) {
        return second[1] - first[1];
      });
      setHighestPerson(items[0][0]);
      setFinding(false);
      setFindingStatus('done');
    } catch (err) {
      console.error(err);
      setFinding(false);
    }
  }

  // let vectors: number[][] = [
  //   [0.12, 0.4, 0.78, 0.05, 0.91, 0],
  //   [0.14, 0.5, 0.77, 0.06, 0.90, 0.1],
  //   [0.13, 0.6, 0.76, 0.08, 0.88, 0.2],
  //   [0.15, 0.5, 0.74, 0.07, 0.87, 0.3],
  //   [0.16, 0.4, 0.75, 0.06, 0.89, 0.4],
  //   [0.18, 0.3, 0.76, 0.05, 0.90, 0.5],
  //   [0.19, 0.2, 0.78, 0.04, 0.91, 0.6],
  //   [0.20, 0.3, 0.79, 0.06, 0.92, 0.7],
  //   [0.19, 0.4, 0.81, 0.07, 0.91, 0.8],
  //   [0.21, 0.5, 0.82, 0.08, 0.90, 0.9]
  // ];

  const onClose = () => {
        setShowModal(false);
    };
  

  return (
    <Box
      height="400vh"
      width="100vw"
      scrollSnapType="y mandatory"
      overflow="hidden"
      position="relative"
    >

      <TimeSeriesLineChart data={vectors}></TimeSeriesLineChart>

      <BreathCircle vectors={vectors}></BreathCircle>
      <Box
        key={0}
        ref={sectionRefs[0]}
        height="100vh"
        width="100%"
        scrollSnapAlign="start"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        bg={`gray.${(0 + 1) * 200}`}
      >
        <Text fontSize="5xl" mb={6}>결과 시각화</Text>
        <Button
          key={1}
          onClick={() => scrollToSection(1)}
          colorScheme={"gray"}
        >
          상세 결과 보기
        </Button>
        <Button onClick={() => setShowModal(true)}>이게 뭐죠...?</Button>
        <Modal isOpen={showModal} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader textAlign="center">저의 숨소리가 어떻게 분석되나요?</ModalHeader>
                <ModalBody>
                    <Text>녹음된 숨소리는 openL3 기반의 오디오 벡터화를 거쳐 숨소리의 특징을 담은 벡터로 변환됩니다. 여러분의 숨소리는 log-mel spectrogram으로 변환되고 openL3 기반의 신경망을 거쳐 512 차원의 벡터가 됩니다. 이 벡터들끼리의 연산으로 여러분과 다른 사용자 사이의 "궁합"이 얻어지는 것이죠.</Text>
                </ModalBody>
                <ModalFooter justifyContent="flex-end">
                    <Button onClick={onClose} mr={3} colorScheme="gray">
                        확인
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
      </Box>

       <Box
        key={1}
        ref={sectionRefs[1]}
        height="100vh"
        width="100%"
        scrollSnapAlign="start"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        bg={`gray.${(0 + 1) * 200}`}
      >
        <Text fontSize="5xl" mb={6}>결과 시각화</Text>

        <CircularBarChart data={spectrogram}></CircularBarChart> 

        <Button
          key={2}
          onClick={() => scrollToSection(2)}
          colorScheme={"gray"}
        >
          상세 결과 보기
        </Button>
      </Box>      

      <Box
        key={2}
        ref={sectionRefs[2]}
        height="100vh"
        width="100%"
        scrollSnapAlign="start"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        bg={`gray.${(0 + 1) * 200}`}
      >
        <CompareWithCeleb name={celebName} src={`/${celebName}.jpg`} similarity={Math.round((celebSimilarity+1)*50)}/>
        <Button
          key={3}
          onClick={() => scrollToSection(3)}
          colorScheme={"gray"}
        >
          더보기!
        </Button>
      </Box>

      <Box
        key={3}
        ref={sectionRefs[3]}
        height="100vh"
        width="100%"
        scrollSnapAlign="start"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        bg={`gray.${(0 + 1) * 200}`}
      >
        <Text fontSize="5xl" mb={6}>나는 <Text as="span" fontWeight="bold">그대</Text>의 <Text as="span" fontWeight="bold" color="purple.500">숨결</Text>을 느낄 수 있어요</Text>
        <VStack spacing={4}>
          <Input
            placeholder="그대의 이름은?"
            value={targetUser}
            onChange={(e) => setTargetUser(e.target.value)}
            isInvalid={!!error}
          />
          {error && <Text color="red.500">{error}</Text>}
          <Button onClick={handleSubmit} isLoading={loading} colorScheme="blue" disabled={loading}>
            알아보기
          </Button>
          {compareStatus === 'done' && (
            <Text fontSize="lg" textAlign="center">
              <Text as="span" fontWeight="bold" color="purple.500">{targetUser}</Text>와의 숨소리는 <Text as="span" fontWeight="bold" color="purple.500">{Math.round(comparisonResult * 50 + 50)}%</Text>만큼 비슷합니다!
            </Text>
          )}
        </VStack>
        
        <Button
          key={4}
          onClick={() => scrollToSection(4)}
          colorScheme={"gray"}
        >
          더보기!
        </Button>
      </Box>

      <Box
        key={4}
        ref={sectionRefs[4]}
        height="100vh"
        width="100%"
        scrollSnapAlign="start"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        bg={`gray.${(0 + 1) * 200}`}
      >
        <Text fontSize="5xl" mb={6}>나는 누구와 궁합이 최고?</Text>
        <Button onClick={handleFind} isLoading={finding} colorScheme="blue" disabled={finding}>
          알아보기
        </Button>
        {findingStatus === 'done' && (
          <Text fontSize="lg" textAlign="center">
            <Text as="span" fontWeight="bold" color="purple.500">{highestPerson}</Text>
          </Text>
        )}
        <Button
          key={0}
          onClick={() => scrollToSection(0)}
          colorScheme={"gray"}
        >
          처음으로
        </Button>
      </Box>
    </Box>
  );
};

export default ResultPage;
