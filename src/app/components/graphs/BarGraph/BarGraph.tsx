import React from 'react'
import HighCharts from 'highcharts'
import HighChartsReact from 'highcharts-react-official'

type BarGraphProps = {
  categories: any[]
  series: object
  xAxisTitle: string
  title: string
}
const BarGraph: React.FC<BarGraphProps> = (props) => {
  const {xAxisTitle,title, series, categories} = props
  const options = {
   title: {
    text: title,
    align:'left',
    style:{
      fontWeight:'600',
        fontFamily: `Poppins, Helvetica, "sans-serif"`,
    },
     },
    chart: {
      type: 'bar',
    },

    xAxis: {
      categories: categories,
      title: {
        text: xAxisTitle,
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: xAxisTitle,
        align: 'low',
      },
      labels: {
        overflow: 'justify',
      },
    },
    tooltip: {
      valuePrefix: '',
    },
    plotOptions: {
      bar: {
        dataLabels: {
          enabled: true,
        },
      },
    },
    legend: {
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'top',
      x: -40,
      y: 80,
      floating: true,
      borderWidth: 1,
      backgroundColor: '#FFFFFF',
      shadow: true,
    },
    credits: {
      enabled: false,
    },

    
    series: series,
  }
  return (
    <div className='card'>
      <div className='card-body'>
        <div id='kt_charts_widget_1_chart' />
        <HighChartsReact highcharts={HighCharts} options={options} />
      </div>
    </div>
  )
}

export default BarGraph
