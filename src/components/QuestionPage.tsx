import {
  Button,
  Card,
  Flex,
  Radio,
  RadioGroupField,
  Text,
} from "@aws-amplify/ui-react";
import { useRef } from "react";
import { useTimer } from "react-timer-hook";
import { useEffect, useState } from "react";
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";


const client = generateClient<Schema>();

export default function QuestionPage() {
  const location = useLocation();
  const questionfilter = location.state;
  const [question, setQuestions] = useState<Array<Schema["MCQDB"]["type"]>>([]);
  const [index, setIndex] = useState(0);
  const { seconds, minutes, hours } = useTimer({
    expiryTimestamp: getExpiryTimestamp(),
    onExpire: () => {console.warn("onExpire called");givescore()},
  });
  //const [response, setResponse] = useState<{ response: string, qNo: number }[]>([]);
  const [value, setValue] = useState("");
  const [prevbuttonstate, setprevbuttonstate] = useState(false);
  const [nextbuttonstate, setnextbuttonstate] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      let filterMembers = questionfilter.map(
        (item: { section: string; topic: string }) =>
          JSON.parse(
            `{"${"topic"}":{"eq":"${item.section + "|" + item.topic}"}}`
          )
      );
      const { data: items } = await client.models.MCQDB.list({
        filter: { or: filterMembers },
      });
      setQuestions(items);
    };

    fetchData();
  }, []);

  const responseRef = useRef<Map<string, string>>(new Map());

  useEffect(() => {
    if (index === 0) {
      setprevbuttonstate(true);
      setnextbuttonstate(false);
    } else if (index === question.length - 1) {
      setprevbuttonstate(false);
      setnextbuttonstate(true);
    } else {
      setprevbuttonstate(false);
      setnextbuttonstate(false);
    }
  }, [index]);

  function getExpiryTimestamp() {
    const time = new Date();
    time.setSeconds(time.getSeconds() + 1800); // 10 minutes timer
    return time;
  }

  function givescore() {
    let score = 0;
    let scoreobj = new Map();
    let index1 = 0;
    const updateMap = (
      map: Map<[string, string], number[]>,
      key: [string, string],
      valueToAdd: number
    ) => {
      if (map.has(key)) {
        map.set(key, [...(map.get(key) || []), valueToAdd]);
      } else {
        map.set(key, [valueToAdd]);
      }
    };


    question.forEach(() => {
      if (responseRef.current.has(index1.toString())) {
        if (
          responseRef.current.get(index1.toString()) ===
          "option" + question[index1].answer
        ) {
          updateMap(
            scoreobj,
            [question[index1].topic || "", question[index1].difficulty || ""],
            3
          );
          score += 3;
        } else {
          updateMap(
            scoreobj,
            [question[index1].topic || "", question[index1].difficulty || ""],
            -1
          );

          score -= 1;
        }
      } else {
        updateMap(
          scoreobj,
          [question[index1].topic || "", question[index1].difficulty || ""],
          0
        );

        score += 0;
      }
    });

    alert("your score is: " + score + "!!Thank you for taking test");
    const storescore = async (key: [string, string], value: number[]) => {
      await client.models.SCOREDB.create(
        {
          score: value.reduce((acc, cur) => acc + cur, 0).toString(),
          topic: key[0],
          difficulty: key[1],
          qNo: value.length.toString(),
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

  function storeAnswer(value: string, index: number) {
    //let curresponse = { response: value, qNo: index };
    console.log("response is ", responseRef.current);
    let indexstr = index.toString();
    responseRef.current.set(indexstr, value);
  }

  function handleSubmit() {
    console.log("value is", value);
    if (value === "")
      alert(
        "Select an response. To go to next question press next. for previous question press Prev"
      );
    else {
      storeAnswer(value, index);
      if (index < question.length - 1) {
        setIndex(index + 1);
        setValue("");
      } else {
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
    setValue("");
  }

  return (
    <div>
      <div>
        Time: {hours}:{minutes < 10 ? "0" + minutes : minutes}:
        {seconds < 10 ? "0" + seconds : seconds}
      </div>
      
      <br />
      {question.length !== 0 && (
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
        </Card>
      )}
      <br />
      <Flex>
        <Button onClick={handlePrevious} isDisabled={prevbuttonstate}>
          Previous
        </Button>
        <Button onClick={handleNext} isDisabled={nextbuttonstate}>
          Next
        </Button>
        <Button onClick={handleSubmit}>Submit</Button>
        <Button onClick={handleReset}>Reset</Button>
      </Flex>
    </div>
  );
}
