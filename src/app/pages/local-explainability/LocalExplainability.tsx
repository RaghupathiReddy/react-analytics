import React, {useEffect, useState} from 'react'
import {PageTitle} from '../../../_metronic/layout/core'
import {Button, Col, Row, Accordion} from 'react-bootstrap'
import SplitPane from 'react-split-pane'
import RecordEditorTable from './tables/RecordEditorTable'
import InferTable from './tables/InferTable'
import ScatterGraph from './graph/ScatterPlot'
import {useDispatch, connect} from 'react-redux'
import {useParams} from 'react-router-dom'
import {getData} from './redux/LocalExplainabilityCrud'
import * as localExpData from './redux/LocalExplainabilityRedux'
import {IScatterPlotPointsData} from './models/ScatterPlotModel'

type  localExplainabilityProps={
  predictedYesRecordsArray: Array<localExpData.dataObject>
  predictedNoRecordsArray: Array<localExpData.dataObject>
  pairSeriesNameWithData: Object
  showCounterfactualValues: boolean
}

const LocalExplainability: React.FC<localExplainabilityProps> = ({
  predictedYesRecordsArray,
  predictedNoRecordsArray,
  pairSeriesNameWithData,
  showCounterfactualValues,
}) => {
  const dispatch = useDispatch()
  const {modelId} = useParams()

  //below states store the dropdown values and scatter plot points
  const [xAxisVariable, setXAxisVariable] = useState<string>('')
  const [yAxisVariable, setYAxisVariable] = useState<string>('')
  const [predictedYesPoints, setPredictedYesPoints] = useState<(string | number)[][]>()
  const [predictedNoPoints, setPredictedNoPoints] = useState<(string | number)[][]>()
  const [scatterPlotPointsData, setScatterPlotPointsData] = useState<IScatterPlotPointsData[]>([])
  const [dropdownCategories, setDropdownCategories] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const toggleCounterfactualValue = () => {
    dispatch(localExpData.actions.toggleCounterfactual())
  }

  //Makes an API call to fetch data and store it in redux
  useEffect(() => {
    if (modelId) {
      getData(modelId)
        .then(({data}) => {
          dispatch(localExpData.actions.getData(data.defaultData))
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }, [modelId, dispatch])

  useEffect(() => {
    if (
      loading &&
      predictedNoRecordsArray &&
      !pairSeriesNameWithData.hasOwnProperty('predictedNo')
    ) {
      //Object.keys here returns dropdown categories which are required to plot scatterplot
      let categoriesArray = predictedNoRecordsArray && Object.keys(predictedNoRecordsArray[0])
      setDropdownCategories(categoriesArray)
      setXAxisVariable(categoriesArray[0])
      setYAxisVariable(categoriesArray[2])
      dispatch(localExpData.actions.setPairDataPredictedNo(predictedNoRecordsArray))
    }
    if (
      loading &&
      predictedYesRecordsArray &&
      !pairSeriesNameWithData.hasOwnProperty('predictedYes')
    ) {
      dispatch(localExpData.actions.setPairDataPredictedYes(predictedYesRecordsArray))
      setLoading(false)
    }
  }, [predictedNoRecordsArray, predictedYesRecordsArray, pairSeriesNameWithData, dispatch, loading])

  // update 'scatplotpoints'
  useEffect(() => {
    if (xAxisVariable && yAxisVariable) {
      if (predictedYesRecordsArray) {
        let scatPlotPoints: (string | number)[][] = []
        for (let pointer = 0; pointer < predictedYesRecordsArray.length; pointer++) {
          let temp: any = predictedYesRecordsArray[pointer]
          let tempArray: (string | number)[] = []
          tempArray.push(temp[xAxisVariable])
          tempArray.push(temp[yAxisVariable])
          scatPlotPoints.push(tempArray)
          tempArray = []
        }
        setPredictedYesPoints(scatPlotPoints)
        scatPlotPoints = []
      }
      if (predictedNoRecordsArray) {
        let scatPlotPoints: (string | number)[][] = []
        for (let pointer = 0; pointer < predictedNoRecordsArray.length; pointer++) {
          let temp: any = predictedNoRecordsArray[pointer]
          let tempArray: (string | number)[] = []
          tempArray.push(temp[xAxisVariable])
          tempArray.push(temp[yAxisVariable])
          scatPlotPoints.push(tempArray)
          tempArray = []
        }
        setPredictedNoPoints(scatPlotPoints)
        scatPlotPoints = []
      }
    }
  }, [predictedNoRecordsArray, predictedYesRecordsArray, xAxisVariable, yAxisVariable])

  //update data
  useEffect(() => {
    if (predictedYesPoints && predictedNoPoints) {
      let predictedNoPointsData = [{name: 'predictedNo', color: 'red', data: predictedNoPoints}]
      let tempObj = {name: 'predictedYes', color: 'blue', data: predictedYesPoints}
      predictedNoPointsData.push(tempObj)
      setScatterPlotPointsData(predictedNoPointsData)
    }
  }, [scatterPlotPointsData.length, predictedNoPoints, predictedYesPoints])

  return (
    <>
      {loading === true ? (
        <PageTitle>Loading...</PageTitle>
      ) : (
        <PageTitle>Local Explainability for --modelName--</PageTitle>
      )}
      <div>
        <Row>
          <SplitPane
            split='vertical'
            minSize={500}
            defaultSize={500}
            maxSize={900}
            style={{position: 'relative'}}
          >
            <div className='card-body'>
              <Col>
                <Row>
                  <Accordion defaultActiveKey={['1', '2']} alwaysOpen>
                    {showCounterfactualValues === true ? (
                      <Button
                        className='m-2'
                        onClick={() => toggleCounterfactualValue()}
                      >
                        Hide Counterfactual Values
                      </Button>
                    ) : (
                      <Button
                        className='m-2'
                        onClick={() => toggleCounterfactualValue()}
                      >
                        Show Counterfactual Values
                      </Button>
                    )}
                    <Accordion.Item className='scroll mh-300px' eventKey='1'>
                      <Accordion.Header>Record Editor</Accordion.Header>
                      <Accordion.Body>
                        <RecordEditorTable />
                      </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey='2'>
                      <Accordion.Header>Infer</Accordion.Header>
                      <Accordion.Body className='infer-table'>
                        <Button
                        // onClick={() => {
                        //     hook_Graph.predict();
                        // }}
                        >
                          Predict
                        </Button>
                        <InferTable />
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </Row>
              </Col>
            </div>
            <div className='card-body'>
              {pairSeriesNameWithData && (
                <ScatterGraph
                  xAxisLabel={xAxisVariable}
                  handleXAxisVariable={setXAxisVariable}
                  yAxisLabel={yAxisVariable}
                  handleYAxisVariable={setYAxisVariable}
                  dropdownOptions={dropdownCategories}
                  data={scatterPlotPointsData}
                  pairSeriesNameWithData={pairSeriesNameWithData}
                />
              )}
            </div>
          </SplitPane>
        </Row>
      </div>
    </>
  )
}

function mapState(state: any) {
  const {
    predictedYesRecordsArray,
    predictedNoRecordsArray,
    pairSeriesNameWithData,
    showCounterfactualValues,
    pointEditedByUser,
  } = state.localExplainability


  return {
    predictedYesRecordsArray,
    predictedNoRecordsArray,
    pairSeriesNameWithData,
    showCounterfactualValues,
    pointEditedByUser,
  }
}

export default connect(mapState)(LocalExplainability)
