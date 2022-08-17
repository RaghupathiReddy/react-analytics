import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import TableWrapper from '../../../components/Tables/table-wrapper';

//THIS COMPONENT IS TO BE USED LATER SO TYPECHECKING IS ABSENT
const SelectedNodesTable:React.FC<any> = (props) => {

const column = [
    {
        field : 'node',
        flex:1
    },
    {
        field : 'totalClaims',
        flex:1
    },
    {
        field : 'fraudePercentage',
        flex:1
    },
    {
        field : 'criteria',
        flex:1
    },
]

  return (
    <div>
        <TableWrapper   height={'35vh'}>
            <AgGridReact 
                rowData={props.tableData}
                columnDefs={column}
            />
        </TableWrapper>
    </div>
  )
}
export default SelectedNodesTable


