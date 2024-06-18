import { Button, Card, Flex, Radio, RadioGroupField, Text } from '@aws-amplify/ui-react';
import  { useRef } from 'react';
import { useTimer } from 'react-timer-hook';
import { useEffect, useState } from "react";
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useNavigate } from 'react-router-dom';
// import { Button, Flex,useTheme } from '@aws-amplify/ui-react';
// import '@aws-amplify/ui-react/styles.css';
const client = generateClient<Schema>();


export default function QuestionPage() {

    const [question, setQuestions] = useState<Array<Schema["MCQDB"]["type"]>>([]);
    const [index, setIndex] = useState(0);
    const {
        seconds,
        minutes,
        hours,
    } = useTimer({ expiryTimestamp: getExpiryTimestamp(), onExpire: () => console.warn('onExpire called') });
    //const [response, setResponse] = useState<{ response: string, qNo: number }[]>([]);
    const [value, setValue] = useState('');
    const [prevbuttonstate, setprevbuttonstate] = useState(false);
    const [nextbuttonstate, setnextbuttonstate] = useState(false);
    const navigate = useNavigate();
    

    useEffect(() => {
        client.models.MCQDB.observeQuery().subscribe({
            next: (data) => setQuestions([...data.items]),
        });
    }, []);
    const responseRef = useRef<Map<string, string>>(new Map());

    useEffect(() => {
        if (index === 0) {
            setprevbuttonstate(true);
            setnextbuttonstate(false);
        }
        else if (index === question.length - 1) {
            setprevbuttonstate(false);
            setnextbuttonstate(true);
        }
        else {
            setprevbuttonstate(false);
            setnextbuttonstate(false);
        }

    }, [index]);

    function getExpiryTimestamp() {
        const time = new Date();
        time.setSeconds(time.getSeconds() + 1800); // 10 minutes timer
        return time;
    }

    function givescore()
    {
        let score =0;
        let index1=0;
        question.forEach(() => {
            if (responseRef.current.has(index1.toString())) {
                if ((responseRef.current.get(index1.toString())) === "option"+question[index1].answer) {
                    score += 3;
                } else {
                    score -= 1;
                }
            } else {
                score += 0;
            }
        });
        alert('your score is: '+ score);
        navigate('/');

    }
    function storeAnswer(value: string, index: number) {
        //let curresponse = { response: value, qNo: index };
        console.log("response is ", responseRef.current);
        let indexstr = index.toString();
        responseRef.current.set(indexstr, value);
    }

    function handleSubmit() {
        console.log("value is", value);
        if (value === '')
            alert('Select an response. To go to next question press next. for previous question press Prev')
        else {
            storeAnswer(value, index);
            if(index< question.length-1)
            {
                setIndex(index + 1);
                setValue('');
            }
            else
            {
                alert("Do you want to review or finish the test?");
                givescore();
            }
        }
    }

    function handlePrevious() {
        setIndex(index - 1);

    }

    function handleNext() {

        setIndex(index + 1);
    }

    function handleReset() {
        setValue('');
    }



    return (
        <div>
            <div>Time: {hours}:{minutes < 10 ? '0' + minutes : minutes}:{seconds < 10 ? '0' + seconds : seconds}</div>
            {/* <p>{isRunning ? 'Running' : 'Not running'}</p>
            <button onClick={start}>Start</button>
            <button onClick={pause}>Pause</button>
            <button onClick={resume}>Resume</button> */}
            {/* <button onClick={() => {
                const time = getExpiryTimestamp(); // reset timer
                restart(time);
            }}>Restart</button> */}
            <br />
            {question.length !== 0 &&
                <Card variation="elevated">
                    <Text>{question[index].question}</Text>
                    <RadioGroupField
                        legend="Option"
                        name="language"
                        variation="outlined"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                    >
                        <Radio value="optiona">{question[index].optiona}</Radio>
                        <Radio value="optionb">{question[index].optionb}</Radio>
                        <Radio value="optionc">{question[index].optionc}</Radio>
                        <Radio value="optiond">{question[index].optiond}</Radio>
                    </RadioGroupField>
                </Card>}
            <br />
            <Flex>
                <Button onClick={handlePrevious} isDisabled={prevbuttonstate}>Previous</Button>
                <Button onClick={handleNext} isDisabled={nextbuttonstate}>Next</Button>
                <Button onClick={handleSubmit}>Submit</Button>
                <Button onClick={handleReset}>Reset</Button>
            </Flex>
        </div>
    );
}


