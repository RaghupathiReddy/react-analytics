import React,{useEffect,useState} from 'react'
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { GraphDataClass } from "../../../Models/GraphModels";
import { DataClassesColor } from '../../../Models/ThemeModels';

type HeatMapProps = {
    xAxisCategories : string[], 
    yAxisCategories : string[], 
    chartTitle : string, 
    data :(number | null)[]
    valuesForCalRange:number[] | (number | null) []
}

function getPointCategoryName(point:any, dimension:any) {
    var series = point.series,
        isY = dimension === 'y',
        axis = series[isY ? 'yAxis' : 'xAxis'];
    return axis.categories[point[isY ? 'y' : 'x']];
}

const Heatmap:React.FC<HeatMapProps> = (props) => {
    const [heatmapDataClasses,setHeatmapDataClasses] = useState <GraphDataClass[]> ([])
    const {xAxisCategories, yAxisCategories, chartTitle, data,  valuesForCalRange} = props
    
    useEffect(() => {
        var sortedValuesForRangeCalc = valuesForCalRange.sort((a, b) =>{
         if (a === null) {
            return 1;
          }
          if (b === null) {
            return -1;
          }
        
          if (a === b) {
            return 0;
          }

          return a < b ? -1 : 1;})

        const maxValue= sortedValuesForRangeCalc[sortedValuesForRangeCalc.length-1]
        const minValue=sortedValuesForRangeCalc[0]
        var rangeOfValue
         if(maxValue !== null && minValue !== null)
            {
             rangeOfValue=(maxValue-minValue)/3
 
             const dataClasses=[
            {
                from:null,
                to:null,
                color:DataClassesColor.noValue,
                name:'No value'
            },
            {
                 from: minValue,
                 to: minValue+rangeOfValue,
                 color:DataClassesColor.low,
                 name:'Low'
             }, {
                 from:minValue+rangeOfValue+0.1 ,
                 to: maxValue-rangeOfValue,
                 color:DataClassesColor.normal,
                 name:'Normal'
             },{
                 from:maxValue-rangeOfValue+0.1,
                 to: maxValue,
                 color:DataClassesColor.high,
                 name:'High'
             }
         ]
        setHeatmapDataClasses(dataClasses)}
    }, [valuesForCalRange])

    const options = {

        chart: {
            type: 'heatmap',
        },
        credits: {
			enabled: false,
		},    
        title: {
            text: chartTitle,
            align:'left',
            style:{
            fontFamily:`Poppins, Helvetica, "sans-serif"`,
            fontWeight:'600',
            }
        },
    
        xAxis: {
            categories: xAxisCategories,
            labels:{
                style:{
                    Color:'#808080',
                },
            },
        },
    
        yAxis: {
            categories: yAxisCategories,
            title: null,
            reversed: true,
            labels:{
                style:{
                    Color:'#808080',
                },
            },
        },
    
        accessibility: {
            point: {
                descriptionFormatter: function (point:any) {
                    var ix = point.index + 1,
                        xName = getPointCategoryName(point, 'x'),
                        yName = getPointCategoryName(point, 'y'),
                        val = point.value;
                    return ix + '. ' + xName + ' sales ' + yName + ', ' + val + '.';
                }
            }
        },
   
        colorAxis: {
            dataClasses:heatmapDataClasses,
        },
       
        legend: {
            align: 'center',
            verticalAlign: 'top',
            itemStyle:{
                color:'#808080',
                },
        },
    
        series: [{
            name: '',
            borderWidth: 1,
            borderColor:'#FFFFFF',
            nullColor:DataClassesColor.noValue,
            data: data,
            dataLabels: {
                enabled: true,
                color: '#FFFFFF',
            }
        }],
    
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
            }]
        }
   
    }
    return <HighchartsReact highcharts={Highcharts} options={options} />;
}

export default Heatmap