import { FC, useEffect, useState } from 'react'
import ManualSelect from './ManualSelect';
import "./style.scss"
interface IThresholdSlider  {
  threshold: number;
  minThreshold: number;
  maxThreshold: number;
  step: number;
  setValue: (value: number) => void;
}
const ThresholdSlider: FC<IThresholdSlider> = (props: IThresholdSlider) => {
  const { threshold, minThreshold, maxThreshold, step, setValue } = props;

  const [manualInput, setManualInput] = useState<number>(threshold);

  const [selectedThreshold, setSelectedThreshold] = useState(threshold);

  const handleThresholdChange = (thresholdStr: string) => {
    
    const newThreshold = parseFloat(thresholdStr);
    setSelectedThreshold(newThreshold);
    props.setValue(newThreshold);
  }

  useEffect(() => {
    setManualInput(selectedThreshold)
  }, [selectedThreshold])

  return (
    <div className="p-3 card shadow-sm ">

      <div className=' d-flex w-100 justify-content-between align-items-center align-self-between align-content-center'>
        <label className="fs-6 fw-semibold justify-content-between align-items-center align-self-between align-content-center p-3">
          Threshold Value: <span className='fw-bold'>{selectedThreshold}</span>
        </label>

        <ManualSelect step={step} maxThreshold={maxThreshold} minThreshold={minThreshold} manualInput={manualInput} setManualInput={setManualInput} setSelectedThreshold={setSelectedThreshold} setValue={setValue} />
      </div>


      <input type="range" className='range' style={{ 'background': `linear-gradient(to right, #A9A9A9 ${(selectedThreshold - minThreshold) * 100 / (maxThreshold - minThreshold)}%, #ccc 5px` }} min={minThreshold} max={maxThreshold} step={step} value={selectedThreshold}
        onChange={({ target: { value: sliderValue } }) => {handleThresholdChange(sliderValue)}}
      />
    </div>
  )
}

export default ThresholdSlider