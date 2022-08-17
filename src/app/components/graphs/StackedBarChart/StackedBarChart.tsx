import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { GraphProps } from "../../../Models/GraphModels";


const StackedBarChart:React.FC<GraphProps> = (props) => {
	const {xAxisTitle, yAxisTitle, chartTitle, series, categories} = props
	const options = {
		chart: {
			type: "column",
		},
		title: {
			text: chartTitle,
			align:'left',
			style:{
				fontFamily:`Poppins, Helvetica, "sans-serif"`,
				fontWeight:'600',
			}
		},
		credits: {
			enabled: false,
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
				text: yAxisTitle,
			},
			stackLabels: {
				enabled: false,
				style: {
					fontWeight: "bold",
					color: "gray",
				},
			},
		},
		legend: {
			align: "center",
			verticalAlign: "top"
		},
		tooltip: {
			headerFormat: "<b>{point.x}</b><br/>",
			pointFormat: "{series.name}: {point.y}<br/>Total: {point.stackTotal}",
		},
		plotOptions: {
			column: {
				stacking: "normal",
				dataLabels: {
					enabled: false,
				},
			},
		},
		series: series,
	};

	return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default StackedBarChart;
