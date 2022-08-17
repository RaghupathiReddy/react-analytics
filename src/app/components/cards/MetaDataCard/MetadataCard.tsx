import { AgGridReact } from 'ag-grid-react';
import Card from 'react-bootstrap/Card';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
const MetadataCard = (props: MetadataCardProps) => {

    const {modelType, featureCount, dataVolume,
         useCase, independentVariableCount} = props.metaData;
    const keyColumnWidth = 260;
    const valueColumnWidth = 200;
    const tableWidth = keyColumnWidth + valueColumnWidth;
    const rowData=[
        {key:'Type',value:modelType},
        {key:'Number of Features',value:featureCount},
        {key:'Number of Indepedent Variables',value:independentVariableCount},
        {key:'Data Volume',value:dataVolume},
        {key:'Industry Use Case',value: useCase},
    ]
    const columnDefs=[
        {
            field: 'key',
            width:keyColumnWidth,
            cellStyle: {fontWeight: 'bold'}
          },
          {
            field: 'value',
            width:valueColumnWidth,
          },
    ];
    return (
        <Card >
            <Card.Body>
                <Card.Title className="text-center"> <h3>Project Metadata</h3> </Card.Title>
                <div className="d-flex justify-content-center mt-10">
                    <div className='ag-theme-alpha' style={{height:150, width:tableWidth}}>
                        <AgGridReact headerHeight={0} 
                        rowData={rowData}
                        columnDefs={columnDefs}/>
                    </div>
                </div>
            </Card.Body>
        </Card> 
    )
}

export default MetadataCard;

interface MetadataCardProps  {
    metaData: {
        modelType: string;
        featureCount: number;
        dataVolume: number;
        useCase: string;
        independentVariableCount: number;
      }
}