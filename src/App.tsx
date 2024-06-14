// import { useEffect, useState } from "react";
// import type { Schema } from "../amplify/data/resource";
// import { generateClient } from "aws-amplify/data";
// import { Button, Flex,useTheme } from '@aws-amplify/ui-react';
// import '@aws-amplify/ui-react/styles.css';
// const client = generateClient<Schema>();

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

//   return (
//     <>
//        <Flex justifyContent="flex-end">
//       <Button backgroundColor={tokens.colors.blue[40]}>My Score</Button>
//       <Button backgroundColor={tokens.colors.blue[40]}>Take Test</Button>
//       </Flex>
//       {/* <main>

//         <h1>My todos</h1>
//         <button onClick={createTodo}>+ new</button>
//         <ul>
//           {todos.map((todo) => (
//             <li key={todo.id}>{todo.question}</li>
//           ))}
//         </ul>
//         <div>
//           🥳 App successfully hosted. Try creating a new todo.
//           <br />
//           <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
//             Review next step of this tutorial.
//           </a>
//         </div>
//       </main> */}
//     </>

//   );
// }

// export default App;
