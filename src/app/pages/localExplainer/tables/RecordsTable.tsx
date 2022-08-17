import React, { useEffect, useState } from 'react'
import TableWrapper from '../../../components/Tables/table-wrapper'
import {AgGridReact} from 'ag-grid-react'
import { useDispatch } from 'react-redux'
import { getLocalExplainerChartData } from '../redux/LocalExplainerCRUD'
import * as LocalExplainerRedux from "./../redux/LocalExplainerRedux";
import { FeatureValues, LocalExplainerRecord, WaterfallGraphData } from '../../../Models/LocalExplainerModels'
import { DefaultColumnDef } from '../../../Models/MatrixModels'
import { getWaterfallChartData } from '../helperFunctions'
import config from '../../../config'
import { selectFirstRow } from '../helperDOMEvents'
import { useParams } from 'react-router-dom'


type IRecordsTable = {
    tableData : LocalExplainerRecord[]
    threshold : number
    featureRanks : FeatureValues[]
}


const RecordsTable:React.FC<IRecordsTable> = (props) => {

    const {featureRanks} = props
    const dispatch = useDispatch();
    const [textToFilter, setTextToFilter] = useState<string>('')
    const [gridApi, setGridApi] = useState<any>()
    const [tableData, setTableData] = useState<any>()
    const [columnDefinations, setColumnDefinations] = useState<DefaultColumnDef[]>()
    const excludedColumns = ['_id', 'projectId']
    const excludedGraphColumns = ['_id', 'projectId', 'claimno', 'actual' , 'predicted_fraud','probability']
    const [calculatedTableData , setCalculatedTableData ] = useState<LocalExplainerRecord[]>()
    const [topTenColumnDefinations , setTopTenColumnDefinations] = useState<DefaultColumnDef[]>()
    const [isTableExpanded , setIsTableExpanded] = useState<number | string>("10")
    const [threshold, setThreshold] = useState<number>(props.threshold)
    const pageSize = 10 //TODO : Verify pagination is working after modifying this variable

    const { projectId } = useParams()

    //Generate column definations

    function getHardCodedDefs(colDef: DefaultColumnDef[],ranks:any) {
        let hardCodedColDefinations:DefaultColumnDef[] = []
        colDef.filter((data)=>{
            if(data.field === 'claim no'){
                data.headerName = 'Claim No.'
                hardCodedColDefinations[0] = data
                return true
            }
            if(data.field === 'actual'){
                hardCodedColDefinations[1] = data
                return true
            }
            if(data.field === 'Predicted'){
                hardCodedColDefinations[2] = data
                return true
            }
            if(data.field === 'probability'){
                hardCodedColDefinations[3] = data
                return true
            }
            else{
                hardCodedColDefinations[ranks[data.field]+4] = data
            }
        })
        setTopTenColumnDefinations(hardCodedColDefinations.slice(0,14))
        setColumnDefinations(hardCodedColDefinations)
    }

    function sortTableColumns(data : LocalExplainerRecord){
        //This function sorts columns on basis of value types float and integer
        const tableHeaders : {columnName : string, rounded : boolean}[]  = []

        Object.entries(data).map((record)=>{
            if(record[0]==='probability'){
                let header = {
                    columnName : record[0],
                    rounded : true
                }
                tableHeaders.push(header)
                return true
            }
            if (
                typeof record[1] === 'number' &&
                !Number.isNaN(record[1]) &&
                !Number.isInteger(record[1])
              ) {
                let header = {
                    columnName : record[0],
                    rounded : true
                }
                tableHeaders.push(header)
                return true;
              }
              let header = {
                columnName : record[0],
                rounded : false
                }
                tableHeaders.push(header)
              return false;
        })
        return tableHeaders
    }


    function getColumnDefinations(data : {columnName : string, rounded : boolean}[]){
        let columnDefinations:DefaultColumnDef[]  = []
        data.forEach((header)=>{
            if(excludedColumns.includes(header.columnName))
                return 
            if(header.rounded)
            {
                let columnHeaderDefination = {
                    field : header.columnName,
                    filter: 'agNumberColumnFilter',
                    filterParams: {
                      suppressAndOrCondition: true,
                    },
                    cellRenderer:'loading', 
                    width : 100,
                    resizable : true,
                    tooltipField : header.columnName
                }
                columnDefinations.push(columnHeaderDefination)
            }
            else{
                let columnHeaderDefination = {
                    field : header.columnName,
                    filter: 'agNumberColumnFilter',
                    width : 100,
                    resizable : true,
                    filterParams: {
                      suppressAndOrCondition: true,
                    },
                }
                columnDefinations.push(columnHeaderDefination)
            }
        })
        return columnDefinations
    }



    function getOtherRecordsProability(data:WaterfallGraphData[]){
        let aggregateProb = 0
        data.forEach((data)=>{
            aggregateProb += data.y
        })
        let otherProbability = {
            name : 'Others',
            y : aggregateProb
        }
        return otherProbability
    }

    //Filter for table
    function onGridReady(columnValue: any) {
        setGridApi(columnValue.api)
        setTimeout(()=>{
            selectFirstRow()
        },1000)

    }

    const onFilterTextBoxChanged = (e: any) => {
        setTextToFilter(e.target.value)
        gridApi.setQuickFilter(textToFilter)
    }

    const clearFilter = () => {
        setTextToFilter('')
        gridApi.setQuickFilter('')
    }

    //Row selection event handler

    const rowSelection = 'single'   //Limits row selection to a single row
   
    const onRowSelection = (event: any) => {

        const selectedRow = event.api.getSelectedRows()[0]
        const sortedRowArray = Object.entries(selectedRow)
                                        .sort(function(a:any,b:any) {
                                            return Math.abs(b[1])- Math.abs(a[1])
                                        })
        //In te above function we are sorting array of [key,value] so b[1],a[1] refers to value
        
        const sortedRow = sortedRowArray.reduce((data:any, [key, value]) => {
            data[key] = value;
            return data;
        }, {});
        //The above function is used to convert [[key,value],[key,value]] to {key:value,key:value}

        dispatch(LocalExplainerRedux.actions.setSelectedRowData(sortedRow))
        dispatch(LocalExplainerRedux.actions.updateFilteredRowsLoadingStatus(true))
    

        if(columnDefinations){
            getLocalExplainerChartData(sortedRow.projectId, selectedRow[columnDefinations[0].field])
                .then(({ data }) => {
                    const chartData: WaterfallGraphData[] = getWaterfallChartData(data[0], excludedGraphColumns);
                    const sortedChartDataArray = chartData.sort((a,b)=> Math.abs(b.y) - Math.abs(a.y))
                    //The above function sorts the waterfall graph data on magnitude(y)
                    const topTenChartDataValues = sortedChartDataArray.slice(0,10)
                    const otherRecordsData = sortedChartDataArray.slice(10,chartData.length)
                    const otherRecordsProbability = getOtherRecordsProability(otherRecordsData)
                    const probabilityData : any = {
                        name : "Probability" , 
                        isSum : true , 
                        color : 'gray'
                    }
                    const waterfallGraphData = [
                                                ...topTenChartDataValues,
                                                otherRecordsProbability, 
                                                probabilityData
                                            ]

                    dispatch(LocalExplainerRedux.actions.getLocalExplainerRecordsGraphData(waterfallGraphData));                   
            });
        }
    }



    const components = {
        loading:(params:any)=>{
          if(params.value!==undefined){
            let value :number= params.value
            return value.toFixed(2) 
          }
          else{
            return <img src='https://www.ag-grid.com/example-assets/loading.gif' alt='Loading...'/>
          }
        }
    }

    function getPredictedFraudColumn(tableData:LocalExplainerRecord[],threshold : number){
        let newTableData:any = []
            tableData.forEach((data:any)=>{
                if(data.probability >= threshold){
                    data['Predicted'] = 1
                    newTableData.push(data)
                }
                else{
                    data['Predicted'] = 0
                    newTableData.push(data)
                }
            })
            return newTableData
    }

//This hook is used to get data for records table in chunks of page size
    useEffect(()=>{
        let ranks :any= {}
        if(featureRanks){
            featureRanks.forEach((element)=>{
                ranks[element.feature] = element.rank
            })
        }
        if (gridApi) {
            const dataSource = {
              getRows: (params: any) => {
                // Use startRow and endRow for sending pagination to Backend
                // params.startRow : Start Page
                // params.endRow : End Page
                const page = params.endRow / 10;
                const order = params.sortModel[0]?.sort
                const column = params.sortModel[0]?.colId
                // var filterColumn;
                // var filterValue;
                // if(Object.keys(params.filterModel).length > 0){
                //   filterColumn = Object.keys(params.filterModel).pop()
                //   if(filterColumn)
                //     filterValue = params.filterModel[filterColumn]["filter"]
                // }
                fetch(`${config.HOST_NAME}/model/local_explainer/records/${projectId}?perPage=${10}&page=${page}&sortColumn=${column}&order=${order}&filter=${JSON.stringify(params.filterModel)}`)
                  .then(resp => resp.json())
                  .then(res => {
                    params.successCallback(getPredictedFraudColumn(res.docs,threshold), res.totalDocs);
                    const tableHeaders = sortTableColumns(res.docs[0])
                    const columnDefinations : DefaultColumnDef[] = getColumnDefinations(tableHeaders)
                    setColumnDefinations(columnDefinations)
                    getHardCodedDefs(columnDefinations,ranks)
                  }).catch(err => {
                    console.log(err)
                    params.successCallback([], 0);
                  });
              }
            }
            gridApi.setDatasource(dataSource);
           
          }
    },[tableData, threshold, gridApi])


 


  return (
    <div>
        <div>
            <h3>Claim Details</h3>
        </div>
			<div className="row gy-5 g-xl-3 p-2 d-flex justify-content-between">
				<div className="col mw-500px d-flex justify-content-evenly">
					<div className="">
						<input
							className="form-control form-control-sm mt-2 mb-2"
							type="text"
							id="filter-text-box"
							placeholder="Search..."
							onChange={onFilterTextBoxChanged}
							value={textToFilter}
						></input>
					</div>
					<div>
                    <button className="btn btn-primary btn-sm mt-2 mb-2" onClick={clearFilter}>
						Clear Filter
					</button>
                    </div>
				</div>
				<div className="col d-flex justify-content-center">
					<label className="form-label fw-bolder text-dark fs-6 pt-5">
						<h6>Threshold : {threshold}</h6>
					</label>
				</div>
				<div className="col d-flex justify-content-end">
					<div className="">
                        <select 
                            onChange={(e)=>{setIsTableExpanded(e.target.value)}} 
                            className={'form-select form-select-sm m-2 cursor-pointer'}
                        >
                                <option className='dropdown-item' value={10} >Show top 10 features</option>
                                <option className='dropdown-item' value={0} >Show all features</option>
                        </select>
					</div>
				</div>

				{isTableExpanded === '0' ? (
					<div className='records-table'>
                           <TableWrapper height={'45vh'}>
                               <AgGridReact
                                  onGridReady={onGridReady}
                                  columnDefs={columnDefinations}
                                  defaultColDef={{sortable:true}}
                                  rowSelection={rowSelection}
                                  onSelectionChanged={onRowSelection}
                                  components={components}
                                  suppressFieldDotNotation={true}
                                  enableBrowserTooltips={true}
                                  pagination={true}
                                  paginationPageSize={pageSize}
                                  rowModelType={'infinite'}
                                  cacheBlockSize={pageSize}
                              />
                        </TableWrapper>
                       </div>
				) : (
					<div className='records-table'>
                         <TableWrapper height={'45vh'}>
                                <AgGridReact
                                    onGridReady={onGridReady}
                                    columnDefs={topTenColumnDefinations}
                                    defaultColDef={{sortable:true}}
                                    rowSelection={rowSelection}
                                    onSelectionChanged={onRowSelection}
                                    components={components}
                                    suppressFieldDotNotation={true}
                                    enableBrowserTooltips={true}
                                    pagination={true}
                                    paginationPageSize={pageSize}
                                    rowModelType={'infinite'}
                                    cacheBlockSize={pageSize}
                                />
                         </TableWrapper>
                    </div>
				)}
			</div>
		</div>
  )
}

export default RecordsTable


