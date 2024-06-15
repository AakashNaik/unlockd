


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



export function ScorePage(){
    

    return(<>
       <p>Welcome! to the Score</p>
    
    </>)

}