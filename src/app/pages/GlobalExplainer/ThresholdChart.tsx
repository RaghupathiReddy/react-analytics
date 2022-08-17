import React, { FC, useEffect, useState } from 'react'
import LineGraph from '../../components/graphs/line'
import { EDAGraphData } from '../../components/graphs/line/LineGraph'
import { areStringsEqualIgnoreCase } from '../../helpers/utility'
import { GlobalData, GlobalExplainerTiles } from './GlobalExplainerModel'

interface ThresholdGraphProps {
  globalExplainability: GlobalData[]
  cardData: GlobalExplainerTiles[]
}

const ThresholdChart: FC<ThresholdGraphProps> = ({ globalExplainability, cardData }) => {
  const [currentKPISelection, setCurrentKPISelection] = useState<any>({
    accuracy: false,
    recall: true,
    f1: false,
    precision: true,
    auc: false
  });
  const [kpiChartData, setKpiChartData] = useState<EDAGraphData[]>([])
  const [kpiMetricList] = useState<any>(cardData.map(el => el.property));
  const [categories, setCategories] = useState<number[]>([])

  const getKPIChartData = (kpiMetricList: any) => {
    let kpiData: any = []

    kpiMetricList.forEach((element: any) => {
      if (currentKPISelection[element]) {
        kpiData.push({
          name: element,
          data: globalExplainability.map((el: any) => el[element]),
        })
      }


    })

    return kpiData


  }

  const getChartCategories = (globalExplainability: GlobalData[]) => {
    return globalExplainability.map((el: any) => el.probability.toFixed(2))
  }
  useEffect(() => {

    const chartData: EDAGraphData[] = getKPIChartData(kpiMetricList)

    const category = getChartCategories(globalExplainability)

    setKpiChartData(chartData)

    setCategories(category)

  }, [kpiMetricList, currentKPISelection, globalExplainability])

  function handleKPISelectionChange(kpiMetric: string, isChecked: boolean) {
    kpiMetricList.forEach((metric: any) => {
      if (areStringsEqualIgnoreCase(metric, kpiMetric))
        setCurrentKPISelection({ ...currentKPISelection, [metric]: isChecked });

    })
  }
  return (
    <div className='card shadow-sm p-2  h-100'>

      <div className='d-flex align-self-between align-content-center align-item-center justify-content-between' onChange={(e: any) => { handleKPISelectionChange(e.target.value, e.target.checked); }}>
        <div className="d-flex flex-column p-2">
          <h3>Model Metrics</h3>
          <span className="text-muted fw-bold text-capitalize">{kpiMetricList.map((el: any) => (<span className='fs-6'>{currentKPISelection[el] ? <span>({el}), </span> : null}</span>))}</span>
        </div>


        <div className="btn-group h-40px" data-kt-buttons="true" data-kt-buttons-target="[data-kt-button]">


          {kpiMetricList && kpiMetricList.map((kpi: any) => (
            <label className={`btn form-check-label text-capitalize btn-sm btn-outline-secondary bg-hover-light-success text-muted text-hover-white btn-outline  ${currentKPISelection[kpi] ? "active text-active-white btn-active-success" : ""}`} data-kt-button="true" data-bs-toggle="tooltip" data-bs-placement="top" >

              <input className="btn-check w-100 h-100" type="checkbox" name="method" value={kpi} />

                {kpi === "auc" ? "AUC" : kpi === "f1" ? "F1 Score" : kpi}
              </label>
          ))}

        </div>

      </div>
      <LineGraph
        data={kpiChartData}
        title={``}
        yAxisTitle='KPI values'
        xAxisTitle="Probability Threshold" 
        categories={categories}
      />

    </div>

  )
}

export default ThresholdChart