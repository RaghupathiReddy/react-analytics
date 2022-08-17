import { FC, useEffect, useState } from 'react'
import StackedColumnLineChart from '../../components/graphs/StackedColumnLineChart/StackedColumnLineChart'
import { ColumnAndLineSeries, GlobalData, GraphData, PlotLine } from './GlobalExplainerModel';
import ManualSelect from './ManualSelect';
import ToggleButton from './ToggleButton';
type StackedGraphProps = {
  globalExplainability: GlobalData[]
  value: number
  thresholdState: any
  setIsStackBarSelected: (value: boolean) => void
  setSelectedStackRange: (value: string) => void
  isStackBarSelected: boolean
  selectedStackRange: string
}

export interface FraudOptions {
  value: string
  toolTip: string

}
const StackedGraph: FC<StackedGraphProps> = (props) => {
  const { setSelectedStackRange, setIsStackBarSelected, selectedStackRange, isStackBarSelected, globalExplainability, thresholdState, value } = props
  const [graphData, setgraphData] = useState<GraphData[]>([]);

  const [plotLine, setPlotLine] = useState<PlotLine[]>([]);

  const dropdownOptions: number[] = [0.05, 0.1, 0.15, 0.2, 0.25, 0.5];

  const [isManualBinEnabled, setIsManualBinEnabled] = useState(false)

  const fraudOptions: FraudOptions[] = [
    { value: "Fraud", toolTip: "Cumulative Sum Of Actual Fraud Line Graph" },
    { value: "Non Fraud", toolTip: "Cumulative Sum Of Actual Non Fraud Line Graph" }
  ];

  const [graphType, setGraphType] = useState("Fraud")

  const [biningValue, setBiningValue] = useState<number>(dropdownOptions[0]);

  const [plotLineValue, setPlotLineValue] = useState("")

  const [columnLineGraphSeriesData, setColumnLineGraphSeriesData] = useState<ColumnAndLineSeries[]>([]);

  const [categories, setCategories] = useState<string[]>([])

  const [manualInput, setManualInput] = useState<number>(dropdownOptions[0]);

  const [selectedThreshold, setSelectedThreshold] = useState(dropdownOptions[0]);


  const getDataForCurrentBinRange = (start: number) => {

    const inRange = globalExplainability.filter(({ probability }) =>
      probability >= parseFloat((start + 0.01).toFixed(3)) && probability <= start + biningValue
    );

    return inRange;

  };

  const generateCatoryBasedOnBinValue = (start: number, bin: number) => {
    const categoryLabel = `${(start + 0.01).toFixed(2)}-${(start + bin)?.toFixed(2)}`;
    return categoryLabel;
  };

  const getSumOfTopBarWithThreshold = (inRange: GlobalData[]) => {
    return inRange.reduce((res, el) => res + el.fraud, 0);
  }

  const getSumOfBottomBarWithThreshold = (inRange: GlobalData[]) => {
    return inRange.reduce((res, el) => res + el.non_fraud, 0);
  };

  const getGlobalExplainerCalData = (categoryRange: number[], bin: number) => {
    const claimActualData = categoryRange
      .map((start) => {
        const inRange = getDataForCurrentBinRange(start);
        return {
          topBar: getSumOfTopBarWithThreshold(inRange),
          labelForCategory: generateCatoryBasedOnBinValue(start, bin),
          bottomBar: getSumOfBottomBarWithThreshold(inRange),
        };
      })

    return claimActualData;
  };

  const getCategoryRange = () => {
    const binRange = Array.from(
      { length: Math.ceil(1 / biningValue) },
      (_, i) => Number((biningValue * i).toFixed(3))
    );

    return binRange;
  };

  useEffect(() => {
    const categoryRange = getCategoryRange();

    const graphDatas: GraphData[] = getGlobalExplainerCalData(
      categoryRange,
      biningValue
    );

    setgraphData(graphDatas);
  }, [biningValue, value, globalExplainability]);

  const getSumOfActualValue = (graphData: GraphData[]) => {
    const bottomBar = graphData.map((el) => {
      return el.bottomBar;
    })

    return bottomBar
  }

  const getCumulativeSum = (bottomBar: number[]) => {
    const sumOfCumulativeActualValue = bottomBar.map(((sum) => (value) => (sum += value))(0))
    // sum = value of sum intialize to 0 
    // value is the current value of the current index
    // [2,4,5]
    // sum += value === sum= 0+2 =2
    // sum = 2+4 = 6
    // sum = 6+5 = 11

    return sumOfCumulativeActualValue
  }

  const getCountOfClaims = (graphData: GraphData[]) => {
    const claimCount = graphData.map((el) => {
      return el.topBar;
    });

    return claimCount
  }

  const getSplitBin = (data: GlobalData[], start: string, end: number) => {
    const filteredBinValue = data.filter(({ probability }) =>
      probability >= parseFloat((start)) && probability <= end
    );

    return filteredBinValue
  }

  const getSortedData = (data: GraphData[]) => {
    return data.sort((a, b) => (a.labelForCategory > b.labelForCategory) ? 1 : ((b.labelForCategory > a.labelForCategory) ? -1 : 0))

  }


  useEffect(() => {
    if (plotLineValue !== "") {

      const rangeBySplitingTheString = plotLineValue.split("-");

      const filteredFirstBinValue = getSplitBin(globalExplainability, rangeBySplitingTheString[0], value)

      const splitBin1 = {
        topBar: getSumOfTopBarWithThreshold(filteredFirstBinValue),
        labelForCategory: `${rangeBySplitingTheString[0]}-${value}`,
        bottomBar: getSumOfBottomBarWithThreshold(filteredFirstBinValue),
      }

      const filteredSecondBinValue = getSplitBin(globalExplainability, `${(value + 0.01)}`, parseFloat((rangeBySplitingTheString[1])))

      const splitBin2 = {
        topBar: getSumOfTopBarWithThreshold(filteredSecondBinValue),
        labelForCategory: `${(value + 0.01)}-${rangeBySplitingTheString[1]}`,
        bottomBar: getSumOfBottomBarWithThreshold(filteredSecondBinValue),
      }

      const newBinData = graphData.filter(el => {
        return el.labelForCategory !== plotLineValue
      })


      newBinData.push(splitBin1)
      newBinData.push(splitBin2)

      const sortedData = getSortedData(newBinData)

      setgraphData(sortedData)

    }
  }, [plotLineValue])


  useEffect(() => {
    let columnLineGraphSeries: ColumnAndLineSeries[] = [];
    let bottomBarData = getSumOfActualValue(graphData)
    let cumulativeNonFraudSum = getCumulativeSum(bottomBarData)
    let topBarData = getCountOfClaims(graphData)
    let cumulativeFraudSum = getCumulativeSum(topBarData)


    let sumOfNonFraud = {
      name: "Sum of non fraud",
      type: "column",
      stack: 1,
      yAxis: 1,
      color: 'rgb(44, 99, 143)',
      data: bottomBarData,

      tooltip: {
        valueSuffix: "",
      },
    };

    let sumOfCumulativeNonFraud = {
      name: "Cumulative non fraud",
      type: "line",
      color: '#50CD89',
      data: cumulativeNonFraudSum,

      tooltip: {
        valueSuffix: "",
      },
    };

    let sumOfActualFraud = {
      name: "Sum of actual fraud",
      type: "column",
      stack: 1,
      yAxis: 1,
      color: 'rgb(217, 141, 39)',
      data: topBarData,
      tooltip: {
        valueSuffix: " ",
      },
    };

    let sumOfCumulativeActualFraud = {
      name: "Cumulative actual fraud",
      type: "line",
      color: '#F1416C',
      data: cumulativeFraudSum,
      tooltip: {
        valueSuffix: " ",
      },
    };

    if (graphType === "Default") {
      columnLineGraphSeries.push(sumOfActualFraud);
      columnLineGraphSeries.push(sumOfNonFraud);

    } else if (graphType === "Fraud") {

      columnLineGraphSeries.push(sumOfActualFraud);
      columnLineGraphSeries.push(sumOfNonFraud);
      columnLineGraphSeries.push(sumOfCumulativeActualFraud);


    } else {
      columnLineGraphSeries.push(sumOfActualFraud);
      columnLineGraphSeries.push(sumOfNonFraud);
      columnLineGraphSeries.push(sumOfCumulativeNonFraud);

    }

    setColumnLineGraphSeriesData(columnLineGraphSeries);
  }, [graphData, graphType]);

  const getColumnLineGraphCategories = (graphData: GraphData[]) => {
    const columnLineGraphCategories = graphData.map((el) => {
      return el.labelForCategory;
    });

    return columnLineGraphCategories
  }

  const getPlotLabelForPlotLine = (separatedValue: any[]) => {
    var plotLabel = "";

    separatedValue.forEach(el => {
      const data = el.split("-");

      if (data[0] <= value && data[1] >= value) {
        plotLabel = `${data[0]}-${data[1]}`
        if (parseFloat(data[0]) === value || parseFloat(data[1]) === value) {
          setPlotLineValue("")
        } else {
          setPlotLineValue(plotLabel)
        }

      }

    })

    return plotLabel
  }

  const getPlotLinePosition = (graphData: GraphData[]) => {
    const separatedValue: any[] = []
    const plotLineValue = graphData.map((el) => {
      return el.labelForCategory;
    })

    plotLineValue.forEach(el => {
      separatedValue.push(el)
    })

    return plotLineValue.indexOf(getPlotLabelForPlotLine(separatedValue))
  }

  useEffect(() => {

    let columnLineGraphCategories: string[] = getColumnLineGraphCategories(graphData)

    setCategories(columnLineGraphCategories)

  }, [biningValue, graphData]);

  useEffect(() => {
    const plotLinePosition: number = getPlotLinePosition(graphData)

    var plotLines = [
      {
        color: "#A9A9A9",
        width: 3,
        value: plotLinePosition + .5,
        dashStyle: 'longdashdot'
      },
    ];

    setPlotLine(plotLines);
  }, [biningValue, graphData, value]);

  const handleChange = (e: any) => {
    if (e.target.value !== "other") {
      setBiningValue(parseFloat(e.target.value));
    } else {
      setIsManualBinEnabled(true)
    }
  };


  useEffect(() => {
    setManualInput(biningValue)
  }, [biningValue])

  return (
    <div className="card shadow-sm p-4  h-100">

      <div className='row d-flex justify-content-between align-items-center align-self-between align-content-center flex-wrap'>
        <div className=" col-xl-5 d-flex flex-column">
          <h3 className='fs-4'>Prediction Distribution Analysis</h3>
          <span className="text-muted fw-bold text-capitalize">Fraud vs Non Fraud</span>
        </div>
        <div className='col-xl-7 d-flex justify-content-between align-items-center align-self-center align-content-center'>
          <div className=' d-flex justify-content-between align-items-center align-self-center align-content-center '>

            <div className=' d-flex justify-content-evenly align-items-center align-self-center align-content-center w-200px'>
              <label className="form-label mx-1 w-150px">Select Bin-</label>
              {
                isManualBinEnabled ?
                  <ManualSelect
                    setIsManualBinEnabled={setIsManualBinEnabled}
                    step={thresholdState.step}
                    minThreshold={thresholdState.minThreshold}
                    maxThreshold={thresholdState.maxThreshold}
                    manualInput={manualInput}
                    setManualInput={setManualInput}
                    setSelectedThreshold={setSelectedThreshold}
                    setValue={setBiningValue}
                  /> :
                  <select value={biningValue} className="form-select form-select-sm w-80px" onChange={handleChange}>
                    {dropdownOptions.map((el: any) => (
                      <option value={el}>{el}</option>
                    ))}

                  </select>
              }

            </div>


          </div>
          <div className=' d-flex justify-content-between align-items-center align-self-between align-content-center'>
            <ToggleButton fraudOptions={fraudOptions} setGraphType={setGraphType} graphType={graphType} />
          </div>

        </div>

      </div>

      <StackedColumnLineChart
        categories={categories}
        series={columnLineGraphSeriesData}
        yAxisTitle="Cumulative Count"
        secondaryYAxisTitle="Count"
        isStackBarSelected={isStackBarSelected}
        chartTitle={""}
        plotline={plotLine}
        xAxisTitle="Probability bins"
        setIsStackBarSelected={setIsStackBarSelected}
        setSelectedStackRange={setSelectedStackRange}
        selectedStackRange={selectedStackRange}
      />
    </div>
  )
}

export default StackedGraph
