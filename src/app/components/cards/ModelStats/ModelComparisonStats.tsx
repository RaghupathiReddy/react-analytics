import clsx from 'clsx'
import React from 'react'
import { KTSVG } from '../../../../_metronic/helpers'

interface modeComparisonScores  {
  accuracyScore: number
  precisionScore: number
  aucScore: number
  recallScore: number
}

type modelStatsProps = {
  iconPath: string
  cardTitle: string
  modelComparisonInfo: modeComparisonScores
  handleOnClick: (modelData: any, cardTitle: string) => void
  modelData?: any //TODO : Update data type after API response is setup
  isBorderHighlighted: boolean
  iconColorClass?:string  // the string format should be something like this 'svg-icon-danger'| 'svg-icon-{color}'
}
const getModelStatsScore = (title: string, score: number) => {
  const scorePercentage = (score*100).toFixed(2)
  return (
    <div>
      <h6 className=' mt-1 mb-0 font-weight-bold'>{title}</h6>
      <p className='mt-0 mb-1'>{scorePercentage}%</p>
    </div>
  )
}
const ModelComparisonStats: React.FC<modelStatsProps> = (props) => {
  const {iconPath, iconColorClass, cardTitle, modelComparisonInfo, handleOnClick, modelData, isBorderHighlighted} =
    props
  const {accuracyScore, precisionScore, aucScore, recallScore} = modelComparisonInfo
  return (
    <div
      className={clsx(
        'model-comparison-stats-card col-lg-1 card flex-fill text-center shadow-sm m-2',
        {
          'highlight': isBorderHighlighted,
        },
        {
          'blur': !isBorderHighlighted,
        }
      )}
      onClick={() => handleOnClick(modelData, cardTitle)}
    >
      <div className='card-header bg-light'>
        <div className='card-title d-flex flex-fill flex-row align-items-center justify-content-evenly'>
          <div>
            <KTSVG path={iconPath} className={`svg-icon-3x ${iconColorClass}` }></KTSVG>
          </div>
          <div className='p-1'>
            <h5>{cardTitle}</h5>
          </div>
        </div>
      </div>
      <div className='card-body row'>
        <div className='col right-border'>
          <div className='row d-flex flex-column border-bottom'>
            {getModelStatsScore('Accuracy', accuracyScore)}
          </div>
          <div className='row d-flex flex-column border-top'>
            {getModelStatsScore('Precision', precisionScore)}
          </div>
        </div>
        <div className='col left-border'>
          <div className='row d-flex flex-column border-bottom'>
            {getModelStatsScore('Recall', recallScore)}
          </div>
          <div className='row d-flex flex-column border-top'>
            {getModelStatsScore('AUC', aucScore)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModelComparisonStats
