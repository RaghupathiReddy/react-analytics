import { useEffect, useState } from 'react';
import { PageTitle } from '../../../_metronic/layout/core'
import Header from '../../components/header'
import TableWrapper from '../../components/Tables/table-wrapper';
import HeatmapGrid from '../../components/graphs/HeatmapGrid/HeatmapGrid'
import NetworkGraph from '../../components/graphs/NetworkGraph/Network'
import { NetworkGraphLink } from '../../Models/GraphModels'
import { MatrixCell, MatrixCellInfo, MatrixRow } from '../../Models/MatrixModels'
import BiasTable from './BiasTable';
import { Link, useParams } from 'react-router-dom';
import { getBiasFeaturesByID } from './BiasPageCRUD';
import { connect, useDispatch } from 'react-redux';
import * as biasFeatureRedux from "./redux/BiasFeatureRedux";
import { BiasFeaturePageData, BiasTableRow } from '../../Models/BiasModels';
import PageLoader from '../../components/loaders/PageLoader';
import { DataClassesColor } from '../../Models/ThemeModels';
import { ErrorsPage } from '../../modules/errors/ErrorsPage';

const BiasIdentification: React.FC<{biasFeaturesData?: BiasFeaturePageData}> = (props)=> {
  const { biasFeaturesData } = props;
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
 
  const [networkGraphData, setNetworkGraphData] = useState<any>(null);

  const [biasTableData, setBiasTableData] = useState<BiasTableRow[]>([]);

  const [matrixData, setMatrixData] = useState<any>(null);

  const [networkColor, setNetworkColor] = useState<string> ('grey');

  const { projectId } = useParams();

  const [apiResponse, setApiResponse] = useState<any>(null);

  const dispatch = useDispatch();
  
  const graphDataClasses = [
    // this is a value to color map for a heatmap or a graph 
    {
      from: 0, // this is for null or zero value
      to: 0,
      name: 'No Value',
      color: DataClassesColor.noValue,
    },
    {
      from: 1,
      to: 3,
      name: 'Low',
      color: DataClassesColor.low,
    },
    {
      from: 4,
      to: 6,
      name: 'Normal',
      color: DataClassesColor.normal,
    },
    {
      from: 7,
      to: 9999,
      name: 'High',
      color: DataClassesColor.high,
    }
  ]

  useEffect(() => {
    if(apiResponse){
      const matrixData = getMatrixData(apiResponse)
      setMatrixData(matrixData);
      const networkGraphData = getNetworkGraphData(apiResponse, "all");
      setNetworkGraphData(networkGraphData);   
      setBiasTableData(apiResponse.biasDataList);
      setIsLoading(false);
    }
  }, [apiResponse])

  useEffect(() => {
    
    if(projectId) {


      const isDataAvailable = biasFeaturesData !== biasFeatureRedux.initialBiasFeaturesData.biasFeaturesData;
      
      if(!isDataAvailable){
        getBiasFeaturesByID(projectId)
        .then((response: any) =>{
          let api_response = response.data.data;
          dispatch(biasFeatureRedux.actions.GetBiasFeaturesData(api_response));
          setApiResponse(api_response)
          setIsLoading(false)
        }).catch((error) => {
          console.log(error);
          setIsLoading(false)

        });
      }else{
        setApiResponse(biasFeaturesData);

      }
    }
  }, [projectId])

  function getMatrixData(apiResponse:any): MatrixRow[] {
    let matrixData: MatrixRow[] = []
    
    apiResponse.biasFeatures.forEach((feature: any) => {
      let matrixRow: MatrixRow = {
        heading: feature.featureCategory,
        cells: []
      }

      matrixRow.cells = getCellsForMatrixRow(feature.biasInfoList)

      matrixData.push(matrixRow)
    })
    return matrixData
  }

  function getCellsForMatrixRow(biasInfoList: any[]): MatrixCell[] {
    const matrixCells: MatrixCell[] = [];

    biasInfoList.forEach((biasInfo: any) => {
      let cell: MatrixCell = {
        columnHeading: biasInfo.biasCategory,
        value: biasInfo.biasIndicator
      }
      matrixCells.push(cell)
   })

    return matrixCells;
  }


  function getNetworkGraphData(apiResponse:any, biasCategory: string): NetworkGraphLink[] {
    let networkGraphData: NetworkGraphLink[] = []
    
    apiResponse.biasFeatures.forEach((feature: any) => {
      feature.biasInfoList.forEach((biasInfo: any) => {

        if(biasInfo.featureList && biasInfo.featureList.length > 0 ) {

          const links = getLinksForCategory(biasInfo, biasCategory);

          networkGraphData.push(...links) 
        }
      })
    })
    return networkGraphData
  }

  function getLinksForCategory(biasInfo:any, category:string) {
    let networkGraphLinks: NetworkGraphLink[] = []

    if(category === biasInfo.biasCategory || category === "all"){
      biasInfo.featureList.forEach((feature: any) => {
        let link: NetworkGraphLink = {
          from: biasInfo.biasCategory,
          to: feature
        }
        networkGraphLinks.push(link);
      })
    }

    return networkGraphLinks;
  }


  const setNetworkGraph = (gridHeadingInfo: MatrixCellInfo) => {
    const biasCategory = gridHeadingInfo.columnHeading;
    const newNetworkColor=gridHeadingInfo.color;
    const newNetworkGraphData =  getNetworkGraphData(apiResponse, biasCategory);
    if (newNetworkColor)
       setNetworkColor(newNetworkColor)
    setNetworkGraphData(newNetworkGraphData);
  }
  if(isLoading) {
    return <PageLoader />
  }

  return (
    <div>
      <PageTitle
        element={
          <Header title="Bias Identification and Selection">
            <Link
              className="btn btn-primary"
              to="/model-results/62863b043f0d7d1c5443a354"
            >
              Confirm Selection
            </Link>
          </Header>
        }
      />
      {matrixData && networkGraphData && biasTableData ? (<> <div className="row gy-5 g-xl-8 px-2">
        <div className="col-xl-6 p-2">
          <HeatmapGrid
            matrixData={matrixData}
            setSelectedCellInfo={setNetworkGraph}
            graphDataClasses={graphDataClasses}
            heading="Feature Category to Bias Category Map"
          />
        </div>
        <div className="col-xl-6 p-2 ">
          <NetworkGraph
            heading="Bias to Feature Map"
            networkColor={networkColor}
            data={networkGraphData}
          ></NetworkGraph>
        </div>
      </div>

        <div className="row gy-5 g-xl-8 ">
          <TableWrapper>
            <BiasTable tableRows={biasTableData} />
          </TableWrapper>
        </div></>) : (
        <ErrorsPage message={'Bias Idenification records not found!'}></ErrorsPage>
      )}

    </div>
  );
}

function mapState(state: any) {
  const { biasFeatureData } = state;  
  return biasFeatureData;
}
export default connect(mapState, {})(BiasIdentification);