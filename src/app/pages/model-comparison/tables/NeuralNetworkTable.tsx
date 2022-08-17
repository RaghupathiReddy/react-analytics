import React from 'react'
import {AgGridReact} from 'ag-grid-react'
import TableWrapper from '../../../components/Tables/table-wrapper'
import { ModelComparisonStatsData } from '../../../Models/ModelComparisonModel'
import { ResColumnDef } from '../../../Models/MatrixModels'

type neuralNetworksTableProps = {
  data: ModelComparisonStatsData
}

const NeuralNetworkTable:React.FC<neuralNetworksTableProps> = (props) => {
  const {neuronsTable} = props.data

  const columnDefs: ResColumnDef[] = [
    {
      headerName: 'Layer',
      field: 'layer',
      flex: 1,
    },
    {
      headerName: 'Neurons Count',
      field: 'neuronsCount',
      flex: 1,
    },
    {
      headerName: 'Activation Function',
      field: 'activationFunction',
      flex: 1,
    },
  ]

  const defaultColDefs = {sortable: true, width: 210}
  return (
    <div className='col-xl-6 d-flex flex-column mt-5'>
        <TableWrapper height='20vh'>
        <AgGridReact
          columnDefs={columnDefs}
          rowData={neuronsTable}
          defaultColDef={defaultColDefs}
        />
        </TableWrapper>
    </div>
  )
}

export default NeuralNetworkTable
