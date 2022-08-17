import React from 'react'
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { GraphProps } from '../../../Models/GraphModels';


const StackedColumnLineChart:React.FC<GraphProps> = (props) => {
    const { categories, selectedStackRange, series, xAxisTitle, isStackBarSelected, yAxisTitle, secondaryYAxisTitle, chartTitle, plotline } = props

    function addColorToBar(event: any) {

        var indexP = event.point.x,
            series = event.point.series.chart.series;

        if (series[0].data[indexP].selected) {
            //unselect
            series[0].data[indexP].select(false, true);
            series[1].data[indexP].select(false, true);

        } else {
            var i = 0;
            var len = series[1].data.length;
            for (i = 0; i < len; i++) { //clear all selection
                series[0].data[i].select(false, true);
                series[1].data[i].select(false, true);
                series[2].data[i].select(false, true);
            }
            //select
            series[0].data[indexP].select(true, true);
            series[1].data[indexP].select(true, true);
            series[2].data[indexP].select(true, true);
        }

        return false;
    }
    const highlightOnCLick = (event: any) => {
        console.log(event)
        addColorToBar(event)

        if (event.point.category !== selectedStackRange) {
            if (props.setIsStackBarSelected) props.setIsStackBarSelected(true)

            if (props.setSelectedStackRange) props.setSelectedStackRange(event.point.category)


        } else {
            console.log(false)
            if (props.setIsStackBarSelected) props.setIsStackBarSelected(false)

            if (props.setSelectedStackRange) props.setSelectedStackRange("")

        }

    }

    const options = {
        chart: {
            zoomType: 'xy',
            height: 320,
        },
        credits: {
            enabled: false
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
             title: {
                 text: xAxisTitle,
             },
            categories: categories,
            crosshair: true,
            plotLines: plotline,
        },
        yAxis: [{ // Primary yAxis
            title: {
                text: secondaryYAxisTitle,
            },

        }, { // Secondary yAxis
            title: {
                text: yAxisTitle,
            },
            opposite: true
        }],
        tooltip: {
            shared: true
        },

        plotOptions: {
            column: {
                stacking: 'normal',
                point: {
                    events: {
                        click: highlightOnCLick,
                    }
                }
            },

        },


        legend: {
            layout: 'horizontal',
            align: 'right',
            verticalAlign: 'top',
        },
        exporting: {
            enabled: false,
        },

        series: series,

    }

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}

export default StackedColumnLineChart
