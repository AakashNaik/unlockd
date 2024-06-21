import { generateClient } from "aws-amplify/data";
import { type Schema } from "../../amplify/data/resource"; // Path to your backend resource definition
import { useEffect, useState } from "react";
import {
  Table,
  TableCell,
  TableBody,
  TableHead,
  TableRow,
} from "@aws-amplify/ui-react";

const client = generateClient<Schema>();
type Nullable<T> = T | null;

interface scoreType {
  score: Nullable<string> | undefined;
  topic: Nullable<string> | undefined;
  difficulty: Nullable<string> | undefined;
  qNo: Nullable<string> | undefined;
  id: Nullable<string> | undefined;
  createdAt: string;
}
export function ScorePage() {
  const [score, setScores] = useState<scoreType[]>([]);
  useEffect(() => {
    const storescore = async () => {
      const { data: scores } = await client.models.SCOREDB.list({
        authMode: "userPool",
        selectionSet: ["score", "topic", "difficulty", "qNo","id","createdAt"],
      });
      console.log(scores);
      scores.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setScores([...scores]);
    };
    storescore();
  }, []);

  return (
    <>
      {score.length !== 0 ? (
        <>
        <br/>
          <Table variation="striped" highlightOnHover={true}>
            <TableHead>
              <TableRow> 
              <TableCell as="th">{"Exam Date"}</TableCell>
                <TableCell as="th">{"Topic"}</TableCell>
                <TableCell as="th">{"No. of questions"}</TableCell>
                <TableCell as="th">{"Difficulty"}</TableCell>
                <TableCell as="th">{"Score"}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {score.map((dataRow) => {
                return (
                  <TableRow
                    id={dataRow.id??"a"}
                    
                  >
                    <TableCell>{dataRow.createdAt}</TableCell>
                    <TableCell>{dataRow.topic}</TableCell>
                    <TableCell>{dataRow.qNo}</TableCell>
                    <TableCell>{dataRow.difficulty}</TableCell>
                    <TableCell>{dataRow.score}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </>
      ) : (
        <></>
      )}
    </>
  );
}
