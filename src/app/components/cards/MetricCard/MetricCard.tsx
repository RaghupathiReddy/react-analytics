import {KTSVG} from '../../../../_metronic/helpers'
import { CardsProps } from '../../../Models/CardModels'

function MetricCard(props: CardsProps) {
  const {title, iconPath, value, themeColor, size} = props
  const svgSize = size*10
  const fontSize = size*0.25+"rem"
  return (
    <div className='card shadow-sm p-2 h-100 '>
      <h2 className='fs-2 card-title text-center my-2'>{title}</h2>
      <div className='row w-100 h-100 d-flex align-content-center justify-content-between align-items-center align-self-center'>
        <div className='col-5 m-auto d-flex align-content-center justify-content-center align-items-center align-self-center '>
          <KTSVG path={iconPath} svgClassName={`mh-${svgSize}px`}  className={`svg-icon svg-icon-${size}tx svg-icon-${themeColor}`} />
        </div>
        <div className='col-7 d-flex '>
          <p style={{fontSize:fontSize}} className='m-auto text-left'>{value}</p>
        </div>
      </div>
    </div>
  )
}

export default MetricCard
