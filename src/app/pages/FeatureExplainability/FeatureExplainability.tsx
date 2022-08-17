import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import HeatMapGraph from "../../components/graphs/HeatmapGraph/HeatMapGraph";
import FeatureExplainabilityTable from "./FeatureExplainabilityTable";
import { getFeatureExplainbilityByID } from "./redux/FeatureExplainbilityCRUD";
import * as fEData from "./redux/FeatureExplainabilityRedux";
import { connect, useDispatch } from "react-redux";
import { PageTitle } from "../../../_metronic/layout/core";
import Header from "../../components/header";
import { TableColumnField } from "../../Models/ModelResultModel";
import PageLoader from '../../components/loaders/PageLoader'
import { FeatureExplainabilityTableData, OccurenceData, OccurenceTableColumnField, TableColumn, TreeMapData } from "../../Models/FeatureExplainabilityModels";
import { ResColumnDef } from "../../Models/MatrixModels";
import TableWrapper from "../../components/Tables/table-wrapper";
import { AgGridReact } from "ag-grid-react";
import { ErrorsPage } from "../../modules/errors/ErrorsPage";

const FeatureExplainability: React.FC<{featureExplainability: fEData.IFEState}> = ({ featureExplainability }) => {
  const [featureCategories, setFeatureCategories] = useState<TreeMapData[]>([]);
  const [categorySelectedFromGraph, setCategorySelectedFromGraph] =
    useState<string>("");
  const [currentSelectedRow, setCurrentSelectedRow] = useState<string>("");
  const [explainabilityData, setExplainabilityData] =useState<FeatureExplainabilityTableData[]>([]);
  const [treemapData, setTreemapData] = useState<TreeMapData[]>([]);
  const [tableData, setTableData] = useState<FeatureExplainabilityTableData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tableHeader, setTableHeader] = useState<ResColumnDef[]>([]);
  const [occurenceTableData, setOccurenceTableData] = useState<OccurenceTableColumnField[]>([]);
  const [occurenceTableHeader, setOccurenceTableHeader] = useState<ResColumnDef[]>([]);
  const [occurenceData, setOccurenceData] = useState<OccurenceData[]>([])
  const { projectId } = useParams();
  const dispatch = useDispatch();
  const featureExplainabilityData =
    featureExplainability.featureExplainabilityData.data;

  useEffect(() => {
    if (featureExplainabilityData) {
      const { featureExplainabilityTreemap, featureExplainabilityTable ,featureExplainabilityEntryTable} = featureExplainabilityData;
      setTreemapData(featureExplainabilityTreemap);
      setTableData(featureExplainabilityTable);
      setOccurenceData(featureExplainabilityEntryTable)
    }
  }, [featureExplainabilityData]);
  const getFeatureExplainability = () => {
    if (!projectId || featureExplainabilityData) {
      setIsLoading(false);
      return;
    }
    getFeatureExplainbilityByID(projectId)
      .then((data) => {
        dispatch(fEData.actions.GetFeatureExplainability(data.data));
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    getFeatureExplainability();
  }, [projectId, featureExplainabilityData]);

  const loadRoundedValues = (data: FeatureExplainabilityTableData[]|OccurenceData[]|OccurenceTableColumnField[]) => {
    tableData.forEach((element: any) => {
      Object.entries(element).forEach(([key, value]) => {
        if (typeof value === "number") {
          element[key] = +value.toFixed(2);
        }
      });
    });
  };

  useEffect(() => {
    loadRoundedValues(tableData);
    loadRoundedValues(occurenceTableData)
  }, [tableData,occurenceTableData]);

  useEffect(() => {
    if (categorySelectedFromGraph === "") {
      setExplainabilityData(tableData);
    } else {
      const filteredDataFromGraph = tableData.filter((category: any) => {
        return category.category === categorySelectedFromGraph;
      });
      setExplainabilityData(filteredDataFromGraph);
    }

    return () => {};
  }, [categorySelectedFromGraph, tableData]);

  const getTreeMapData = () => {
    const treeMapData = treemapData.map((treeMapPoints: any) => ({
      name: treeMapPoints.category,
      value: parseInt(treeMapPoints.features),
      colorValue: parseInt(treeMapPoints.rank),
    }));
    return treeMapData;
  };

  useEffect(() => {
    const treeMapGraphData = getTreeMapData();
    setFeatureCategories(treeMapGraphData);
  }, [treemapData]);

  const getTableHeader = (tableData: FeatureExplainabilityTableData[]): ResColumnDef[] => {
    let tableHeader: ResColumnDef[] = [];
    let header: ResColumnDef;;
    for (let key in tableData[0]) {
      if (key === "rank") {
        header = {
          field: key,
          flex: 2,
          resizable: true,
        };
      }
      else if(key === "feature" || key === "category") {
        header = {
          field: key,
          flex: 3,
          resizable: true,
        };
      }
      
      else {
        header = {
          field: key,
          flex: 2,
          resizable: true,
        };
      }

      tableHeader.push(header);
    }



    tableHeader.unshift({
      field: "Select",
      headerName: "Select",
      flex: 2,
      checkboxSelection: true,
    });

    return tableHeader;
  };

  useEffect(() => {
    const tableHeader = getTableHeader(tableData);
    setTableHeader(tableHeader);
  }, [tableData]);

  
  const getOccurenceData = (currentSelectedRow: string,occurenceData: any[]) => {
    let occurence:any ={}
    let occurenceList:OccurenceTableColumnField[] = []
    if (currentSelectedRow) {
      occurenceData.forEach((featureType) => {
        const originalProbabilityOfClaim=featureType.biasedProbability
        const newProbabilityOfClaim=featureType.biasedProbability-featureType[currentSelectedRow]
        occurence={
          claimNumber:featureType.claimNumber,
          originalProbabilityOfClaim:originalProbabilityOfClaim.toFixed(2),
          newProbabilityOfClaim:newProbabilityOfClaim.toFixed(2),
          change:(originalProbabilityOfClaim-newProbabilityOfClaim).toFixed(2)
        }

        occurenceList.push(occurence)
      });
     
    } else {
      occurenceData.forEach((featureType) => {
         occurence={
          claimNumber:featureType.claimNumber,
          originalProbabilityOfClaim:featureType.biasedProbability.toFixed(2),
          newProbabilityOfClaim:0,
          change:0
        }

        occurenceList.push(occurence)
      });
    }
    return occurenceList
  };

  useEffect(() => {
    const occurenceDatas: any = getOccurenceData(currentSelectedRow,occurenceData);
    loadRoundedValues(occurenceDatas)

    setOccurenceTableData(occurenceDatas);
  }, [occurenceData, currentSelectedRow]);

  const getOccurenceTableHeader = (): ResColumnDef[] => {
    let tableHeaderForOccurence: ResColumnDef[] = [];
    let headerForOccurence: ResColumnDef;

    for (let key in occurenceTableData[0]) {
      if(key ==="newProbabilityOfClaim"||key==="change"){
        headerForOccurence = {
          field: key,
          resizable: true,
          cellRenderer:"PercentageRenderer",
          flex: 1,
        };
      }else if(key ==="claimNumber"){
        headerForOccurence = {
          field: key,
          resizable: true,
          flex: 1,
        };
      }else{
          headerForOccurence = {
          field: key,
          resizable: true,
          flex: 1,
          valueFormatter: (params:any) => params.value +" %",
        };
      }
      
      tableHeaderForOccurence.push(headerForOccurence);
    }

    return tableHeaderForOccurence;
  };

  useEffect(() => {
    const tableHeaders = getOccurenceTableHeader();
    setOccurenceTableHeader(tableHeaders);
  }, [occurenceTableData]);
  if (isLoading) {
    return <PageLoader />
  }

  return (
    <>
    <PageTitle element={<Header title='Feature Explainability' >
    <Link className="btn btn-primary" to="bias-identification/62863b043f0d7d1c5443a354" > Bias Identification</Link>
      </Header>} />
      {featureExplainabilityData ? (
        <>
          <div className="card">
            <HeatMapGraph
              setCurrentSelectedRow={setCurrentSelectedRow}
              graphTitle="Feature and Bias by Category"
              setCategorySelectedFromGraph={setCategorySelectedFromGraph}
              series={featureCategories}
            />
          </div>
          <div className="row ">
            <div className="col-xxl-6">
              <FeatureExplainabilityTable
                setExplainabilityData={setExplainabilityData}
                data={tableData}
                tableHeader={tableHeader}
                tableData={explainabilityData}
                setCurrentSelectedRow={setCurrentSelectedRow}
                tableType="featureTable"
              />
            </div>

            <div className="col-xxl-6">
            <FeatureExplainabilityTable
                setCurrentSelectedRow={setCurrentSelectedRow}
                data={tableData}
                setExplainabilityData={setExplainabilityData}
                tableHeader={occurenceTableHeader}
                tableData={occurenceTableData}
                tableType="occurenceTable"
              />
            </div>
          </div>
        </>
      ) : (
          <ErrorsPage message={'Feature Explainability records not found!'}></ErrorsPage>
      )}
    </>
  );
};

function mapState(state: any) {
  const { featureExplainability } = state;
  return { featureExplainability };
}

export default connect(mapState)(FeatureExplainability);