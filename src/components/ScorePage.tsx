// function App() {
//   const [todos, setTodos] = useState<Array<Schema["MCQDB"]["type"]>>([]);
//   const { tokens } = useTheme();

//   useEffect(() => {
//     client.models.MCQDB.observeQuery().subscribe({
//       next: (data) => setTodos([...data.items]),
//     });
//   }, []);

//   function createTodo() {
//     client.models.MCQDB.create({ question: window.prompt("Todo content") });
//   }

import {
    generateClient
} from 'aws-amplify/data';
import {
    data,
    type Schema
} from '../../amplify/data/resource'; // Path to your backend resource definition
import {
    useEffect,
    useState
} from 'react';

const client = generateClient<Schema>();

export function ScorePage() {

    //const [score, setScores] = useState<{score: string|null}[]>([]);
    useEffect(() => {

        const storescore = async () => {
            const {           
                data: scores,
                
            } = await client.models.SCOREDB.list({
                // ID,
                // score: a.string(),
                // topic: a.string(),
                // difficulty: a.string(),
            })
            console.log(scores);
        }
        storescore();
    }, []);



    return ( <>
        <p> Welcome to the Score!</p>
        </>)

    }