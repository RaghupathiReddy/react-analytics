import React, { useEffect, useState } from 'react'
import HighChart from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

export interface ModelDetailGraphData {
  data: number[][]
}
interface LineGraphProps {
  title: string | undefined
  yAxisTitle: string
  xAxisTitle: string
  categories?: number[]
  data: ModelDetailGraphData[] | EDAGraphData[] | number[][]
}


export interface EDAGraphData {
  data: number[]
  name: string
}
const LineGraph: React.FC<LineGraphProps> = (props) => {
  const { xAxisTitle, yAxisTitle, data, title, categories } = props

  const [chartData, setChartData] = useState<ModelDetailGraphData[] | EDAGraphData[] | number[][]>(data);

  const options = {
    exporting: {
      enabled: false
    },
    chart: {
      height: 230,
      type: 'spline'
    },
    credits: {
      enabled: false,
    },
    title: {
      text: title,
      align: 'left',
      style: {
        fontWeight: '600',
        fontFamily: `Poppins, Helvetica, "sans-serif"`,
      },
    },

    yAxis: {

      title: {
        text: yAxisTitle,
      },
      allowDecimals: categories ? false : true,
      min: categories ? "0" : null,
      max: categories ? "1" : null,

    },

    xAxis: {
      categories: categories ? categories : null,
      title: {
        text: xAxisTitle,
      },

    },

    legend: {
      layout: 'horizontal',
      align: 'right',
      verticalAlign: 'top',
    },

    plotOptions: {
      series: {
        label: {
          connectorAllowed: false,
          useHTML: true,
          style: {
            textTransform: "uppercase",
          }
        },
      },
    },

    series:  chartData,

    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 500,
          },
          chartOptions: {
            legend: {
              layout: 'horizontal',
              align: 'center',
              verticalAlign: 'bottom',
            },
          },
        },
      ],
    },
  }

  useEffect(() => {
    setChartData(data)
  }, [data])



  return (
    <div className='card'>
      <HighchartsReact highcharts={HighChart} options={options} />
    </div>
  )
}

export default LineGraph
