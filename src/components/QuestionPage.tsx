import { Button, Card, Radio, RadioGroupField, Text } from '@aws-amplify/ui-react';
import React from 'react';
import { useTimer } from 'react-timer-hook';

export default function QuestionPage() {
    const {
        seconds,
        minutes,
        hours,
        
        isRunning,
        start,
        pause,
        resume,
        restart,
    } = useTimer({ expiryTimestamp: getExpiryTimestamp(), onExpire: () => console.warn('onExpire called') });

    function getExpiryTimestamp() {
        const time = new Date();
        time.setSeconds(time.getSeconds() + 620); // 10 minutes timer
        return time;
    }
    const [value, setValue] = React.useState('');
    return (
        <div>
            <div>Time: {hours}:{minutes<10?'0'+minutes:minutes}:{seconds<10?'0'+ seconds:seconds}</div>
            <p>{isRunning ? 'Running' : 'Not running'}</p>
            <button onClick={start}>Start</button>
            <button onClick={pause}>Pause</button>
            <button onClick={resume}>Resume</button>
            <button onClick={() => {
                const time = getExpiryTimestamp(); // reset timer
                restart(time);
            }}>Restart</button>
            <Card variation="elevated">
                <Text>Elevated</Text>
                <RadioGroupField
                    legend="Option"
                    name="language"
                    variation="outlined"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                >
                    <Radio value="HTML">HTML</Radio>
                    <Radio value="CSS">CSS</Radio>
                    <Radio value="JavaScript">JavaScript</Radio>
                </RadioGroupField>
            </Card>
            <Button onClick={()=>alert("value is "+value)}>Submit</Button>
            <Button onClick={()=>setValue('')}>Reset</Button>
        </div>
    );
}


