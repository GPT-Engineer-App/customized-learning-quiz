import React, { useState } from "react";
import { Box, Heading, Text, VStack, Button, Radio, RadioGroup, useToast, Grid, GridItem, Textarea } from "@chakra-ui/react";

const TOPICS = ["Network Security", "Operational Procedures", "Network Operations", "Network Architecture", "Network Troubleshooting"];

const QUESTIONS = [
  {
    question: "What is the purpose of a firewall?",
    options: ["To allow all traffic", "To block unauthorized access", "To encrypt data", "To compress data"],
    answer: "To block unauthorized access",
    topic: "Network Security",
    difficulty: "basic",
  },
  {
    question: "What is the difference between a public and private IP address?",
    options: ["Public IP addresses are used within a network, private IP addresses are used on the Internet", "Private IP addresses are used within a network, public IP addresses are used on the Internet", "There is no difference, they are interchangeable", "Public IP addresses are more secure than private IP addresses"],
    answer: "Private IP addresses are used within a network, public IP addresses are used on the Internet",
    topic: "Network Architecture",
    difficulty: "intermediate",
  },
  {
    question: "What is the purpose of ARP (Address Resolution Protocol)?",
    options: ["To map IP addresses to MAC addresses", "To encrypt data transmitted over the network", "To translate domain names to IP addresses", "To route packets between networks"],
    answer: "To map IP addresses to MAC addresses",
    topic: "Network Operations",
    difficulty: "advanced",
  },
];

const Notepad = ({ isVisible }) => {
  const [note, setNote] = useState("");

  if (!isVisible) return null;

  return (
    <Box bg="white" p={4} borderRadius="md" boxShadow="md">
      <Heading size="lg" mb={2}>
        Notepad
      </Heading>
      <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Take notes here..." />
    </Box>
  );
};

const Index = () => {
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [scores, setScores] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [startLearningTopic, setStartLearningTopic] = useState(false);
  const [showNotepad, setShowNotepad] = useState(true);
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
        duration: null,
        isClosable: true,
        render: () => (
          <Box color="white" p={3} bg="red.500" borderRadius="md">
            <Text mb={2}>Incorrect!</Text>
            <Button size="sm" onClick={() => handleStartLearningTopic()}>
              Learn More
            </Button>
          </Box>
        ),
      });
    }

    setSelectedAnswer("");
    if (!startLearningTopic) {
      if (currentQuestion === QUESTIONS.length - 1) {
        setShowResult(true);
      } else {
        setCurrentQuestion((prevQuestion) => prevQuestion + 1);
      }
    }
  };

  const handleStartLearningTopic = () => {
    setStartLearningTopic(true);
  };

  const restartQuiz = () => {
    setQuizStarted(false);
    setCurrentQuestion(0);
    setSelectedAnswer("");
    setScores({});
    setShowResult(false);
  };

  const renderCustomizedMaterial = () => {
    const scoresByDifficulty = QUESTIONS.reduce(
      (acc, question) => {
        const { topic, difficulty } = question;
        acc[difficulty][topic] = (acc[difficulty][topic] || 0) + (selectedAnswer === question.answer ? 1 : 0);
        return acc;
      },
      { basic: {}, intermediate: {}, advanced: {} },
    );

    const weakestTopic = Object.entries(scores).sort(([, a], [, b]) => a - b)[0][0];
    const weakestDifficulty = Object.entries(scoresByDifficulty).sort(([, a], [, b]) => Object.values(a).reduce((sum, score) => sum + score, 0) - Object.values(b).reduce((sum, score) => sum + score, 0))[0][0];

    return (
      <Box>
        <Heading size="xl" mb={4}>
          Customized Learning Material
        </Heading>
        <Text fontSize="xl" mb={4}>
          Based on your quiz performance, we recommend focusing on: <strong>{weakestTopic}</strong> at the <strong>{weakestDifficulty}</strong> level.
        </Text>
        {}
        <Button onClick={restartQuiz}>Restart Quiz</Button>
      </Box>
    );
  };

  return (
    <Box p={8} minHeight="100vh" bgGradient="linear(to-br, blue.400, teal.400)">
      <Heading size="2xl" mb={8} textAlign="center">
        Comptia Course
      </Heading>
      <Grid templateColumns="1fr 300px" gap={8}>
        <GridItem>
          {!quizStarted && (
            <VStack spacing={4} align="stretch" bg="white" p={8} borderRadius="md" boxShadow="lg">
              <Text fontSize="xl">Take a short quiz to customize your learning experience.</Text>
              <Button colorScheme="blue" onClick={startQuiz}>
                Start Quiz
              </Button>
            </VStack>
          )}
          {quizStarted && !showResult && (
            <Box bg="white" p={8} borderRadius="md" boxShadow="lg">
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
          {showResult && (
            <Box bg="white" p={8} borderRadius="md" boxShadow="lg">
              {renderCustomizedMaterial()}
            </Box>
          )}
          {startLearningTopic && (
            <Box bg="white" p={8} borderRadius="md" boxShadow="lg">
              <Heading size="xl" mb={4}>
                Learning Topic: {QUESTIONS[currentQuestion].topic}
              </Heading>
              <Text fontSize="xl" mb={4}>
                Here you can provide learning material related to the topic of the question the user answered incorrectly.
              </Text>
              <Button onClick={() => setStartLearningTopic(false)}>Continue Quiz</Button>
            </Box>
          )}
        </GridItem>
        <GridItem>
          <Notepad isVisible={showNotepad} />
        </GridItem>
      </Grid>

      {showResult && renderCustomizedMaterial()}
      {startLearningTopic && (
        <Box>
          <Heading size="xl" mb={4}>
            Learning Topic: {QUESTIONS[currentQuestion].topic}
          </Heading>
          <Text fontSize="xl" mb={4}>
            Here you can provide learning material related to the topic of the question the user answered incorrectly.
          </Text>
          <Button onClick={() => setStartLearningTopic(false)}>Continue Quiz</Button>
        </Box>
      )}
    </Box>
  );
};

export default Index;
