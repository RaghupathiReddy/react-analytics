import React, { useEffect, useState } from "react";
import StackedBarChart from "../../components/graphs/StackedBarChart/StackedBarChart";
import StackedColumnLineChart from "../../components/graphs/StackedColumnLineChart/StackedColumnLineChart";
import AreaChart from "../../components/graphs/AreaChart/AreaChart";
import Heatmap from "./graphs/Heatmap";
import { connect, useDispatch } from "react-redux";
import { actions, initialState } from "./redux/EDARedux";
import DropDown from "../GlobalExplainability/DropDown";
import { AreaChartData, StackedColumnLineChartData, GraphSeries, HeatMapData, IEDAState, StackedBarChartData } from "../../Models/EDAModels";
import { getEDAData } from "./redux/EDACRUD";
import { Link, useParams } from "react-router-dom";
import { PageTitle } from "../../../_metronic/layout/core";
import Header from "../../components/header";
import { ErrorsPage } from "../../modules/errors/ErrorsPage";

type EDAProps = {
  edaData : IEDAState
};


const EDA:React.FC<EDAProps> = ({edaData}) => {

  const dispatch = useDispatch()
  const {projectId} = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [recordsFound, setRecordsFound] = useState(true)

  // Destructuring data
  const { columnAndLineChart, stackedBarChart, areaChart, heatMap } = edaData

  // Variables for stackedColumnLineGraph
  const [columnLineGraphCategories , setColumnLineGraphCategories] = useState<string[]>()
  const [columnLineGraphSeries , setColumnLineGraphSeries] = useState<GraphSeries[]>()
  const [dropdownOptions, setDropdownOptions] = useState<string[]>(['Age of Vehicle','Annual Income','Vehicle Price'])
  const [selectedDropdownOption, setSelectedDropdownOption] = useState<string>(dropdownOptions[0])
  
  //Variables for stackedBarChart
  const [stackedBarChartSeries,setStackedBarChartSeries] = useState<GraphSeries[]>()
  const [stackedBarChartCategories, setStackedBarChartCategories] = useState<string[]>()

  //Variables for areaChart
  const [areaChartCategories, setAreaChartCategories] = useState<string[]>()
  const [areaChartSeries, setAreaChartSeries] = useState<GraphSeries[]>()

  //Variables for heatMap
  const [xAxisCategoriesHeatMap,setXAxisCategoriesHeatmap] = useState<string[]>()
  const [yAxisCategoriesHeatMap,setYAxisCategoriesHeatmap] = useState<string[]>()
  const [heatMapPoints , setHeatMapPoints] = useState<(number | null)[]>()
  const [valuesForRangeCalc,setValuesForRangeCalc]= useState<number [] | (number | null)[]>([])

  //setChart methods begin here 
  const setColumnLineChart = (stackedColumnLineChart : StackedColumnLineChartData[]) =>{ 

    let filteredByKpiArray = stackedColumnLineChart.filter((obj : StackedColumnLineChartData)=>{
      return obj.kpi === selectedDropdownOption
    })

    const columnLineGraphcategories:string[] = []
    const columnGraphDataPoints : number[] = []
    const lineGraphDataPoints : number[] = []
    const columnLineGraphSeries : GraphSeries[] = []

    filteredByKpiArray.map((data :StackedColumnLineChartData)=>{
      let claimPercentageValue = data.averageFraudPercentage * 100
      columnLineGraphcategories.push(data.slab)
      columnGraphDataPoints.push(data.claimCount)
      lineGraphDataPoints.push(claimPercentageValue)
      return true
    })

    let avgClaimsSeriesData= {
      name: 'Count of Claims',
      type: 'column',
      color : 'rgb(44, 99, 143)',
      yAxis: 1,
      data: columnGraphDataPoints,
      tooltip: {
          valueSuffix: ' '
      }
    }

    let insuranceCountSeriesData = {
      name: 'Average Fraud %',
      type: 'line',
      color : 'rgb(217, 141, 39)',
      data: lineGraphDataPoints,
      tooltip: {
          valueSuffix: ''
      }
    }
    columnLineGraphSeries.push(avgClaimsSeriesData)
    columnLineGraphSeries.push(insuranceCountSeriesData)
    setColumnLineGraphSeries(columnLineGraphSeries)
    setColumnLineGraphCategories(columnLineGraphcategories)
    setIsLoading(false)
  }

  const setStackedBarChart=(stackedBarChart:StackedBarChartData[])=>{
    const categories :string[] = []
    const ownerPercentagesArray : number[] = []
    const rentalPercentagesArray : number[] = []
    const series : GraphSeries[] = []

    stackedBarChart.map((data:StackedBarChartData)=>{
      categories.push(data.ageOfDriver)
      ownerPercentagesArray.push(data.ownerPercentage)
      rentalPercentagesArray.push(data.rentalPercentage)
      return true
  })

  let ownerSeriesData = {
      name: 'Own',
      data : ownerPercentagesArray,
      color : 'rgb(44, 99, 143)' //shade of dark blue  
      //TODO : Replace the colors with scss variables
  }
  let rentalSeriesData = {
      name: 'Rent',
      data : rentalPercentagesArray,
      color : 'rgb(217, 141, 39)' //shade of orange
      //TODO : Replace the colors with scss variables
  }
  series.push(ownerSeriesData)
  series.push(rentalSeriesData)

  setStackedBarChartSeries(series)
  setStackedBarChartCategories(categories)
  }
  
  const setAreaChart = (areaChart : AreaChartData[])=>{
    const categories : string[] = []
    const dataSeriesOne : number[] =[]
    const dataSeriesTwo : number[] = []
    const series : GraphSeries[] = []

    areaChart.map((data:AreaChartData)=>{
      let avgClaimRatePercentage = data.ownerPercentage*100
      let avgClaimRuralPercentage = data.rentalPercentage*100
      categories.push(data.vehicleWeight)
      dataSeriesOne.push(avgClaimRatePercentage)
      dataSeriesTwo.push(avgClaimRuralPercentage)
      return true
    })
    let seriesObjectOne = {
      name: 'Own',
      data : dataSeriesOne,
      color : 'rgb(44, 99, 143)' //shade of dark blue
      //TODO : Replace the colors with scss variables

    }
    let seriesObjectTwo = {
      name: 'Rent',
      data : dataSeriesTwo,
      color : 'rgb(217, 141, 39)' //shade of orange
      //TODO : Replace the colors with scss variables
    }
    series.push(seriesObjectOne)
    series.push(seriesObjectTwo)

    setAreaChartCategories(categories)
    setAreaChartSeries(series)
  }

  const setHeatmap = (data:HeatMapData) =>{
    const {xAxisCategories : xAxisCategoriesHeatMap , yAxisCategories : yAxisCategoriesHeatMap , values }= data
    var filterededValuesWithoutNull : number [] | (number | null)[] = values.filter(function (element) {
      return element != null;
      });
    setValuesForRangeCalc(filterededValuesWithoutNull)
    const pointsArray : (number | null)[] = []
    let index = 0
    for(let pointer1 = 0; pointer1 < xAxisCategoriesHeatMap.length; pointer1++)
    {
      for(let pointer2=0; pointer2 < yAxisCategoriesHeatMap.length; pointer2++)
      {
        if (values[index]  === undefined) break
        let tempArray:any  = []  //ERROR
        tempArray.push(pointer1)
        tempArray.push(pointer2)
        tempArray.push(values[index])
        index++
        pointsArray.push(tempArray)
      }
    }
    setHeatMapPoints(pointsArray)
    setXAxisCategoriesHeatmap(xAxisCategoriesHeatMap)
    setYAxisCategoriesHeatmap(yAxisCategoriesHeatMap)
  }
  //setChart methods end here

  //Make API call and update redux 
  useEffect(()=>{
    if(isLoading && projectId && edaData === initialState) {
      getEDAData(projectId).then(({data})=>{
        console.log(data)
        dispatch(actions.getEDAData(data.data))
      }).catch((err)=>{
          setRecordsFound(false)
      })
    }
  },[edaData,isLoading,dispatch, projectId])

  //Updates charts with data
  useEffect(()=>{
    const isDataAvailable = columnAndLineChart && stackedBarChart && areaChart && heatMap
    if(!isDataAvailable)
    return

    setColumnLineChart(columnAndLineChart)
    setStackedBarChart(stackedBarChart)
    setAreaChart(areaChart)
    setHeatmap(heatMap)

  },[columnAndLineChart,selectedDropdownOption,stackedBarChart,areaChart,heatMap])

	return !recordsFound?(
    <>
    <ErrorsPage message="Exploratory data analysis is not yet available!" />
    </>
    ):(
    <><PageTitle element={<Header title="Exploratory Data Analysis" >
      <Link className="btn btn-primary" to='/model_comparison/62863b043f0d7d1c5443a354'>
        Run Models
      </Link>

    </Header>} ></PageTitle>
    <div className="container-fluid d-flex flex-column justify-content-around">
      <div className="d-flex flex-row justify-content-start flex-fill">
        <div className="card col-6 flex-fill m-2">
          <div className="p-3">
            <label className="fw-bolder m-1 p-2">Select KPI :-</label>
            <DropDown
              categories={dropdownOptions}
              setChangeCategory={setSelectedDropdownOption} />
          </div>
          {columnLineGraphCategories && columnLineGraphSeries &&
            <StackedColumnLineChart
              categories={columnLineGraphCategories}
              series={columnLineGraphSeries}
              yAxisTitle='Count of Claims'
              secondaryYAxisTitle='Avg % Fraud'
              chartTitle={` Avg fraud percentage Claims & Total Insurance by ${selectedDropdownOption}`} />}
        </div>
        <div className="card col-6 flex-fill m-2 pt-20 ">
          {stackedBarChart && stackedBarChartCategories && stackedBarChartSeries &&
            <StackedBarChart
              categories={stackedBarChartCategories}
              series={stackedBarChartSeries}
              xAxisTitle='Age of Driver'
              yAxisTitle='Living Status'
              chartTitle='' />}
        </div>
      </div>
      <div className="d-flex flex-row flex-fill">
        <div className="card col-6 flex-fill m-2 pt-5">
          {areaChart && areaChartSeries && areaChartCategories &&
            <AreaChart
              categories={areaChartCategories}
              series={areaChartSeries}
              chartTitle=''
              xAxisTitle=''
              yAxisTitle='' />}
        </div>
        <div className="card col-6 flex-fill m-2 pt-10">
          {xAxisCategoriesHeatMap && yAxisCategoriesHeatMap && heatMapPoints &&
            <Heatmap
              xAxisCategories={xAxisCategoriesHeatMap}
              yAxisCategories={yAxisCategoriesHeatMap}
              chartTitle=''
              valuesForCalRange={valuesForRangeCalc}
              data={heatMapPoints} />}
        </div>
      </div>
    </div></>
	);
};

function mapState(state:any){
  const {eda:edaData} = state
  return {edaData}
}
export default connect(mapState)(EDA);