import {
    Table,
    TableCell,
    TableBody,
    TableHead,
    TableRow,
} from '@aws-amplify/ui-react';


interface Item {
    id: string;
    section: string;
    topic: string;
}

interface TableComponentProps {
    dataSel: Item[];
    handleData: Function;
}

export const TableComponent = ({ dataSel, handleData }: TableComponentProps) => {

    //const [data, setData] = useState(dataSel);

    return (
        <>
            {(dataSel.length !== 0) ? (<>
                <Table variation="striped" highlightOnHover={true}>
                    <TableHead><TableRow><TableCell as="th">{"Type"}</TableCell><TableCell as="th">{"Topic"}</TableCell></TableRow></TableHead>
                    <TableBody>{dataSel.map((dataRow) => { return <TableRow id= {dataRow.id} onClick={()=>handleData(dataRow.id)}><TableCell>{dataRow.section}</TableCell><TableCell>{dataRow.topic}</TableCell></TableRow> })}</TableBody>
                </Table>


            </>) : (<></>)






            }

        </>

    )

};