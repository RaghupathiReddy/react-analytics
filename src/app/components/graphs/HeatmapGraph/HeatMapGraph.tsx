import HighChartsReact from "highcharts-react-official";
import HighCharts from "highcharts";
import HC_more from "highcharts/highcharts-more";
import HighchartsTreemap from "highcharts/modules/treemap";
import HighchartsHeatmap from "highcharts/modules/heatmap";
import Coloraxis from "highcharts/modules/coloraxis";
import { useMemo } from "react";

HighchartsTreemap(HighCharts);
HighchartsHeatmap(HighCharts);
Coloraxis(HighCharts);
HC_more(HighCharts);

type HeatMapGraphProps = {
  series: object;
  setCategorySelectedFromGraph: (value: string) => void;
  graphTitle: string;
  setCurrentSelectedRow: (value: string) => void;
};
const HeatMapGraph: React.FC<HeatMapGraphProps> = (props) => {
  const { series, setCategorySelectedFromGraph, graphTitle, setCurrentSelectedRow } =
    props;
    const highlightOnCLick=(event: any)=>{
     
        const point = event.point;
        const previousClickedPoint = point.series.clickedPoint;

        if (previousClickedPoint) {
          previousClickedPoint.update(
            { color: previousClickedPoint.originalColor },
            false
          );
        }

        point.originalColor = point.color;
        point.series.clickedPoint = point;

        point.update(
          {
            color: new HighCharts.Color(point.color).tweenTo(
              new HighCharts.Color("#515151"),//dark grey color for highlighting
              0.7
            ),
          },
          false
        );
        point.series.chart.redraw();

        if (point.node.childrenTotal === 0) {
          var category = point.node.name;

          setCategorySelectedFromGraph(category);
          setCurrentSelectedRow("");
        }
      }
    
  const options = useMemo(
    () => ({
      chart: {
        height: 300,
      },
      title: {
        text: graphTitle,
        align: "left",
        style: {
          fontWeight: "600",
          fontFamily: `Poppins, Helvetica, "sans-serif"`,
       },
      },
      credits: { enabled: false },
      tooltip: {
        useHTML: true,
        backgroundColor: "#515151",//dark grey color
        headerFormat: '<b className="p-2">{point.name}</b>',
        pointFormat: `
        <div style="display: flex;text-transform:capitalize; flex-direction:column;"> 
          <h3 style="border-bottom:1px solid #c1c1c1;color:white; padding-bottom:3px">{point.name}</h3>
          <div  style='padding-top:-15px'>
          Rank-{point.colorValue}</br>
          No Of Features-{point.value}
          </div>
        </div>`,
        followPointer: true,
        style: {
          color: "white",
          textTransform: "capitalize",
        },
      },
      colorAxis: {
        minColor: "#EF8B47", // lighter shade of orange
        maxColor: "#FBDDCB", //darker shade of orange
        enabled: false,
      },
      series: [
        {
          name: "Export",
          type: "treemap",
          layoutAlgorithm: "squarified",
          allowDrillToNode: true,
          turboThreshold: Infinity,
          dataLabels: {
            enabled: true,
            crop: true,
          },
          
          borderColor: "black",
          levels: [
            {
              level: 1,
              colorByPoint: true,
              dataLabels: {
                enabled: true,
                useHTML: true,
                format:
                  '<div className="p-2"><h6 >{point.name}</h6> </p> Rank-{point.colorValue} </br>No of Features-{point.value} </div>',
                style: {
                  textOutline: false,
                  fontSize: 14,
                  textAlign: "center",
                  color: "black",
                },
                zIndex: 9,
              },
              borderWidth: 2,
            },
          ],
          data: series,
        },
      ],
      plotOptions: {
        treemap: {
          allowPointSelect: true,
          color: "#ff6600",
          states: {
            select: {
              enabled: true,
              borderColor: "black",
              borderWidth: 3,
            },
          },
          
        },
        series: {
            cursor: "pointer",
          events: {
            click: highlightOnCLick,
          },
        },
      },
    }),
    [series]
  );

  return (
    <div className="card p-2 d-flex flex-fill  ">
      <HighChartsReact highcharts={HighCharts} options={options} />
    </div>
  );
};

export default HeatMapGraph;
