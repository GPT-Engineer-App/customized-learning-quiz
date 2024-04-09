import React, { useState } from "react";
import { Box, Heading, Text, VStack, Button, Radio, RadioGroup, useToast } from "@chakra-ui/react";

const TOPICS = ["Network Security", "Operational Procedures", "Network Operations", "Network Architecture", "Network Troubleshooting"];

const QUESTIONS = [
  {
    question: "What is the purpose of a firewall?",
    options: ["To allow all traffic", "To block unauthorized access", "To encrypt data", "To compress data"],
    answer: "To block unauthorized access",
    topic: "Network Security",
  },
  // Add more questions for each topic...
];

const Index = () => {
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [scores, setScores] = useState({});
  const [showResult, setShowResult] = useState(false);
  const toast = useToast();

  const startQuiz = () => {
    setQuizStarted(true);
    setScores(TOPICS.reduce((acc, topic) => ({ ...acc, [topic]: 0 }), {}));
  };

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === QUESTIONS[currentQuestion].answer) {
      setScores((prevScores) => ({
        ...prevScores,
        [QUESTIONS[currentQuestion].topic]: prevScores[QUESTIONS[currentQuestion].topic] + 1,
      }));
      toast({
        title: "Correct!",
        status: "success",
        duration: 1000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Incorrect!",
        status: "error",
        duration: 1000,
        isClosable: true,
      });
    }

    setSelectedAnswer("");
    if (currentQuestion === QUESTIONS.length - 1) {
      setShowResult(true);
    } else {
      setCurrentQuestion((prevQuestion) => prevQuestion + 1);
    }
  };

  const restartQuiz = () => {
    setQuizStarted(false);
    setCurrentQuestion(0);
    setSelectedAnswer("");
    setScores({});
    setShowResult(false);
  };

  const renderCustomizedMaterial = () => {
    const weakestTopic = Object.entries(scores).sort(([, a], [, b]) => a - b)[0][0];

    return (
      <Box>
        <Heading size="xl" mb={4}>
          Customized Learning Material
        </Heading>
        <Text fontSize="xl" mb={4}>
          Based on your quiz performance, we recommend focusing on: <strong>{weakestTopic}</strong>
        </Text>
        {/* Add customized learning material for the weakest topic */}
        <Button onClick={restartQuiz}>Restart Quiz</Button>
      </Box>
    );
  };

  return (
    <Box p={8}>
      <Heading size="2xl" mb={8}>
        Comptia Course
      </Heading>
      {!quizStarted && (
        <VStack spacing={4} align="stretch">
          <Text fontSize="xl">Take a short quiz to customize your learning experience.</Text>
          <Button colorScheme="blue" onClick={startQuiz}>
            Start Quiz
          </Button>
        </VStack>
      )}
      {quizStarted && !showResult && (
        <Box>
          <Heading size="xl" mb={4}>
            Question {currentQuestion + 1}
          </Heading>
          <Text fontSize="xl" mb={4}>
            {QUESTIONS[currentQuestion].question}
          </Text>
          <RadioGroup value={selectedAnswer} onChange={handleAnswerSelect}>
            <VStack spacing={2} align="start">
              {QUESTIONS[currentQuestion].options.map((option, index) => (
                <Radio key={index} value={option}>
                  {option}
                </Radio>
              ))}
            </VStack>
          </RadioGroup>
          <Button mt={4} colorScheme="blue" onClick={handleNextQuestion} isDisabled={!selectedAnswer}>
            {currentQuestion === QUESTIONS.length - 1 ? "Finish" : "Next"}
          </Button>
        </Box>
      )}
      {showResult && renderCustomizedMaterial()}
    </Box>
  );
};

export default Index;
