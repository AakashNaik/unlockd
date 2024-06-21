import { generateClient } from "aws-amplify/data";
import {
  type Schema,
} from "../../amplify/data/resource"; // Path to your backend resource definition
import { useEffect, useState } from "react";

const client = generateClient<Schema>();
type Nullable<T> = T | null;

interface scoreType{

    score: Nullable<string>|undefined,
    topic: Nullable<string>|undefined,
    difficulty: Nullable<string>|undefined,
    qNo : Nullable<string>|undefined,
}
export function ScorePage() {
  const [score, setScores] = useState<scoreType[]>([]);
  useEffect(() => {
    const storescore = async () => {
      const { data: scores } = await client.models.SCOREDB.list({
        // ID,
        // score: a.string(),
        // topic: a.string(),
        // difficulty: a.string(),
        authMode: "userPool",
        selectionSet: ["score", "topic", "difficulty","qNo"],
      });
      console.log(scores);
      setScores([...scores]);
    };
    storescore();
  }, []);

  return (
    <>
      <p> Welcome to the Score!</p>
      <ul>
        {
            score.map(item=><li>{item.difficulty??''+item.topic+item.qNo+item.score}</li>)

        }

      </ul>
    </>
  );
}
