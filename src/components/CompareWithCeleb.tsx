import { VStack, Text, Image, Heading } from "@chakra-ui/react";

type CompareWithCelebProps = {
    name: string;
    src: string;
    similarity: number;
}

export default function CompareWithCeleb({name, src, similarity}: CompareWithCelebProps) {
    return (
            <VStack spacing={4}>
                <Heading fontSize="2xl" fontWeight="bold">당신과 가장 숨소리가 비슷한 연예인은...</Heading>
                <Image src={src} alt="Celebrity" borderRadius="full" boxSize="150px" />
                <Text fontSize="lg" textAlign="center">
                    <Text as="span" fontWeight="bold" color="purple.500">{name}</Text>입니다!
                </Text>
                <Text fontSize="lg" textAlign="center">
                    당신의 숨소리와 <Text as="span" fontWeight="bold" color="purple.500">{name}</Text>의 숨소리는 <Text as="span" fontWeight="bold" color="purple.500">{similarity}%</Text> 비슷합니다!
                </Text>
            </VStack>)
}