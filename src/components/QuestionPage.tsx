import { Box, Typography, Paper, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Button, IconButton, Drawer } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useTimer } from "react-timer-hook";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchAuthSession } from 'aws-amplify/auth';
//import JWTtoken from "./JWTToken";


interface Question {
  id: number;
  Question: string;
  OptionA: string;
  OptionB: string;
  OptionC: string;
  OptionD: string;
  Answer: string;
}

interface QuestionStatus {
  id: number;
  status: 'attempted' | 'notAttempted' | 'underReview';
}

const drawerWidth = 80; // Reduced from 240 to 80

export default function QuestionPage() {
  const location = useLocation();
  const { testType, topicId } = location.state as { testType: string; topicId?: string };
  const theme = useTheme();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionStatus, setQuestionStatus] = useState<QuestionStatus[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [currentIndex, setCurrentIndex] = useState(0);

  const calculateScore = async () => {
    let score = 0;
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.Answer) {
        score += 3;
      } else if (selectedAnswers[index]) {
        score -= 1;
      }
    });

    const finalScore = score; // Ensure score is not negative

    // Send score to API
    try {

      const session = await fetchAuthSession();
      const idToken = session.tokens?.idToken?.toString();
      const response = await fetch('https://euzz40iy52.execute-api.ap-south-1.amazonaws.com/dev/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          Testtype: testType,
          Score: finalScore,
          TopicID: topicId, // You need to implement this
        }),
      });

      if (!response.ok) {
        console.log(response);
        throw new Error('Failed to submit score');
      }

      alert(`Your score is: ${finalScore}`);
      navigate('/'); // Navigate to home or results page
    } catch (error) {
      console.error('Error submitting score:', error);
      alert('Failed to submit score. Please try again.');
    }
  };

  const { seconds, minutes, hours } = useTimer({
    expiryTimestamp: getExpiryTimestamp(),
    onExpire: calculateScore,
  });



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
    let isMounted = true;
    const fetchQuestions = async () => {
      try {
        let url = 'https://5lss8y7az9.execute-api.ap-south-1.amazonaws.com/dev/filter';
      
        // Add query parameters
        const params = new URLSearchParams({ Testtype: testType });
        if (testType === 'Single' && topicId) {
          params.append('TopicID', topicId);
        }
      
        url += `?${params.toString()}`;
        const session = await fetchAuthSession();
        const idToken = session.tokens?.idToken?.toString();
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`,
            // Add other headers if required
          }
        });

        if (response.ok && isMounted) {
          const result = await response.json();
          console.log(result);
          setQuestions(result);
          
          // Set default status for all questions
          const initialStatus = result.map((_: any, index: number) => ({
            id: index + 1,
            status: 'notAttempted' as const
          }));
          setQuestionStatus(initialStatus);
          localStorage.setItem('questionStatus', JSON.stringify(initialStatus));
        } else if (isMounted) {
          console.error('Error fetching data:', response.statusText);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error fetching data:', error);
        }
      }
    };

    fetchQuestions();

    // Cleanup function
    return () => {
      isMounted = false;
      resetExamState();
    };
  }, [testType, topicId]);

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
      // Prompt user before finishing exam
      const confirmSubmit = window.confirm("This is the last question. Do you want to submit the entire test?");
      if (confirmSubmit) {
        finishExam();
      }
      // If user clicks 'Cancel', do nothing and stay on the last question
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
    setQuestionStatus(prevStatus => {
      const newStatus = [...prevStatus];
      if (!newStatus[index]) {
        newStatus[index] = { id: index + 1, status: 'notAttempted' };
      }
      newStatus[index].status = status;
      localStorage.setItem('questionStatus', JSON.stringify(newStatus));
      return newStatus;
    });
  };

  
  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            padding: 1, // Reduced padding
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%', alignItems: 'center' }}>
          {questionStatus.map((question, index) => (
            <Box
              key={question.id}
              sx={{
                width: 32, // Slightly smaller circles
                height: 32,
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                backgroundColor: 
                  question.status === 'attempted' ? '#CDEDA3' :
                  question.status === 'underReview' ? '#F8E287' :
                  '#F9DEDC',
                color: '#000',
                fontWeight: 'bold',
                fontSize: '0.8rem', // Smaller font size
              }}
              onClick={() => setCurrentIndex(index)}
            >
              {index + 1}
            </Box>
          ))}
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, marginLeft: `${drawerWidth}px` }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" sx={{ flex: 1, textAlign: 'center', fontWeight: 'bold' }}>
            Time Left: {hours}:{minutes < 10 ? "0" + minutes : minutes}:
            {seconds < 10 ? "0" + seconds : seconds}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          {questionStatus[currentIndex]?.status === 'notAttempted' && (
            <Box sx={{ backgroundColor: '#F9DEDC', px: 2, py: 1, borderRadius: 2 }}>Not Attempted</Box>
          )}
          {questionStatus[currentIndex]?.status === 'attempted' && (
            <Box sx={{ backgroundColor: '#CDEDA3', px: 2, py: 1, borderRadius: 2 }}>Attempted</Box>
          )}
          {questionStatus[currentIndex]?.status === 'underReview' && (
            <Box sx={{ backgroundColor: '#F8E287', px: 2, py: 1, borderRadius: 2 }}>Review</Box>
          )}
        </Box>

        {questions.length > 0 ? (
          <Paper elevation={3} sx={{ p: 3, mb: 3, backgroundColor: '#EDEDF4', minHeight: '500px', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="body1" sx={{ mb: 3, fontSize: '18px', flex: 1 }}>
              Q. {questions[currentIndex].Question}
            </Typography>

            <FormControl component="fieldset">
              <FormLabel component="legend" sx={{ mb: 2, fontSize: '18px' }}>Options</FormLabel>
              <RadioGroup 
                aria-label="quiz" 
                name="quiz" 
                value={selectedAnswers[currentIndex] || ''}
                onChange={handleAnswerChange}
              >
                <FormControlLabel value="A" control={<Radio />} label={questions[currentIndex].OptionA} sx={{ mb: 1 }} />
                <FormControlLabel value="B" control={<Radio />} label={questions[currentIndex].OptionB} sx={{ mb: 1 }} />
                <FormControlLabel value="C" control={<Radio />} label={questions[currentIndex].OptionC} sx={{ mb: 1 }} />
                <FormControlLabel value="D" control={<Radio />} label={questions[currentIndex].OptionD} sx={{ mb: 1 }} />
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
    </Box>
  );
}