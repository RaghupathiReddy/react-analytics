import React, { useEffect, useState } from 'react'
import TableWrapper from '../../../components/Tables/table-wrapper'
import {AgGridReact, AgGridColumn} from 'ag-grid-react'
import { useDispatch } from 'react-redux'
import { getLocalExplainerChartData } from '../redux/LocalExplainerCRUD'
import * as LocalExplainerRedux from "../redux/LocalExplainerRedux";
import { LocalExplainerRecord, WaterfallGraphData } from '../../../Models/LocalExplainerModels'
import { DefaultColumnDef } from '../../../Models/MatrixModels'
import { getWaterfallChartData } from '../helperFunctions'


// type IRecordsTable = {
//     tableData : LocalExplainerRecord[]
// }


const RecordsTable = (props) => {
    const [gridApi, setGridApi] = useState();
    const perPage = 3;
  
    const onGridReady = (params) => {
      setGridApi(params.api);
    };
  
    useEffect(() => {
      if (gridApi) {
        const dataSource = {
          getRows: (params) => {
            // Use startRow and endRow for sending pagination to Backend
            // params.startRow : Start Page
            // params.endRow : End Page
  
            const page = params.endRow / perPage;
            fetch(`http://localhost:4000/model/local_explainer/records/62c29f095be426fca33daf5d?perPage=${15}&page=${1}`)
              .then(resp => resp.json())
              .then(res => {
                params.successCallback(res.data, res.total);
              }).catch(err => {
                params.successCallback([], 0);
              });
          }
        }
  
        gridApi.setDatasource(dataSource);
      }
    }, [gridApi]);
  

  
    return (
      <div className="App">
        <h2>Server side pagination in the React AG Grid - <a href="https://www.cluemediator.com" target="_blank">Clue Mediator</a></h2>
        <div className="ag-theme-alpine ag-style">
          <AgGridReact
            pagination={true}
            rowModelType={'infinite'}
            paginationPageSize={perPage}
            cacheBlockSize={perPage}
            onGridReady={onGridReady}
            rowHeight={60}
            defaultColDef={{ flex: 1 }}
          >
            <AgGridColumn field="first_name" headerName="First Name" cellClass="vertical-middle" />
            <AgGridColumn field="last_name" headerName="Last Name" cellClass="vertical-middle" />
            <AgGridColumn field="email" headerName="Email" cellClass="vertical-middle" />
          </AgGridReact>
        </div>
      </div>
    );
}

export default RecordsTable


