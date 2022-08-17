import React from 'react'
import HighChartReact from 'highcharts-react-official'
import HighChart from 'highcharts'

require('highcharts/modules/exporting.js')(HighChart)
require('highcharts/modules/export-data.js')(HighChart)

type PieChartProps = {
  data: any
  title: string
}
const PieChart: React.FC<PieChartProps> = (props) => {
  const {data, title} = props
  const options = {
    title: {
      text: title,
      align: 'left',
      style: {
        fontWeight:'600',
        fontFamily: `Poppins, Helvetica, "sans-serif"`,
      },
    },
    chart: {
      type: 'pie',
    },
    credits: {
      enabled:false,
    },
    series: [
      {
        name: 'Amount',
        colorByPoint: true,
        data: data,
      },
    ],
  }
  return (
    <div className='card p-3'>
      <HighChartReact highcharts={HighChart} options={options} />
    </div>
  )
}

export default PieChart
