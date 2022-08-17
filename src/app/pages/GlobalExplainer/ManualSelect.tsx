import React, { FC } from 'react'

interface IThresholdSlider {
  minThreshold: number;
  maxThreshold: number;
  setValue: (value: number) => void;
  manualInput: number,
  setManualInput: (value: number) => void;
  setSelectedThreshold: (value: number) => void;
  setIsManualBinEnabled?: (value: boolean) => void;
  step: number
}
const ManualSelect: FC<IThresholdSlider> = ({ minThreshold, manualInput, maxThreshold, setManualInput, setValue, setSelectedThreshold, setIsManualBinEnabled, step }) => {

  const handleManualInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    var newThreshold = parseFloat(event.target.value);
    if (newThreshold > 1) {
      newThreshold = .5
    }
    setManualInput(newThreshold);
  }

  const handleSubmitClick = (e: any) => {
    e.preventDefault()
    setSelectedThreshold(manualInput);
    setValue(manualInput);
    if (setIsManualBinEnabled) setIsManualBinEnabled(false)
  }
  return (
    <form onSubmit={handleSubmitClick} className=' d-flex justify-content-between align-items-center align-self-between align-content-center'>

      <input type="number" className='mx-2 w-100px form-control form-control-sm' max={maxThreshold} min={minThreshold} step={step} value={manualInput} onChange={handleManualInputChange} data-bs-toggle="tooltip" data-bs-placement="top" title="Enter Number Between 0.01 to 1" />

      <button
        type="submit"
        className='btn btn-primary btn-sm d-none  '
        onClick={handleSubmitClick}

      >Submit</button>
    </form>
  )
}

export default ManualSelect