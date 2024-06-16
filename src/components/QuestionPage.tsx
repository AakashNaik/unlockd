import { Button, Card, Flex, Radio, RadioGroupField, Text } from '@aws-amplify/ui-react';
import React from 'react';
import { useTimer } from 'react-timer-hook';
import { useEffect, useState } from "react";
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
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

        // isRunning,
        // start,
        // pause,
        // resume,
        // restart,
    } = useTimer({ expiryTimestamp: getExpiryTimestamp(), onExpire: () => console.warn('onExpire called') });

    useEffect(() => {
            client.models.MCQDB.observeQuery().subscribe({
              next: (data) => setQuestions([...data.items]),
            });
          }, []);

    function getExpiryTimestamp() {
        const time = new Date();
        time.setSeconds(time.getSeconds() + 1800 ); // 10 minutes timer
        return time;
    }
    const [value, setValue] = React.useState('');
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
            {question.length!==0&&
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
                    <Button onClick={() => {setIndex(index-1)}}>Previous</Button>
                <Button onClick={() => {console.log("value is", value), setIndex(index+1)}}>Submit</Button>
                <Button onClick={() => setValue('')}>Reset</Button>
            </Flex>
        </div>
    );
}


