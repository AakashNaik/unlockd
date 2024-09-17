//import type { Schema } from "../../amplify/data/resource";
//import { generateClient } from "aws-amplify/data";
import '@aws-amplify/ui-react/styles.css';
import { useState, useEffect } from "react";
import { fetchAuthSession } from 'aws-amplify/auth';
//import { TableComponent } from "./TableComponent";

import { useNavigate } from 'react-router-dom';
//const client = generateClient<Schema>();

import { Box, Container, LinearProgress, Typography, RadioGroup, Radio, FormControlLabel, Button, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import axios from "axios";

// Add this type definition at the top of the file
type Test = {
  Section: string;
  Topic: string;
  TopicID: string;
};

export default function TestPage() {
    const [testType, setTestType] = useState('Mix');
    const [section, setSection] = useState('');
    const [topic, setTopic] = useState('');
    const [progress, setProgress] = useState(0);
    const [tests, setTests] = useState<Test[]>([]); // Update the useState declaration
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const session = await fetchAuthSession();
            const idToken = session.tokens?.idToken?.toString();
            const response = await axios.get('https://ok937da1z6.execute-api.ap-south-1.amazonaws.com/dev/', {
                headers: {
                    Authorization: `Bearer ${idToken}`,  // Pass the JWT token
                },
            });
            setTests(response.data);
        }
        fetchData();
    }, []);

    const handleSubmit = () => {
        if (testType === 'Single' && (section === '' || topic === '')) {
            alert("Please select a section and topic for single test.");
            return;
        }
        
        let topicId = null;
        if (testType === 'Single') {
            const selectedTest = tests.find(test => test.Section === section && test.Topic === topic);
            topicId = selectedTest ? selectedTest.TopicID : null;
        }

        setProgress(100);
        setTimeout(() => {
            navigate('/exam', { 
                state: { 
                    testType,
                    topicId
                } 
            });
        }, 1000);
    };

    return (
        <Container maxWidth="sm">
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh">
                <RadioGroup
                    value={testType}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTestType(e.target.value)}
                >
                    <FormControlLabel value="mix" control={<Radio />} label="Mix Test" />
                    <FormControlLabel value="Single" control={<Radio />} label="Single Test" />
                </RadioGroup>

                {testType === 'Single' && (
                    <>
                        <FormControl fullWidth>
                            <InputLabel>Section</InputLabel>
                            <Select
                                value={section}
                                label="Section"
                                onChange={(e) => setSection(e.target.value)}
                                placeholder="Choose Section..."
                            >
                                {tests.map((test) => test.Section ?? "Section").map((option) => (
                                    <MenuItem key={option} value={option}>{option}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel>Topic</InputLabel>
                            <Select
                                value={topic}
                                label="Topic"
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="Choose Topic..."
                            >
                                {tests
                                    .filter((test) => test.Section === section)
                                    .map((test) => (
                                        <MenuItem key={test.TopicID} value={test.Topic}>{test.Topic}</MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                    </>
                )}

                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleSubmit}
                    size="small"
                    sx={{ mt: 2 }}
                >
                    Start Test
                </Button>

                {progress > 0 && (
                    <>
                        <Typography variant="body2" color="textSecondary">
                            Preparing your test...
                        </Typography>
                        <LinearProgress variant="determinate" value={progress} />
                    </>
                )}
            </Box>
        </Container>
    );
}