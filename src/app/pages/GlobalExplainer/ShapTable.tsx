import { AgGridReact } from 'ag-grid-react'
import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ProgressBarWithNegAxis from '../../components/graphs/TableProgressBar/ProgressBarWithNegAxis'
import TableWrapper from '../../components/Tables/table-wrapper'
import { ColumnWithParams, ShapData } from './GlobalExplainerModel'

interface ShapTableProps {
  shapTableData: ShapData[]
  isStackBarSelected: boolean
  selectedStackRange: string
  shapTableTempData: ShapData[]
}

interface ShapTableData {
  feature: string
  avg_shap: number
  global_min: number
  global_max: number
  localMin: number
  localMax: number
  impact: number
  rank: number
}
const ShapTable: FC<ShapTableProps> = ({ shapTableData, selectedStackRange, isStackBarSelected, shapTableTempData }) => {

  const [tableHeader, setTableHeader] = useState<ColumnWithParams[]>([])
  const [tableData, setTableData] = useState<ShapTableData[] | ShapData[]>([])
  const [textToFilter, setTextToFilter] = useState<string>("");
  const [filterOptions, setFilterOptions] = useState<any>();
  const [isFeatureButtonClicked, setIsFeatureButtonClicked] = useState(true)
  const [top10Feature, setTop10Feature] = useState<ShapTableData[] | ShapData[]>([])

  const getArrayOfValueOnKeys = (shapTableData: any[]) => {
    const collectionOfData = shapTableData.reduce((prevValue: any, currValue: any) => {
      Object.keys(currValue).forEach((el) => {
        if (prevValue[el]) {
          prevValue[el].push(Number(currValue[el]));
        } else {
          prevValue[el] = [Number(currValue[el])];
        }
      });
      return prevValue;
    }, {});

    return collectionOfData
  }

  const getCalculatedData = (data: any[]) => {
    const output: any[] = [];

    Object.keys(data).forEach((el: any) => {
      output.push({
        feature: el,
        averageShap: data[el].reduce((a: any, b: any) => a + b, 0) / data[el].length,
        average: data[el].reduce((a: any, b: any) => Math.abs(a) + b, 0) / data[el].length,
        localMin: Math.min(...data[el]),
        localMax: Math.max(...data[el]),
      });
    });

    return output;
  }

  const getFilteredData = (data: any[]) => {

    const filteredData: any[] = []

    data.forEach((el: any) => {
      if (el.feature !== "claimno" && el.feature !== "probability" && el.feature !== "actual" && el.feature !== "predicted_fraud" && el.feature !== "_id" && el.feature !== "projectId")
        filteredData.push(el);

    })

    return filteredData

  }

  const getSortedData = (mergedData: any[]) => {
    let i = 1

    const sortedData = mergedData.sort((a, b) => (a.average < b.average) ? 1 : ((b.average < a.average) ? -1 : 0)).map(el => ({ ...el, Rank: i++ }))

    return sortedData
  }

  const getMergeByFeature = (a1: any[], a2: any[]) =>
    a1.map((itm) => ({
      ...a2.find((item) => item.feature === itm.feature && item),
      ...itm,
    }));


  useEffect(() => {
    if (isStackBarSelected === true) {
      setTableData([])
      const collectionOfEachProperty = getArrayOfValueOnKeys(shapTableData)
      const calculateDataForTable = getCalculatedData(collectionOfEachProperty)
      const filteredData = getFilteredData(calculateDataForTable)
      const mergedData = getMergeByFeature(filteredData, shapTableTempData)

      setTableData(getSortedData(mergedData))
      setTop10Feature(getSortedData(mergedData).splice(0, 10))

    } else {
      setTableData(shapTableTempData)
    }
  }, [isStackBarSelected, selectedStackRange, shapTableData, shapTableTempData])

  const loadRoundedValues = (data: any[]) => {
    data.forEach((element: any) => {
      Object.entries(element).forEach(([key, value]) => {
        if (typeof value === "number") {
          element[key] = +value.toFixed(3);
        }
      });
    });
  }

  const getMaxShapValue = (tableData: any[], key: string) => {
    const shapCollection = tableData.map(el => {
      return Math.abs(el[key])
    })

    const maxValueOfShap = Math.max(...shapCollection)

    return maxValueOfShap
  }

  const getTableHeader = (tableData: ShapData[]) => {
    let tableHeader: ColumnWithParams[] = []
    if (isStackBarSelected) {
      tableHeader = [
        {
          field: "feature",
          flex: 2,
          resizable: true,
          headerName: "Feature",
        }, {
          field: "Rank",
          flex: 1,
          resizable: true,
          headerName: "Rank",
        },
        {
          field: "averageShap",
          flex: 2,
          resizable: true,
          headerName: "Avg Contribution",
          cellRenderer: "ProgressCellRenderer",
          cellRendererParams: { maximumShapAverage: getMaxShapValue(tableData, "averageShap") },
        },
        {
          field: "localMin",
          flex: 1,
          resizable: true,
          headerName: "Local Min (Probability Bin Min)",
        },
        {
          field: "localMax",
          flex: 1,
          resizable: true,
          headerName: "Local Max (Probability Bin Max)",
        },
        {
          field: "global_min",
          flex: 1,
          resizable: true,
          headerName: "Gobal Min (Population Min )",
        },
        {
          field: "global_max",
          flex: 1,
          resizable: true,
          headerName: "Gobal Max (Population Max )",
        }

      ]
    }
    else {
      tableHeader = [
        {
          field: "feature",
          flex: 2,
          resizable: true,
          headerName: "Feature",
        }, {
          field: "rank",
          flex: 1,
          resizable: true,
          headerName: "Rank",
        },
        {
          field: "avg_shap",
          flex: 2,
          resizable: true,
          headerName: "Avg Contribution",
          cellRenderer: "ProgressCellRenderer",
          cellRendererParams: { maximumShapAverage: getMaxShapValue(tableData, "avg_shap") },
        },
        {
          field: "global_min",
          flex: 2,
          resizable: true,
          headerName: "Gobal Min (Population Min )",
        },
        {
          field: "global_max",
          flex: 2,
          resizable: true,
          headerName: "Gobal Max (Population Max )",
        }

      ]


    }

    return tableHeader;
  }

  const sortingTable = useMemo(() => ({ sortable: true }), [])

  useEffect(() => {
    loadRoundedValues(tableData)
    setTop10Feature(tableData.slice(0, 10))

    let tableColumn = getTableHeader(tableData)
    setTableHeader(tableColumn)
  }, [tableData])

  const onFilterTextBoxChanged = useCallback((e) => {
    setTextToFilter(e.target.value)
    filterOptions?.setQuickFilter(e.target.value);
  }, [filterOptions]);

  function onGridReady(columnValue: any) {
    setFilterOptions(columnValue.api);

  }

  const handleOtherFeature = () => {
    setIsFeatureButtonClicked(false)
    setTop10Feature(tableData)
  }

  const handleTop10Feature = () => {
    setIsFeatureButtonClicked(true)
    setTop10Feature(tableData.slice(0, 10))
  }

  return (
    <div className='card shadow-sm p-2  h-100'>
      <div className='row p-2 d-flex justify-content-evenly align-items-center align-self-center align-content-center'>
        <div className="col-sm-5">
          <h1 className='fs-3'> Variable Importance Analysis</h1>
        </div>
        <div className='col-sm-7 '>
          <div className='row d-flex justify-content-between align-items-center align-self-center align-content-center'>

            <div className="col-sm-5">
              <p className='card-title text-center py-2 fs-7 fw-light text-muted'>Bin Value - <span className='text-dark fw-bold'>{selectedStackRange ? selectedStackRange : "NA"}</span> </p>
            </div>
            <div className="col-sm-3">
              <input
                className="form-control form-control-sm fs-7"
                type="text"
                id="filter-text-box"
                placeholder="Filter..."
                onChange={onFilterTextBoxChanged}
                value={textToFilter}
              ></input>

            </div>
            <div className="col-sm-4">
              <button className='btn btn-sm btn-primary fs-8' onClick={isFeatureButtonClicked ? handleOtherFeature : handleTop10Feature}>{isFeatureButtonClicked ? "All Features" : "Top 10 Features"}</button>

            </div>
          </div>
        </div>




      </div>

      <TableWrapper height={310} >
        <AgGridReact
          frameworkComponents={{
            ProgressCellRenderer: ProgressBarWithNegAxis,
          }}
          defaultColDef={sortingTable}
          pagination={true}
          paginationPageSize={10}
          cacheBlockSize={10}
          animateRows={true}
          rowData={top10Feature}
          columnDefs={tableHeader}
          cacheQuickFilter={true}
          onGridReady={onGridReady}
        ></AgGridReact>
      </TableWrapper>
    </div>
  )
}

export default ShapTable
