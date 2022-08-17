import HighCharts from 'highcharts'
import HighChartsReact from 'highcharts-react-official'

require('highcharts/modules/exporting.js')(HighCharts)
require('highcharts/modules/export-data.js')(HighCharts)

type PartialDependenceGraphProps = {
  series: object
  yAxisTitle: string
  xAxisTitle: string
  title: string
  color: string
}
const PartialDependenceGraph: React.FC<PartialDependenceGraphProps> = (props) => {
   const {xAxisTitle, yAxisTitle, title, series, color} = props
  const options = {
    chart: {
      type: 'spline',
      plotBorderWidth: 1,
      zoomType: 'xy',
    },

    legend: {
      enabled: false,
    },

    credits: {
      enabled:false,
    },

     title: {
     text: title,
     align: 'left',
     margin:50,
     style:{
      fontWeight:'600',
      fontFamily: `Poppins, Helvetica, "sans-serif"`,
     }
    },
    xAxis: {
      gridLineWidth: 1,
      title: {
        text: xAxisTitle,
      },
      labels: {
        format: '{value} ',
      },
      plotLines: [
        {
          color: color,
          dashStyle: 'dot',
          width: 2,
          value: 65,
          label: {
            rotation: 0,
            y: 15,
            style: {
              fontStyle: 'italic',
            },
          },
          zIndex: 3,
        },
      ],
    },

    yAxis: {
      startOnTick: false,
      endOnTick: false,
      title: {
        text: yAxisTitle,
      },
      labels: {
        format: '{value} ',
      },
      maxPadding: 0.2,
      plotLines: [
        {
          color: color,
          dashStyle: 'dot',
          width: 2,
          value: 50,
          label: {
            align: 'right',
            style: {
              fontStyle: 'italic',
            },

            x: -10,
          },
          zIndex: 3,
        },
      ],
    },

    plotOptions: {
      series: {
        dataLabels: {
          enabled: true,
          format: '{point.name}',
        },
      },
    },
    series: series,
  }

  return (
    <div className={`card`}>
      <div className='card-body'>
        <div id='kt_charts_widget_1_chart' />
        <HighChartsReact highcharts={HighCharts} options={options} />
      </div>
    </div>
  )
}

export default PartialDependenceGraph
