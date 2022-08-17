import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useEffect, useRef, useState } from "react";
import ProgressBarRenderer from "../../components/graphs/TableProgressBar/ProgressBarRenderer";
import TableWrapper from "../../components/Tables/table-wrapper";
import { BiasTableRow } from "../../Models/BiasModels";


interface BiasTableProps {
  tableRows: BiasTableRow[]
}

const BiasTable = (props: BiasTableProps) => {
  const {tableRows} = props;

  console.log("tableRows", tableRows);

  useEffect(() => {
    setRows(tableRows);

  }, [tableRows])
  
    const gridRef = useRef<any>();
  
    const columnDefs: ColDef[] = [
      { field: 'name', headerName: 'Feature', flex: 1 },
      { field: 'biasCategory', flex: 1 },
      { field: 'statisticalParity', flex: 1, cellRenderer: ProgressBarRenderer  },
      { field: 'disparateImpact', flex: 1, cellRenderer: ProgressBarRenderer },
    ]
  
    const [rows, setRows] = useState<BiasTableRow[]>([]);
  
    const onDropdownSelection = (selection: string) => {
  
      if (selection === 'All') {
        setRows(tableRows);
      } else {
        const data = rows.filter(row => row["biasCategory"] !== null);
        setRows(data);
      }
    }
  
  
    const handleSearch = (searchText: string) => {
      const currentValue = gridRef.current;
  
      if (currentValue && currentValue.api) {
        currentValue.api.setQuickFilter(searchText);
      }
    }
  
    return (
      <div className='card p-3 '>
        <Dropdown onChange={onDropdownSelection} onSearchboxChange={handleSearch}  ></Dropdown>
        <TableWrapper height={200} >
          <AgGridReact ref={gridRef} columnDefs={columnDefs} rowData={rows}
            cacheQuickFilter={true} cacheBlockSize={10}
            pagination={true} paginationPageSize={30}
          />
        </TableWrapper>
      </div>
    )
  }

  export default BiasTable;
  
  const Dropdown = (props: any) => {
    const [textToFilter, setTextToFilter] = useState<string>('')
  
    const onFilterTextBoxChanged = (e: any) => {
        const searchText = e.target.value;
        if (searchText) {
            props.onSearchboxChange(searchText);
        }
        setTextToFilter(e.target.value);
    }
  
    const allFeatures = 'All';
    const suggestedBias = 'Suggested Bias';
  
    const [selected, setSelected] = useState(allFeatures);
  
    const handleChange = (event: any) => {
      setSelected(event.target.value);
      props.onChange(event.target.value);
    }

    const handleClear = (event: any) => {
        setTextToFilter('');
        props.onSearchboxChange('');
    }
  
  
    return (
       <>
      <div className="row gy-5 g-xl-8 p-2">
        <div className="col-xl-6">
          <div className="row">
            <div className="col-3 d-flex justify-content-center align-self-center  align-items-center">
              <h4 className="fs-4">Bias Category -</h4>
            </div>
            <div className="col-6">
              <select
                className="form-select form-select-solid"
                value={selected}
                onChange={(e) => handleChange(e)}
              >
                <option value={allFeatures}>{allFeatures}</option>
                <option value={suggestedBias}>{suggestedBias}</option>
              </select>
            </div>
            <div className="col-3"></div>
          </div>
        </div>
        <div className="col-xl-6">
          <div className="row">
            <div className="col-3"></div>
            <div className="col-6">
              <input
                className="form-control "
                type="text"
                id="filter-text-box"
                placeholder="Filter..."
                onChange={onFilterTextBoxChanged}
                value={textToFilter}
              ></input>
            </div>
            <div className="col-3">
              <button className="btn btn-primary w-100" onClick={handleClear}>
                Clear Filter
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
    )
  }
  