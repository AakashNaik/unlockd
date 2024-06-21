import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import '@aws-amplify/ui-react/styles.css';
import { useEffect, useState } from "react";
import { Button, Flex, SelectField, useTheme } from "@aws-amplify/ui-react";
import { TableComponent } from "./TableComponent";
const client = generateClient<Schema>();
import { useNavigate } from 'react-router-dom';

export function TestPage() {

    const [tests, setTests] = useState<Array<Schema["TOPICDB"]["type"]>>([]);
    const [section, setSection] = useState('')
    const [topic, setTopic] = useState('')
    const [selection, setSelection] = useState<{id:string , section: string, topic: string }[]>([]);
    const navigate = useNavigate();
    const navigateToNewPath = () => {
        
        navigate('/exam', {state: selection});
      };
    
    useEffect(() => {
        client.models.TOPICDB.observeQuery().subscribe({
            next: (data) => setTests([...data.items]),
        });
    }, []);

    const { tokens } = useTheme();

    function handleSubmit() {
        if(section==='' || topic==='')
            return;
        const isDuplicate = selection.some(item =>
            item.section === section && item.topic === topic
        );
        if (!isDuplicate)
            setSelection([...selection, {id:section+topic, section, topic }]);
        else
            alert("Already added.");
    }

    function handleData(id:String){
       
       setSelection(section => section.filter(item=> item.id!==id));
      
    }
    return (<>
       <br />
        <SelectField
            label="Section"
            placeholder="Choose Section..."
            value={section}
            onChange={(e) => setSection(e.target.value)}
            options={[... new Set(tests.map((test) => test.type ?? "Section"))]}
        ></SelectField>
        <br />
        <SelectField
            label="Topic"
            placeholder="Choose Topic..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            options={tests.filter((test) => test.type == section).map((test) => test.topic ?? 'error topic')}
        ></SelectField>
        <br></br>
        <Flex>
        <Button backgroundColor={tokens.colors.blue[40]} onClick={handleSubmit}>Submit</Button>

        <Button backgroundColor={tokens.colors.blue[40]} onClick={navigateToNewPath}>Take Test</Button>
        </Flex>
        <br></br>
        {selection.length!==0 && <TableComponent dataSel={selection} handleData={handleData}/>}
    </>)

}