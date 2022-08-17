
import React, { FC } from 'react'

interface ProgressBarWithNegAxisProps {
  value: number
  maximumShapAverage: number
}
const ProgressBarWithNegAxis: FC<ProgressBarWithNegAxisProps> = (props) => {
  var negativeValue, positiveValue;
  var maximumShapAverage = props.maximumShapAverage
  if (props.value >= 0) {
    positiveValue = props.value
  } else {
    negativeValue = props.value 

  }

  const negativeBarWidth = (negativeValue) && (Math.abs(negativeValue) / Math.abs(maximumShapAverage)) * 100
  const positiveBarWidth = (positiveValue) && (Math.abs(positiveValue) / Math.abs(maximumShapAverage)) * 100
  let roundedNegativeValue = negativeValue?.toFixed(2)
  let roundedPositiveValue = positiveValue?.toFixed(2)

  return (
    <div className="d-flex justify-content-between ">
      <div className="w-100 h-100 position-relative text-center">
        <span className='position-absolute text-start fw-bolder ' style={{
          zIndex: 5,
          color: "black",
        }}>{roundedNegativeValue}</span>
        <div className={`position-absolute end-0 text-transparent fw-bolder`} style={{
          width: negativeBarWidth + "%",
          zIndex: 0,
          background: "rgb(247, 200, 139)"
        }}>
          {roundedNegativeValue}
        </div>
      </div>
      <div className="w-100 h-100 position-relative text-center ">
        <span className='position-absolute text-end fw-bolder' style={{
          zIndex: 5,
          color: "black",
          padding: "2px"
        }}>{roundedPositiveValue}</span>
        <div className={` position-absolute  start-0 text-transparent`} style={{
          width: positiveBarWidth + "%",
          background: "rgb(171, 214, 249)",
          zIndex: 0,
        }}>
          {roundedPositiveValue}
        </div>
      </div >
    </div>
  )
}

export default ProgressBarWithNegAxis