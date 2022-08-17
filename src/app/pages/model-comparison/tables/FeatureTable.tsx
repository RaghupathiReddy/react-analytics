import React from 'react'
import {AgGridReact} from 'ag-grid-react'
import TableWrapper from '../../../components/Tables/table-wrapper'
import { ModelComparisonStatsData } from '../../../Models/ModelComparisonModel'
import { ResColumnDef } from '../../../Models/MatrixModels'

type featureTableProps = {
    data : ModelComparisonStatsData
    height?: number
}

const FeatureTable:React.FC<featureTableProps> = (props) => {
  const {featureCategories} = props.data
  const {height:tableHeight} = props;

  const columnDefs: ResColumnDef[] = [
    {
      headerName: 'Feature Category',
      field: 'featureCategory',
      flex: 2, // adds twice as much width to this table since text ocuupies more space than numbers
    },
    {
      headerName: '# Features',
      field: 'featureCount',
      flex: 1
    },
    {
      headerName: 'Rank',
      field: 'rank',
      flex: 1
    },
    {
      headerName: 'Examples',
      field: 'examples',
      flex: 1
    },
  ]


  const defaultColDefs = {sortable: true}
  return (
        <TableWrapper height={tableHeight}>
        <AgGridReact
          columnDefs={columnDefs}
          rowData={featureCategories}
          defaultColDef={defaultColDefs}
        />
        </TableWrapper>
  )
}

export default FeatureTable
