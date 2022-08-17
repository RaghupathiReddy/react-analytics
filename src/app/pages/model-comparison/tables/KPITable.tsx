import React from 'react'
import {AgGridReact} from 'ag-grid-react'
import TableWrapper from '../../../components/Tables/table-wrapper'
import { ModelComparisonStatsData } from '../../../Models/ModelComparisonModel'
import { ResColumnDef } from '../../../Models/MatrixModels'

type kpiTableProps = {
  data: ModelComparisonStatsData
  height?: number
}

const KPITable: React.FC<kpiTableProps> = (props) => {
  const {kpi} = props.data
  const {height:tableHeight} = props;

  const columnDefs: ResColumnDef[] = [
    {
      headerName: 'KPI',
      field: 'title',
      flex: 1,
    },
    {
      headerName: 'Value',
      field: 'value',
      flex: 1,
    },
  ]

  const defaultColDefs = {sortable: true}
  return (
      <TableWrapper height={tableHeight}>
        <AgGridReact columnDefs={columnDefs} rowData={kpi} defaultColDef={defaultColDefs} />
      </TableWrapper>
  )
}

export default KPITable
