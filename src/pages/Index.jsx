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
  {
    question: "What is the purpose of a subnet mask?",
    options: ["To identify the network portion of an IP address", "To encrypt data transmitted over the network", "To translate domain names to IP addresses", "To route packets between networks"],
    answer: "To identify the network portion of an IP address",
    topic: "Network Architecture",
    difficulty: "intermediate",
  },
  {
    question: "What is the purpose of a VLAN?",
    options: ["To segment a network into smaller logical networks", "To encrypt data transmitted over the network", "To translate domain names to IP addresses", "To route packets between networks"],
    answer: "To segment a network into smaller logical networks",
    topic: "Network Architecture",
    difficulty: "advanced",
  },
  {
    question: "What is the purpose of a DMZ?",
    options: ["To provide a secure area for public-facing servers", "To encrypt data transmitted over the network", "To translate domain names to IP addresses", "To route packets between networks"],
    answer: "To provide a secure area for public-facing servers",
    topic: "Network Security",
    difficulty: "advanced",
  },
  {
    question: "What is the purpose of a VPN?",
    options: ["To provide a secure connection over an untrusted network", "To encrypt data transmitted over the network", "To translate domain names to IP addresses", "To route packets between networks"],
    answer: "To provide a secure connection over an untrusted network",
    topic: "Network Security",
    difficulty: "intermediate",
  },
  {
    question: "What is the purpose of a load balancer?",
    options: ["To distribute traffic across multiple servers", "To encrypt data transmitted over the network", "To translate domain names to IP addresses", "To route packets between networks"],
    answer: "To distribute traffic across multiple servers",
    topic: "Network Operations",
    difficulty: "advanced",
  },
  {
    question: "What is the purpose of a proxy server?",
    options: ["To act as an intermediary between clients and servers", "To encrypt data transmitted over the network", "To translate domain names to IP addresses", "To route packets between networks"],
    answer: "To act as an intermediary between clients and servers",
    topic: "Network Security",
    difficulty: "intermediate",
  },
  {
    question: "What is the purpose of a network switch?",
    options: ["To connect devices on a network and forward data packets", "To encrypt data transmitted over the network", "To translate domain names to IP addresses", "To route packets between networks"],
    answer: "To connect devices on a network and forward data packets",
    topic: "Network Architecture",
    difficulty: "basic",
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
  const [incorrectQuestions, setIncorrectQuestions] = useState([]);
  const [quizScore, setQuizScore] = useState(0);
  const toast = useToast();

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  const [isHoveringToast, setIsHoveringToast] = useState(false);

  const handleNextQuestion = () => {
    const isCorrect = selectedAnswer === QUESTIONS[currentQuestion].answer;

    if (isCorrect) {
      setScores((prevScores) => ({
        ...prevScores,
        [QUESTIONS[currentQuestion].topic]: prevScores[QUESTIONS[currentQuestion].topic] + 1,
      }));
      toast({
        title: "Correct!",
        status: "success",
        duration: isHoveringToast ? null : 5000,
        isClosable: true,
        onMouseEnter: () => setIsHoveringToast(true),
        onMouseLeave: () => setIsHoveringToast(false),
      });
    } else {
      setIncorrectQuestions((prevIncorrectQuestions) => [...prevIncorrectQuestions, QUESTIONS[currentQuestion]]);
      toast({
        title: "Incorrect!",
        status: "error",
        duration: isHoveringToast ? null : 5000,
        isClosable: true,
        render: () => (
          <Box color="white" p={3} bg="red.500" borderRadius="md" onMouseEnter={() => setIsHoveringToast(true)} onMouseLeave={() => setIsHoveringToast(false)}>
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
        const score = Math.round((scores.reduce((sum, score) => sum + score, 0) / QUESTIONS.length) * 100);
        setQuizScore(score);
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
    setIncorrectQuestions([]);
    setQuizScore(0);
  };

  const startNextQuiz = () => {
    const newQuestions = [...incorrectQuestions, ...QUESTIONS.filter((question) => !incorrectQuestions.includes(question))].slice(0, 10);
    QUESTIONS.splice(0, QUESTIONS.length, ...newQuestions);
    restartQuiz();
    startQuiz();
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

  const shuffleQuestions = () => {
    for (let i = QUESTIONS.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [QUESTIONS[i], QUESTIONS[j]] = [QUESTIONS[j], QUESTIONS[i]];
    }
  };

  const startQuiz = () => {
    shuffleQuestions();
    setQuizStarted(true);
    setScores(TOPICS.reduce((acc, topic) => ({ ...acc, [topic]: 0 }), {}));
  };

  return (
    <Box p={8} minHeight="100vh" bgGradient="linear(to-br, blue.400, teal.400)">
      <Heading size="2xl" mb={8} textAlign="center">
        Comptia Course
      </Heading>
      <VStack spacing={8} align="center" justify="center">
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
            <Heading size="xl" mb={4}>
              Quiz Result
            </Heading>
            <Text fontSize="xl" mb={4}>
              Your score: {quizScore}%
            </Text>
            {renderCustomizedMaterial()}
            <Button mt={4} colorScheme="blue" onClick={startNextQuiz}>
              Next Quiz
            </Button>
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
        <Notepad isVisible={showNotepad} />
      </VStack>

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
