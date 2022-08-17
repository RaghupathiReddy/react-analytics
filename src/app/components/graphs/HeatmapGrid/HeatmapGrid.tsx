import Highcharts from "highcharts";
import HighchartsHeatmap from "highcharts/modules/heatmap";
import HighchartsReact from "highcharts-react-official";
import { MatrixCellInfo, MatrixRow } from "../../../Models/MatrixModels";
import { getCellInfo,getChartPointPositionFromEvent, getColumnHeadingsFromMatrixData, getColumnsFromMatrixData, getRowHeadingsFromMatrixData } from "../../../helpers/utility";
import { GraphDataClass } from "../../../Models/GraphModels";

HighchartsHeatmap(Highcharts);

interface HeatMapGridProps{
    matrixData: MatrixRow[]; 
    heading?: string;
    graphDataClasses?: GraphDataClass[];
    setSelectedCellInfo?: (cellInfo: MatrixCellInfo) => void;
}


const HeatmapGrid = (props: HeatMapGridProps) => {

    const { matrixData, heading, graphDataClasses } = props;
    
    const rowHeadings = getRowHeadingsFromMatrixData(matrixData);
    const minGridHeight = 150;
    const defaultHeight = 400;
    var minHeight: number | undefined = 0;

    if(rowHeadings.length < 5){
      minHeight = minGridHeight*rowHeadings.length;
    }else{
      minHeight = defaultHeight;
    }

    const columnHeadings = getColumnHeadingsFromMatrixData(matrixData);
    
    const graphData = getGraphData();

    const handleGridSelection = (event: any) => {
      const cellPosition = getChartPointPositionFromEvent(event); 
      const cellInfo = getCellInfo(matrixData, cellPosition);

      if(graphDataClasses)
      {
        const color=graphDataClasses[event.point.dataClass].color;
        cellInfo.color=color;
      }
      props.setSelectedCellInfo?.(cellInfo);
    }

    const chartOptions = {
        chart: {
          type: "heatmap",
          plotBorderWidth: 0,
          borderWidth: 0,
          height:minHeight
        },
        tooltip: {
          enabled: false
        },
        credits: {
          enabled: false
        },
        title: {
          text: heading,
          align:'left',
          margin:50,
          style:{
            fontFamily:'Poppins, Helvetica, "sans-serif"',
            fontWeight: '600',
          }
        },

        exporting: {
            enabled: false
        },
        plotOptions:{
          series: {
            events: {
              click: handleGridSelection,
            },
          },
        },

        xAxis: {
          categories: columnHeadings,
          opposite: true,

        },
      
        yAxis: {
          categories: rowHeadings,
          title: null
        },
        legend: {
            align: 'center',
            verticalAlign: 'top',
            floating: true,
            y:15,
            layout: 'horizontal',
            valueDecimals: 0,
            backgroundColor: ( // theme
                Highcharts.defaultOptions &&
                Highcharts.defaultOptions.legend &&
                Highcharts.defaultOptions.legend.backgroundColor
            ) || 'rgba(255, 255, 255, 0.85)'
        },
      
        colorAxis:{
            dataClasses: graphDataClasses
        },
        series: [
          {
            borderWidth: 1,
             data:graphData,

            dataLabels: {
              enabled: true,
              color: "#000000"
            },
            cursor: "pointer"
          }
        ]

      };
    function getGraphData() {
        const matrixColumns = getColumnsFromMatrixData(matrixData);
          const data = matrixColumns
            .map((l, i) => 
              l.map((c, j) => ({                  
                x: j,
                y: i,
                value: c.value,
                name: c.value.toLocaleString(),
              }))
            )
            .flat();
          return data;
    }

  return (
    <div className='card p-3'>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
     </div>
  );
}

export default HeatmapGrid;