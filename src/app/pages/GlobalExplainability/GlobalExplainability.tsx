import React, {useEffect, useState} from 'react'
import {PageTitle} from '../../../_metronic/layout/core'
import {useParams} from 'react-router-dom'
import * as newGlobalExplainabilityData from './redux/GlobalExpRedux'
import {connect, useDispatch} from 'react-redux'
import {getGlobalExplainability} from './redux/GlobalExplainability'
import BubbleGraph from '../../components/graphs/BubbleGraph/BubbleGraph'
import BarGraph from '../../components/graphs/BarGraph/BarGraph'
import PartialDependenceGraph from '../../components/graphs/PartialDependenceGraph/PartialDependenceGraph'
import ViolinGraph from '../../components/graphs/ViolinGraph/ViolinGraph'
import PageLoader from '../../components/loaders/PageLoader'

const GlobalExplainability: React.FC<{
  globalExplainability: newGlobalExplainabilityData.IGEState
}> = ({globalExplainability}) => {
  const [isLoading, setIsLoading] = useState(true)
  const [violinGraphData, setViolinGraphData] = useState<any[]>([])
  const [barGraphData, setBarGraphData] = useState<any[]>([])
  const [bubbleGraphData, setBubbleGraphData] = useState<any[]>([])
  const [changeCategory, setChangeCategory] = useState<any>(0)
  const [category, setCategory] = useState<any[]>([])
  const [isDropDownAvailable, setIsDropDownAvailable] = useState<boolean>(true)

  const [spline, setSpline] = useState<any[]>([])
  const {recordId} = useParams()

  console.log(globalExplainability)
  const geDataReduxStore = globalExplainability.globalExplainabilityData.categories

  const modelData = globalExplainability.globalExplainabilityData.modelData
  const dispatch = useDispatch()
  useEffect(() => {
    const getgeDataReduxStore = async () => {
      await getGlobalExplainability(recordId)
        .then((data) => {
          dispatch(newGlobalExplainabilityData.actions.GetGlobalExplainabilityData(data.data))
          setIsLoading(false)
        })

        .catch(() => {
          alert('no data')
        })
    }
    getgeDataReduxStore()

    return () => {}
  }, [dispatch, recordId])

  useEffect(() => {
    if (geDataReduxStore) {
      const apiGraphData = geDataReduxStore
      getCategory(geDataReduxStore)
      setviolinGraph(apiGraphData)
      setBarGraph(geDataReduxStore)
      setBubbleGraph(apiGraphData, category[0])
      setSplineGraph(apiGraphData)
      setIsLoading(false)
    }
  }, [geDataReduxStore])

  //getting bar graph plot points
  const records = geDataReduxStore?.map((el: any) => {
    return el.records
  })

  //getting the categories for dropdown
  const getCategory = (geDataReduxStore: any[]) => {
    var dropDownArray = geDataReduxStore?.map((el: any) => {
      return el.category
    })

    setCategory(dropDownArray)
  }
  //getting the bubble graph data

  const getCategoryDict = (graphData: any[]) => {
    var categoryDict: {[k: string]: any} = {}

    for (let index = 0; index < graphData.length; index++) {
      const categoryData = graphData[index]

      const categoryName = categoryData.category
      const categoryShapValue = categoryData.shap

      const categoryRecords = categoryData.records

      var formattedCategoryDataList = []

      for (let index = 0; index < categoryRecords.length; index++) {
        const record = categoryRecords[index]

        var formattedCategoryData = {
          isPredicted: record.isPredicted,
          recordId: record.id,
          shap: record.shap,
          deviationFromMean: record.deviationFromMean,
          predictedProbability: record.predictedProbability,
        }
        formattedCategoryDataList.push(formattedCategoryData)
      }

      categoryDict[categoryName] = {
        shap: categoryShapValue,
        records: formattedCategoryDataList,
      }
    }

    return categoryDict
  }
  const setBubbleGraph = (apiGraphData: any[], selectedCategory: string) => {
    const categoryDataDict = getCategoryDict(apiGraphData)

    const categoryData = categoryDataDict[changeCategory]

    const categoriesBubbleData = getBubbleFromCategory(records[changeCategory])
    setBubbleGraphData(categoriesBubbleData)
  }

  useEffect(() => {
    if (changeCategory && geDataReduxStore) {
      setBubbleGraph(geDataReduxStore, changeCategory)
    }
  }, [changeCategory])

  const getBubbleFromCategory = (records: any[]) => {
    var bubbleData = []
    for (let index = 0; index < records.length; index++) {
      const record = records[index]
      const x = record.shap
      const y = record.deviationFromMean
      const z = record.predictedProbability

      var singleBubble = {
        x: x,
        y: y,
        z: z,
        name: category[changeCategory],
        isPredicted: record.isPredicted,
      }
      bubbleData.push(singleBubble)
    }
    return bubbleData
  }

  //getting the bar graph data

  const setBarGraph = (geDataReduxStore: any[]) => {
    const barData = getBarGraphData(geDataReduxStore)
    setBarGraphData(barData)
  }

  const getBarGraphData = (geDataReduxStore: any[]) => {
    var barSeries: any = []

    const barData = geDataReduxStore.map((element) => {
      return element.shap
    })

    var barObject = {
      name: 'Shap Value',
      data: [...barData],
    }

    barSeries.push(barObject)

    return barSeries
  }

  //getting the violin graph data

  const setviolinGraph = (records: any[]) => {
    const violinData = getViolinData(records)
    setViolinGraphData(violinData)
  }

  const getShapValuesFromRecords = (records: any[]) => {
    var shapValues = []
    for (let index = 0; index < records.length; index++) {
      const record = records[index]
      shapValues.push(record.shap)
    }
    return shapValues
  }

  const getViolinData = (graphData: any[]): any[] => {
    var violinData: any[] = []

    for (let index = 0; index < graphData.length; index++) {
      const categoryData = graphData[index]
      const shapValues = getShapValuesFromRecords(categoryData.records)

      var categoryGraphData = {
        label: categoryData.category,
        values: shapValues,
      }

      violinData.push(categoryGraphData)
    }

    return violinData
  }

  //Spline Graph

  const getSplineRange = (graphData: any[]): any[] => {
    var SplineData: any[] = []

    for (let index = 0; index < graphData.length; index++) {
      const categoryData = graphData[index]
      const shapValues = getShapValuesFromRecords(categoryData.records)

      var categoryGraphData = {
        name: categoryData.category,
        data: shapValues,
      }

      SplineData.push(categoryGraphData)
    }

    return SplineData
  }

  const setSplineGraph = (records: any[]) => {
    const violinData = getSplineRange(records)
    setSpline(violinData)
  }
  return (
    <>
      {isLoading ? (
        <PageLoader />
      ) : (
        <>
          <div className='container'>
            <div className='card shadow-sm p-2 mb-5  '>
              <h1 className='m-auto p-3 m-2'>XAI View</h1>
              {modelData && (
                <div className='  d-flex align-items-center flex-wrap m-auto '>
                  <h3 className='p-3'>
                    Model: <span className='text-muted'>{modelData.modelName}</span>
                  </h3>
                  <h3 className='p-3'>
                    Type: <span className='text-muted'>{modelData.modelType}</span>
                  </h3>
                  <h3 className='p-3'>
                    Class: <span className='text-muted'>{modelData.modelClass}</span>{' '}
                  </h3>
                  <h3 className='p-3'>
                    Target: <span className='text-muted'>{modelData.modelTarget}</span>{' '}
                  </h3>
                </div>
              )}
            </div>
            <div className=' row gy-5 g-xl-8'>
              <div className=' col-xxl-6'>
              <BarGraph
                  title='Feature important Bar Chart'
                  xAxisTitle='Shap Value'
                  series={barGraphData}
                  categories={category}
                />
              </div>
              <div className='col-xxl-6'>
                <BubbleGraph
                  color='black'
                  title='Explaination Feature Bubble Graph'
                  setChangeCategory={setChangeCategory}
                  categories={category}
                  series={bubbleGraphData}
                  xAxisTitle={'Shap value'}
                  yAxisTitle={'P(risky) - AVG(P(risky))'}
                  isDropDownAvailable={isDropDownAvailable}
                />
              </div>
              <div className='  col-xxl-6'>
                <PartialDependenceGraph
                  color='black'
                  title='Partial Dependence Plot'
                  yAxisTitle='P(Creditwothiness=risky)'
                  xAxisTitle='Shap Value'
                  series={spline}
                />
              </div>
              <div className='col-xxl-6'>
                <ViolinGraph yAxisTitle='Shap value' series={violinGraphData} />
              </div>
            </div>
          </div>
        </>
      )}
      <PageTitle>Global Explainability</PageTitle>
    </>
  )
}

function mapState(state: any) {
  const {globalExplainability} = state
  return {globalExplainability}
}
const actionCreators = {
  //   getAllTopics: apiActions.getAllTopics,
  //   selectTopic: apiActions.selectTopic
}
export default connect(mapState, actionCreators)(GlobalExplainability)
