import { Box, Typography, Paper, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Button, IconButton, Chip } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useTimer } from "react-timer-hook";
import { useState, useEffect } from "react";
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useNavigate } from "react-router-dom";
import QuestionDrawer from "./QuestionDrawer";

interface Question {
  id: number;
  question: string;
  optiona: string;
  optionb: string;
  optionc: string;
  optiond: string;
  answer: string;
}

interface QuestionStatus {
  id: number;
  status: 'attempted' | 'notAttempted' | 'underReview';
}

const client = generateClient<Schema>();

export default function QuestionPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionStatus, setQuestionStatus] = useState<QuestionStatus[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const { seconds, minutes, hours } = useTimer({
    expiryTimestamp: getExpiryTimestamp(),
    onExpire: calculateScore,
  });

  const fetchQuestionStatus = async () => {
    const storedStatus = localStorage.getItem('questionStatus');
    if (storedStatus) {
      setQuestionStatus(JSON.parse(storedStatus));
    } else {
      try {
        const response = await fetch('/questions.json');
        const questionsData = await response.json();
        const initialStatus = questionsData.map((_: any, index: number) => ({
          id: index + 1,
          status: 'notAttempted' as const
        }));
        setQuestionStatus(initialStatus);
        localStorage.setItem('questionStatus', JSON.stringify(initialStatus));
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    }
  };

  const resetExamState = () => {
    setQuestions([]);
    setQuestionStatus([]);
    setSelectedAnswers({});
    setCurrentIndex(0);
    localStorage.removeItem('questionStatus');
    localStorage.removeItem('selectedAnswers');
  };

  const finishExam = () => {
    calculateScore();
    resetExamState();
    navigate('/'); // Navigate to home or results page
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('/questions.json');
        const questionsData = await response.json();
        setQuestions(questionsData);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
    fetchQuestionStatus();

    // Cleanup function
    return () => {
      resetExamState();
    };
  }, []);

  useEffect(() => {
    // Save state to localStorage
    localStorage.setItem('questionStatus', JSON.stringify(questionStatus));
    localStorage.setItem('selectedAnswers', JSON.stringify(selectedAnswers));
  }, [questionStatus, selectedAnswers]);

  const handleAnswerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newAnswer = event.target.value;
    setSelectedAnswers(prev => ({
      ...prev,
      [currentIndex]: newAnswer
    }));
    updateQuestionStatus(currentIndex, 'attempted');
  };

  const handleSubmit = () => {
    if (!selectedAnswers[currentIndex]) {
      alert("Please select an answer before submitting.");
      return;
    }
    
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      finishExam();
    }
  };

  const handleNavigation = (direction: 'prev' | 'next') => {
    setCurrentIndex(prevIndex => {
      if (direction === 'prev' && prevIndex > 0) {
        return prevIndex - 1;
      } else if (direction === 'next' && prevIndex < questions.length - 1) {
        return prevIndex + 1;
      }
      return prevIndex;
    });
  };

  function getExpiryTimestamp() {
    const time = new Date();
    time.setSeconds(time.getSeconds() + 1800); // 10 minutes timer
    return time;
  }

  function calculateScore() {
    let score = 0;
    let scoreobj = new Map();
    

    alert("your score is: " + score + "!!Thank you for taking test");
    const storescore = async (key: [string, string], value: number[]) => {
      await client.models.SCOREDB.create(
        {
          Score: value.reduce((acc, cur) => acc + cur, 0),
          TopicID: key[0],
          Date: value.length.toString(),
        },
        {
          authMode: "userPool",
        }
      );
    };

    scoreobj.forEach((value, key) => {
      storescore(key, value);
    });

    navigate("/");
  }

  // Function to store the user's answer
  // Parameters:
  //   value: The selected answer
  //   index: The index of the current question
  //function storeAnswer(value: string, index: number) {
    // Convert the index to a string
    //let indexstr = index.toString();
    // Store the answer in the responseRef Map
    // The key is the question index (as a string), and the value is the selected answer
    //responseRef.current.set(indexstr, value);
  //}

  const handlePrevious = () => handleNavigation('prev');
  const handleNext = () => handleNavigation('next');

  function handleReset() {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentIndex]: ''
    }));
    updateQuestionStatus(currentIndex, 'notAttempted');
  }

  const handleReview = () => {
    updateQuestionStatus(currentIndex, 'underReview');
  };

  const updateQuestionStatus = (index: number, status: 'attempted' | 'notAttempted' | 'underReview') => {
    const newStatus = [...questionStatus];
    newStatus[index].status = status;
    setQuestionStatus(newStatus);
    localStorage.setItem('questionStatus', JSON.stringify(newStatus));
  };

  
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', padding: '16px' }}>
      <Button onClick={toggleDrawer}>Open Question List</Button>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <QuestionDrawer 
          questions={questionStatus} 
          onQuestionSelect={(index) => {
            setCurrentIndex(index);
            setDrawerOpen(false);
          }}
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        />
        <Typography variant="h4" sx={{ flex: 1, textAlign: 'center', fontWeight: 'bold' }}>
          Time Left: {hours}:{minutes < 10 ? "0" + minutes : minutes}:
          {seconds < 10 ? "0" + seconds : seconds}
        </Typography>
        
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        {questionStatus[currentIndex]?.status === 'notAttempted' && (
          <Chip label="Not Attempted" variant="outlined" sx={{ backgroundColor: '#F9DEDC' }} />
        )}
        {questionStatus[currentIndex]?.status === 'attempted' && (
          <Chip label="Attempted" variant="outlined" sx={{ backgroundColor: '#CDEDA3' }} />
        )}
        {questionStatus[currentIndex]?.status === 'underReview' && (
          <Chip label="Review" variant="outlined" sx={{ backgroundColor: '#F8E287' }} />
        )}
      </Box>

      {questions.length > 0 ? (
        <Paper elevation={3} sx={{ p: 3, mb: 3, backgroundColor: '#EDEDF4', minHeight: '500px', display: 'flex', flexDirection: 'column' }}>
          <Typography variant="body1" sx={{ mb: 3, fontSize: '18px', flex: 1 }}>
            Q. {questions[currentIndex].question}
          </Typography>

          <FormControl component="fieldset">
            <FormLabel component="legend" sx={{ mb: 2, fontSize: '18px' }}>Options</FormLabel>
            <RadioGroup 
              aria-label="quiz" 
              name="quiz" 
              value={selectedAnswers[currentIndex] || ''}
              onChange={handleAnswerChange}
            >
              <FormControlLabel value="optiona" control={<Radio />} label={questions[currentIndex].optiona} sx={{ mb: 1 }} />
              <FormControlLabel value="optionb" control={<Radio />} label={questions[currentIndex].optionb} sx={{ mb: 1 }} />
              <FormControlLabel value="optionc" control={<Radio />} label={questions[currentIndex].optionc} sx={{ mb: 1 }} />
              <FormControlLabel value="optiond" control={<Radio />} label={questions[currentIndex].optiond} sx={{ mb: 1 }} />
            </RadioGroup>
          </FormControl>
        </Paper>
      ) : (
        <Typography>Loading questions...</Typography>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: '48px', paddingRight: '32px' }}>
        <Box>
          <IconButton 
            sx={{ mr: 1, bacskgroundColor: theme.palette.grey[200] }} 
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            <ArrowBack />
          </IconButton>
          <IconButton 
            sx={{ backgroundColor: theme.palette.grey[200] }} 
            onClick={handleNext}
            disabled={currentIndex === questions.length - 1}
          >
            <ArrowForward />
          </IconButton>
        </Box>
        <Box>
          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit}
            sx={{
              mr: 2,
              borderRadius: '50px',
              backgroundColor: '#82A8EC',
              color: '#001C40',
              '&:hover': {
                backgroundColor: '#6B8ED4',
              },
            }}
          >
            Submit
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={handleReset}
            sx={{
              borderRadius: '50px',
              borderColor: '#737781',
              color: '#001C40',
              '&:hover': {
                backgroundColor: '#F0F0F0',
              },
            }}
          >
            Reset
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={handleReview}
            sx={{
              borderRadius: '50px',
              borderColor: '#737781',
              color: '#001C40',
              '&:hover': {
                backgroundColor: '#F0F0F0',
              },
              ml: 2,
            }}
          >
            Review
          </Button>
        </Box>
      </Box>
    </Box>
  );
}