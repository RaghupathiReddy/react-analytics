import React from "react";
import HighCharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { WaterfallGraphData } from "../../../Models/LocalExplainerModels";

type WaterfallGraphProps = {
  data: WaterfallGraphData[];
  graphTitle: string;
};
const WaterfallGraph: React.FC<WaterfallGraphProps> = (props) => {
  const { data, graphTitle } = props;

  let negativeColor = "rgb(217, 141, 39)"; //Shade of Orange
  let positiveColor = "rgb(44, 99, 143)"; // Shade of Blue
  const options = {
    chart: {
      type: "waterfall",
    },
    legend: {
      enabled: false,
    },
    title: {
      text: graphTitle,
      align: "left",
      margin:30,
      style: {
        fontWeight: "600",
        fontFamily: `Poppins, Helvetica, "sans-serif"`,
      },
    },

    xAxis: {
      type: "category",
    },

    tooltip: {
      pointFormat: "{point.field}:<b>{point.y:,.2f}</b>",
    },
    credits: {
      enabled: false,
    },
    series: [
      {
        upColor: positiveColor,
        color: negativeColor,
        data: data,
        dataLabels: {
          enabled: true,

          style: {
            fontWeight: "bold",
          },
        },
        pointPadding: 0,
      },
    ],
    plotOptions: {
      waterfall: {
        dataLabels: {
          enabled: true,
          crop: false,
          inside: false,
          overflow: "none",
          format : "<b>{point.y:,.2f}</b>"
        },
      },
    },
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 500,
          },
          chartOptions: {
            legend: {
              layout: "horizontal",
              align: "center",
              verticalAlign: "bottom",
            },
          },
        },
      ],
    },
  };
  return (
    <div className="card p-3">
      <HighchartsReact highcharts={HighCharts} options={options} />
    </div>
  );
};

export default WaterfallGraph;
