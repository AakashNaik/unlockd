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

// import {
//     generateClient
// } from 'aws-amplify/data';
// import type {
//     Schema
// } from '../../amplify/data/resource'; // Path to your backend resource definition
// import {
//     useEffect
// } from 'react';

// const client = generateClient<Schema>();

export function ScorePage() {


    // useEffect(() => {

    //     const storescore = async () => {
    //         const {
    //             errors,
    //             data: scores
    //         } = await client.models.SCOREDB.create({
    //             // ID,
    //             // score: a.string(),
    //             // topic: a.string(),
    //             // difficulty: a.string(),
    //         }, {
    //             authMode: 'userPool',
    //         })
    //     }
    //     storescore();
    // }, []);



    return ( <>
        <p> Welcome!to the Score </p>

        </>)

    }