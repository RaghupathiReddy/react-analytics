import React, { FC } from 'react'
import { FraudOptions } from './StackedGraph'

type ToggleButtonProps = {
  fraudOptions: FraudOptions[]
  setGraphType: (value: string) => void,
  graphType: string
}

const ToggleButton: FC<ToggleButtonProps> = ({ fraudOptions, setGraphType, graphType }) => {
  const handleGraphChange = (value: string,) => {
    setGraphType(value)
  }
  return (

    <div className="btn-group " data-kt-buttons="true" data-kt-buttons-target="[data-kt-button]">
      {fraudOptions && fraudOptions.map(el => (
        <label onClick={() => handleGraphChange(el.value)} className={`btn btn-sm btn-outline-secondary text-muted text-hover-white text-active-white btn-outline btn-active-success ${graphType === el.value ? "active" : ""}`} data-kt-button="true" data-bs-toggle="tooltip" data-bs-placement="top" title={el.toolTip}>

          <input className="btn-check" type="radio" name="method" value={el.value} />

          {el.value}
        </label>
      ))}


    </div>
  )
}

export default ToggleButton
