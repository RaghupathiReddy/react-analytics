import Highcharts, { SeriesNetworkgraphOptions } from "highcharts";
import networkgraph from "highcharts/modules/networkgraph";
import { useEffect, useState } from "react";
import { NetworkGraphLink } from "../../../Models/GraphModels";

if (typeof Highcharts === "object") {
  networkgraph(Highcharts);
}

interface NetworkGraphProps {
  data: NetworkGraphLink[];
  heading?: string; 
 networkColor?:string;
}

const NetworkGraph = (props: NetworkGraphProps) => {
  const { data ,heading,networkColor } = props;

  const [chart, setChart] = useState<Highcharts.Chart | null>(null);

  function getNewOptions(newNetworkLinks: NetworkGraphLink[]) {

    const series: SeriesNetworkgraphOptions[] = [{
      data: newNetworkLinks,
      type: 'networkgraph',
      accessibility: {
        enabled: false
      },
      dataLabels: {
        enabled: true,
        linkFormat: ''
      },
      id: 'network-tree',
    }]
    
    const options = {
      chart: {
        type: 'networkgraph',
      },
      title: {
        text: heading
      },
      exporting: {
        enabled: false
    },
    credits: {
      enabled:false,
    },
      plotOptions: {
        networkgraph: {
          keys: ['from', 'to'],
          color:networkColor,
          layoutAlgorithm: {
            friction: -0.990,
            gravitationalConstant: 0.4,
            
            repulsiveForce: function () {
              return 5;
          },
          }
        }
      },
      series: series
    }
    return options;
  }


  useEffect(() => {
    const newOptions: Highcharts.Options = getNewOptions(data);
    var chart = Highcharts.chart('container-graphOne', newOptions)
    setChart(chart)
  }, [data,networkColor])

  return (
    <div className='card p-3'>
      <div id="container-graphOne">
      </div>
    </div>
  );
}

export default NetworkGraph;