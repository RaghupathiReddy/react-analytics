import {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import {PageTitle} from '../../../_metronic/layout/core'
import MetadataCard from '../../components/cards/MetaDataCard'
import LineGraph from '../../components/graphs/line'
import {ModelDetailGraphData} from '../../components/graphs/line/LineGraph'
import Header from '../../components/header'
import ConfusionMatrix from '../../components/Tables/ConfusionMatrix'
import {getRoundedString, getCombinedArray} from '../../helpers/utility'
import MetricCard from '../../components/cards/MetricCard/MetricCard'
import {getModelByModelId} from './ModelCRUD'
import { MatrixCell, MatrixRow } from '../../Models/MatrixModels'
import { ModelDetailCell, ModelDataRow } from '../../Models/ModelDetails'
import PageLoader from '../../components/loaders/PageLoader'
import { ErrorsPage } from '../../modules/errors/ErrorsPage'

function ModelDetails() {
  const {modelId} = useParams()
  const [metricData, setModelData] = useState(null)
  const [metaData, setMetaData] = useState(null)
  const [matrixData, setMatrixData] = useState<MatrixRow[]|null>(null)
  const [graphData, setGraphData] = useState<ModelDetailGraphData[]>()
  const [isLoading, setIsLoading] = useState<Boolean>(true)
  useEffect(() => {
    if (modelId) {
      
        getModelByModelId(modelId).then((response) => {
          const data = response.data
          setIsLoading(false)

          const modelDetailData = data.modelDetail
          const modelDetails = modelDetailData.modelDetail

          const {metricData, metadata, confusionMatrixData, rocGraphData} = modelDetails;
          
          setModelData(metricData)
          setMetaData(metadata)

          const matrixData = convertToMatrixData(confusionMatrixData)
          
          setMatrixData(matrixData)

          const {sensitivity, specificity} = rocGraphData

          const graphData: ModelDetailGraphData[] = [
            {
              data: getCombinedArray(sensitivity.values, specificity.values),
            },
          ]

          setGraphData(graphData)
        }).catch(error=>{
          setIsLoading(false);
        })
     
    }
  }, [modelId])

  const convertToMatrixData = (dataRows:ModelDataRow[]): MatrixRow[] => {
    const matrixRows: MatrixRow[] = []

    dataRows.forEach((row:any) => {
      const matrixRow: MatrixRow = getMatrixRow(row);
      matrixRows.push(matrixRow)
    })
    return matrixRows
  }

  function getMatrixRow(row:ModelDataRow) {
    let cells: MatrixCell[] = [];

    cells = getCells(row.values);
    
    const matrixRow: MatrixRow = {
      heading: row.name,
      cells: cells
    }

    return matrixRow;
  }

  function getCells(values: ModelDetailCell[]) {
    let cells: MatrixCell[] = [];
    values.forEach((value:any) => {
        cells.push({
          columnHeading: value.name,
          value: value.value
        })
      }
    )
    return cells
  }


  if (isLoading) {
    return <PageLoader />
  }
  return (
    <>
      <PageTitle element={<Header title='Model Details' />} />

      {metricData && matrixData && metaData && graphData ?
        <div className='row g-5 g-xxl-8'>
          <div className='col-xl-6'>
            <div className='mb-5 mb-xxl-8'>
              <MetricCardGrid metricData={metricData} />
            </div>

            <div className='mb-5 mb-xxl-8'>
              <ConfusionMatrix dataRows={matrixData} />
            </div>
          </div>

          <div className='col-xl-6'>
            <div className='mb-5 mb-xxl-8'><MetadataCard metaData={metaData} /></div>
            <div className='mb-5 mb-xxl-8' />

              <LineGraph
                data={graphData}
                title='ROC Chart'
                yAxisTitle='Sensitivity'
                xAxisTitle='Specificity'
              />

          </div>
        </div>
        : <ErrorsPage message={'Model Detail records not found!'}></ErrorsPage>}
    </>

  )
}
export default ModelDetails

const MetricCardGrid = (props: any) => {
  const decimalPlacesCount = 2

  const {accuracy, macroF1Score, macroRecall, macroPrecision, weightedF1Score} = props.metricData

  const macroF1ScoreRounded = getRoundedString(macroF1Score, decimalPlacesCount)
  const macroRecallRounded = getRoundedString(macroRecall, decimalPlacesCount)
  const macroPrecisionRounded = getRoundedString(macroPrecision, decimalPlacesCount)

  const weightedF1scoreRounded = getRoundedString(weightedF1Score, decimalPlacesCount)
  const accuracyRounded = getRoundedString(accuracy, decimalPlacesCount)
  const iconSize = 3
  return (
    <div>
      <h3 className='text-center'>Metric Values</h3>
      <div className='row'>
        <div className='col-lg-4 p-2'>
          <MetricCard
            title='Accuracy'
            themeColor='primary'
            size={iconSize}
            iconPath='/media/icons/turing/accuracy.svg'
            value={accuracyRounded}
          />
        </div>
        <div className='col-lg-4 p-2'>
          <MetricCard
            iconPath='/media/icons/duotune/layouts/lay002.svg'
            size={iconSize}
            themeColor='primary'
            title='F1 Score'
            value={macroF1ScoreRounded}
          />
        </div>
        <div className='col-lg-4 p-2'>
          <MetricCard
            iconPath='/media/icons/turing/recall.svg'
            size={iconSize}
            themeColor='primary'
            title='Recall'
            value={macroRecallRounded}
          />
        </div>
        <div className='col-lg-4 p-2'>
          <MetricCard
            iconPath='/media/icons/turing/precision.svg'
            size={iconSize}
            themeColor='primary'
            title='Precision'
            value={macroPrecisionRounded}
          />
        </div>
        <div className='col-lg-4 p-2'>
          <MetricCard
            iconPath='/media/icons/turing/auc.svg'
            size={iconSize}
            title='AUC'
            themeColor='primary'
            value={weightedF1scoreRounded}
          />
        </div>
      </div>
    </div>
  )
}
