import HighCharts from 'highcharts'
import HighChartsReact from 'highcharts-react-official'
import processViolin from './Violin'
import HC_more from 'highcharts/highcharts-more'
HC_more(HighCharts)
type ViolinGraphProps = {
  series: any[]
  yAxisTitle: string
}
const ViolinGraph: React.FC<ViolinGraphProps> = (props) => {
  const {series, yAxisTitle} = props
  const getDataArray = (data: any[]) => {
    var dataArray: number[][] = []
    for (let index = 0; index < data.length; index++) {
      const element = data[index]

      dataArray.push(element.values)
    }
    return dataArray
  }

  const getCategories = (data: any[]) => {
    var dataArray: string[] = []
    for (let index = 0; index < data.length; index++) {
      const element = data[index]

      dataArray.push(element.label)
    }
    return dataArray
  }

  const categoryDataArray = getDataArray(series)
  const categories = getCategories(series)

  const step = 1
  const precision = 0.0000000000001
  const width = 1
  const processedViolinData = processViolin(step, precision, width, ...categoryDataArray)

  const xAxisCoordinates = processedViolinData.xiData
  let dataArray: any = {}
  dataArray = processedViolinData.results.map((obj, index) => {
    var object: {[k: string]: any} = {}
    object.data = obj
    object.name = categories[index]
    return object
  })

  const options = {
    title: 
    {
      text: 'Explaination Feature Violin Chart',
      align: 'left',
      margin:50,
      style:{
       fontWeight:'600',
       fontFamily: `Poppins, Helvetica, "sans-serif"`,
      }
    },
    chart: {
      type: 'areasplinerange',
      inverted: true,
      animation: true,
    },
    credits: {
      enabled: false,
    },
    xAxis: {
      reversed: false,
      title: {
        text: yAxisTitle,
      },
    },
    yAxis: {
      min: 0,
      categories: categories,
      reversed: true,
      startOnTick: true,
      endOnTick: true,
      gridLineWidth: 0,
      title: {
        text: '',
      },
      max: processedViolinData.results.length - 1,
    },
    tooltip: {
      useHTML: true,
      valueDecimals: 3,
      // formatter: headerFunc
    },
    plotOptions: {
      series: {
        cursor: 'pointer',
        marker: {
          enabled: false,
        },
        states: {
          hover: {
            enabled: false,
          },
        },
        color: 'rgb(124, 181, 236);',

        pointStart: xAxisCoordinates[0],
      },
    },
    legend: {enabled: false},
    color: 'rgb(124, 181, 236);',
    series: dataArray,
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
export default ViolinGraph
