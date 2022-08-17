import React from 'react'
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { GraphProps } from '../../../Models/GraphModels';

const AreaChart:React.FC<GraphProps>  = (props) => {
    const {series, chartTitle, xAxisTitle, yAxisTitle} = props
    
    const options = {
        chart: {
            type: 'area',
        },
        title: {
            text: chartTitle,
            align:'left',
            style:{
            fontFamily:`Poppins, Helvetica, "sans-serif"`,
            fontWeight:'600',
            }
        },
        legend: {
            align: 'center',
            verticalAlign: 'top'
        },
        xAxis: {
            categories: props.categories,
            title: {
                text: xAxisTitle
            }
        },
        yAxis: {
            title: {
                text: yAxisTitle
            }
        },
        credits: {
            enabled: false
        },
        series: series
    }

return <HighchartsReact highcharts={Highcharts} options={options} />;

}

export default AreaChart