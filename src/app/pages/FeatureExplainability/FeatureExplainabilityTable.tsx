import React, {useMemo, useState} from 'react'
import {AgGridReact} from 'ag-grid-react'
import TableWrapper from '../../components/Tables/table-wrapper'
import { PercentageRenderer} from '../../components/Tables/table-wrapper/PercentageToTable/PercentageRenderer'
import { ResColumnDef } from '../../Models/MatrixModels'
type FeatureExplainabilityTableProps = {
  setExplainabilityData: any
  data?: object
  tableHeader: ResColumnDef[];
  tableData: Array<object>
  setCurrentSelectedRow: (value: string) => void
  tableType: string
}
const FeatureExplainabilityTable: React.FC<FeatureExplainabilityTableProps> = (props) => {
  let {setExplainabilityData, data, tableHeader, tableData, setCurrentSelectedRow, tableType} = props
  const [gridApi, setGridApi] = useState<any>()

  const [textToFilter, setTextToFilter] = useState<string>('')
  const containerStyle = useMemo(() => ({width: '100%', height: '100%'}), [])

  const sortingTable = useMemo(() => ({sortable: true}), [])

  function onGridReady(columnValue: any) {
    setGridApi(columnValue.api)
    if (tableType === 'occurenceTable') columnValue.api.sizeColumnsToFit()
  }

  const onFilterTextBoxChanged = (e: any) => {
    setTextToFilter(e.target.value)
    gridApi.setQuickFilter(textToFilter)
  }

  const clearFilter = () => {
    setCurrentSelectedRow('')

    setTextToFilter('')

    gridApi.setQuickFilter('')
  }

  const resetFilter = () => {
    setExplainabilityData(data)

    setCurrentSelectedRow('')

    setTextToFilter('')

    gridApi.setQuickFilter('')
  }

  const rowSelection = 'single'

  const onRowSelection = (event: any) => {
    const selectedRow = event.api.getSelectedRows()
    const occurence = selectedRow[0].feature
    setCurrentSelectedRow(occurence)
  }

  const gridOptions = {
    rowClass: 'table-row',
  }
  return (
    <div className='card my-3 '>
      <div className='row gy-5 g-xl-8 p-5'>
        <div className='col-xxl-6'>
          {tableType === 'occurenceTable' ? (
            <button className='btn btn-primary' onClick={clearFilter}>
              Clear Filter
            </button>
          ) : (
            <button className='btn btn-primary' onClick={resetFilter}>
              Clear Filter
            </button>
          )}
        </div>
        <div className='col-xxl-6'>
          <input
            className='form-control '
            type='text'
            id='filter-text-box'
            placeholder='Filter...'
            onChange={onFilterTextBoxChanged}
            value={textToFilter}
          ></input>
        </div>
      </div>
      <div >
        <TableWrapper height={600} >
          {tableType === 'occurenceTable' ? (
            <AgGridReact
              defaultColDef={sortingTable}
              pagination={true}
              paginationPageSize={30}
              cacheBlockSize={10}
              animateRows={true}
              rowData={tableData}
              gridOptions={gridOptions}
              columnDefs={tableHeader}
              cacheQuickFilter={true}
              frameworkComponents={{
                PercentageRenderer: PercentageRenderer,
              }}
            ></AgGridReact>
          ) : (
            <AgGridReact
              
              defaultColDef={sortingTable}
              pagination={true}
              paginationPageSize={30}
              onGridReady={onGridReady}
              cacheBlockSize={10}
              animateRows={true}
              rowData={tableData}
              gridOptions={gridOptions}
              columnDefs={tableHeader}
              cacheQuickFilter={true}
              rowSelection={rowSelection}
              onSelectionChanged={onRowSelection}
            ></AgGridReact>
          )}
        </TableWrapper>
      </div>
    </div>
  )
}

export default FeatureExplainabilityTable

