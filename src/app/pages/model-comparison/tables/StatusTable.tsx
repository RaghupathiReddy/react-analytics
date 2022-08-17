import React from 'react'
import {AgGridReact} from 'ag-grid-react'
import TableWrapper from '../../../components/Tables/table-wrapper'
import { ModelComparisonStatsData } from '../../../Models/ModelComparisonModel'
import { KTSVG } from '../../../../_metronic/helpers'
import { ColumnDef } from '../../../Models/MatrixModels'

type statusTableProps = {
  data : ModelComparisonStatsData;
  height?: number;
} 

const StatusTable:React.FC<statusTableProps> = (props) => {
  const {status} = props.data
  const {height:tableHeight} = props

  const treatmentMethodColumnWidth = 250;
  const statusColumnWidth = 65;
  const extraWidthToAvoidScrollBar = 2;

  const totalTableWidth = treatmentMethodColumnWidth + statusColumnWidth + extraWidthToAvoidScrollBar;

  const columnDefs: ColumnDef[] = [
    {
      headerName: 'Treatment Method',
      field: 'feature',
      width:treatmentMethodColumnWidth,
    },
    {
      headerName: 'Status',
      field: 'status',
      cellRenderer: "iconRenderer",
      width:statusColumnWidth
    },
  ]

  const defaultColDefs = {sortable: true}

  const iconRenderer =(prop:any)=>{ 
    return( 
    <div>
      {
        prop.value === true ? 
          <KTSVG  className='svg-icon-2x svg-icon-success' path='\media\icons\turing\acceptedTickmark.svg' /> 
        : 
          <KTSVG  className='svg-icon-2x svg-icon-danger' path='\media\icons\turing\rejectedCross.svg' />}
    </div>)
  }

  return (
        <TableWrapper height={tableHeight} width={totalTableWidth}>
        <AgGridReact
          frameworkComponents={{
            iconRenderer: iconRenderer,
          }}
          columnDefs={columnDefs}
          rowData={status}
          defaultColDef={defaultColDefs}
        />
        </TableWrapper>
  )
}

export default StatusTable
