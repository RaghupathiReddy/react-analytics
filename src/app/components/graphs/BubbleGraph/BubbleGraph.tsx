import HighCharts from 'highcharts'
import HighChartsReact from 'highcharts-react-official'
import HC_more from 'highcharts/highcharts-more'
import DropDown from '../../../pages/GlobalExplainability/DropDown'
HC_more(HighCharts)
require('highcharts/modules/exporting.js')(HighCharts)
require('highcharts/modules/export-data.js')(HighCharts)

type BubbleGraphProps = {
  categories: any[]
  setChangeCategory: any
  series: any[]
  xAxisTitle: string
  yAxisTitle: string
 title: string
  color: string
  isDropDownAvailable: boolean
}
const BubbleGraph: React.FC<BubbleGraphProps> = (props) => {
  const {
    color,
    categories,
    yAxisTitle,
    xAxisTitle,
    title,
    setChangeCategory,
    series,
    isDropDownAvailable,
  } = props

  const getFormattedData = (series: any[]) => {
    var formattedData = []
    for (let index = 0; index < series.length; index++) {
      const line = series[index]

      const lineColor = line.isPredicted ? color : '#7CB5EC'

      var point = {
        type: 'bubble',
        name: line.name,
        data: [
          {
            x: line.x,
            y: line.y,
            z: line.z,
            name: line.name,
            color: lineColor,
          },
        ],
      }
      formattedData.push(point)
    }
    return formattedData
  }

  const formattedGraphData = getFormattedData(series)
  const options = {
    chart: {
      type: 'bubble',
      plotBorderWidth: 1,
      zoomType: 'xy',
    },

    legend: {
      enabled: false,
    },
    credits: {
      enabled:false,
    },
     title:{
     text:title,
     align:'left',
     style:{
       fontFamily:`Poppins, Helvetica, "sans-serif"`,
       fontWeight:'600',
     }
     },

    accessibility: {
      point: {
        valueDescriptionFormat:
          '{index}. {point.name}, shap: {point.x}, isPredicted: {point.y}, DeviationFromMean: {point.z}%.',
      },
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
    series: formattedGraphData,
  }

  const handleCategoryChange = (e: any) => {
    setChangeCategory(e.target.value)
  }
  return (
    <div className={`card`}>
        <div className='card-toolbar'>
          {isDropDownAvailable === true ? (
            <div className='p-3'>
            <DropDown setChangeCategory={setChangeCategory} categories={categories} />
            </div>
          ) : (
            ''
          )}
          {/* begin::Menu */}

          {/* end::Menu */}
        </div>

      <div className='card-body'>
        <HighChartsReact highcharts={HighCharts} options={options} />
      </div>
    </div>
  )
}

export default BubbleGraph
