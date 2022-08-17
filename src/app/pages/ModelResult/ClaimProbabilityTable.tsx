import React, { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import TableWrapper from "../../components/Tables/table-wrapper";
import ProgressBarRenderer from "../../components/graphs/TableProgressBar/ProgressBarRenderer";
import {Bias,Claim,TableColumnField} from "../../Models/ModelResultModel";
import "./style.scss";
import { ResColumnDef } from "../../Models/MatrixModels";
interface ClaimProbabilityTableProps {
  dataList: Claim[] | Bias[];
  tableColumns: ResColumnDef[];
  setCurrentRowValue: (value: string) => void;
  tableTitle?:string,
  setCardValue:(value: string) => void;
  height:number
}
const ClaimProbabilityTable: React.FC<ClaimProbabilityTableProps> = (props) => {
  const { dataList: data, tableColumns, setCurrentRowValue,tableTitle,setCardValue,height} = props;

  const [filterOptions, setFilterOptions] = useState<any>();
  const [textToFilter, setTextToFilter] = useState<string>("");

  const defaultColDefs = { sortable: true };

  function onGridReady(columnValue: any) {
    setFilterOptions(columnValue.api);
    if(tableTitle){
      columnValue.api.forEachNode((defaultRow:any)=> {
        defaultRow.rowIndex === 0 ? defaultRow.setSelected(true) : defaultRow.setSelected(false)
      })
    }
  }

  const onFilterTextBoxChanged = (e: any) => {
    setTextToFilter(e.target.value);
    filterOptions.setQuickFilter(textToFilter);
  };

  const resetFilter = () => {
    setTextToFilter("");
    filterOptions.setQuickFilter("");
    setCardValue("")
  };

  const gridOptions = {
    rowClass: "table-row",
  };

  const rowSelection = "single";

  const onRowSelection = (event: any) => {
    const selectedRow = event.api.getSelectedRows();
    const contribution:string= selectedRow[0].claimNo;
    setCurrentRowValue(contribution);
  };
  return (
    <div className="card ">
      <div className="row gy-5 g-xl-8 p-5">
        <div className="col-xxl-6">
          <button className="btn btn-primary" onClick={resetFilter}>
            Clear Filter
          </button>
        </div>
        <div className="col-xxl-6">
          <input
            className="form-control "
            type="text"
            id="filter-text-box"
            placeholder="Filter..."
            onChange={onFilterTextBoxChanged}
            value={textToFilter}
          ></input>
        </div>
      </div>
      <div className="bg-white p-3">
        <TableWrapper height={height} width={"100%"}>
          <AgGridReact
            frameworkComponents={{
              ProgressCellRenderer: ProgressBarRenderer,
            }}
            defaultColDef={defaultColDefs}
            pagination={true}
            paginationPageSize={30}
            cacheBlockSize={10}
            animateRows={true}
            rowData={data}
            gridOptions={gridOptions}
            columnDefs={tableColumns}
            cacheQuickFilter={true}
            rowSelection={rowSelection}
            onSelectionChanged={onRowSelection}
            onGridReady={onGridReady}
          ></AgGridReact>
        </TableWrapper>
      </div>
    </div>
  );
};

export default ClaimProbabilityTable;
