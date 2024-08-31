import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import '@aws-amplify/ui-react/styles.css';
import { useState, useEffect } from "react";
//import { TableComponent } from "./TableComponent";

import { useNavigate } from 'react-router-dom';
const client = generateClient<Schema>();

import { Box, Container, LinearProgress, Typography, RadioGroup, Radio, FormControlLabel, Button, Select, MenuItem, InputLabel, FormControl } from '@mui/material';

export function TestPage() {
    const [testType, setTestType] = useState('mix');
    const [section, setSection] = useState('');
    const [topic, setTopic] = useState('');
    const [progress, setProgress] = useState(0);
    const navigate = useNavigate();

    const [tests, setTests] = useState<Array<Schema["TOPICDB"]["type"]>>([]);
    //const [selection, setSelection] = useState<{id:string , section: string, topic: string }[]>([]);
    {/*const navigateToNewPath = () => {
        navigate('/exam', {state: selection});
    };*/}

    useEffect(() => {
        client.models.TOPICDB.observeQuery().subscribe({
            next: (data) => setTests([...data.items]),
        });
    }, []);

    const handleSubmit = () => {
        if (testType === 'single' && (section === '' || topic === '')) {
            alert("Please select a section and topic for single test.");
            return;
        }
        setProgress(100);
        setTimeout(() => {
            navigate('/exam', { 
                state: { 
                    testType, 
                    topic: testType === 'single' ? topic : null 
                } 
            });
        }, 1000);
    };

    /*function handleData(id:String){
        setSelection(section => section.filter(item=> item.id!==id));
    }*/

    return (
        <Container maxWidth="sm">
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh">
                <RadioGroup
                    value={testType}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTestType(e.target.value)}
                >
                    <FormControlLabel value="mix" control={<Radio />} label="Mix Test" />
                    <FormControlLabel value="single" control={<Radio />} label="Single Test" />
                </RadioGroup>

                {testType === 'single' && (
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
                                {tests.filter((test) => test.Section === section).map((test) => test.Topic ?? 'error topic').map((option) => (
                                    <MenuItem key={option} value={option}>{option}</MenuItem>
                                ))}
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