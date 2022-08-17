import { useEffect, useState } from "react";
import { PageTitle } from "../../../_metronic/layout/core";
import WaterfallGraph from "../../components/graphs/WaterfallGraph/WaterfallGraph";
import Header from "../../components/header";
import ClaimProbabilityTable from "./ClaimProbabilityTable";
import {Bias,Claim,FeatureContribution,RemovedBiasTableColumn,TableColumnField,} from "../../Models/ModelResultModel";
import { getModelResultByID } from "./redux/ModelResultsCRUD";
import { useParams } from "react-router-dom";
import { connect, useDispatch } from "react-redux";
import * as projectModelResult from "./redux/ModelResultsRedux";
import PageLoader from "../../components/loaders/PageLoader";

import { ModelResultCardList } from "./ModelResultCardList";
import { ResColumnDef } from "../../Models/MatrixModels";
import { ErrorsPage } from "../../modules/errors/ErrorsPage";
const ModelResult: React.FC<{modelResultData: projectModelResult.IModelResultState}> = ({ modelResultData }) => {
  const claimTab = "Claim Probability Tab";
  const biasTab = "Removed Bias Tab Tab";
  const [activeTab, setActiveTab] = useState<string>("Claim Probability Tab");
  const [tableColumns, setTableColumns] = useState<ResColumnDef[]>([]);
  const [currentRowValue, setCurrentRowValue] = useState<string>("0");
  const [isLoading, setIsLoading] = useState(true);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [bias, setBias] = useState<Bias[]>([]);
  const [claimBiasDataCards, setClaimBiasDataCards] = useState<RemovedBiasTableColumn[]>([]);
  const [tableData, setTableData] = useState<Claim[]|Bias[]>([]);
  const [columnWithGraphs, setColumnWithGraphs] = useState<string[]>([]);
  const [graphData, setGraphData] = useState<FeatureContribution[]>([]);
  const [cardValue, setCardValue] = useState<string>("")

  const { projectId } = useParams();
  const dispatch = useDispatch();

  const modelResult = modelResultData.modelResultData.data;

  const getRoundedValues = (data: Claim[]|Bias[] | FeatureContribution[]) => {
    data.forEach((element: any) => {
      Object.entries(element).forEach(([key, value]) => {
        if (typeof value === "number") {
          element[key] = +value.toFixed(3);
        }
      });
    });

    return data
  };

  useEffect(() => {
    if (modelResult) {
      setClaims(modelResult.claim);
      setBias(modelResult.bias);
      setClaimBiasDataCards(modelResult.claimAndBiasDetails);
      setColumnWithGraphs(modelResult.graphEnabled);
    }
  }, [modelResult]);

  const tabClicked = (tab: string) => {
    setActiveTab(tab);
  };

  const getModelResultFromRedux = () => {
    if (!projectId || modelResult) {
      setIsLoading(false);
      return;
    }
    getModelResultByID(projectId)
      .then((data) => {
        dispatch(projectModelResult.actions.GetModelResultData(data.data));
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    getModelResultFromRedux();
  }, [projectId, modelResult]);

  const getFormatedDataForClaims = (claims: Claim[]) => {
    let claimData: any = {};
    let claimList: Claim[] = [];
    claims.forEach((claim) => {
      var fraudStatus
      if (claim.unbiasedClass === 0 && claim.biasedClass === 1) {
        fraudStatus = "Fraud to Non Fraud";
        claimData = {
          claimNo: claim.claimNo,
          outcomeChange: fraudStatus,
          biasedProbability: claim.biasedProbability,
          unbiasedProbability: claim.unbiasedProbability,
        };
        claimList.push(claimData);
      } else if (claim.unbiasedClass === 1 && claim.biasedClass === 0) {
        fraudStatus = "Non Fraud to Fraud";
        claimData = {
          claimNo: claim.claimNo,
          outcomeChange: fraudStatus,
          biasedProbability: claim.biasedProbability,
          unbiasedProbability: claim.unbiasedProbability,
        };
        claimList.push(claimData);
      }
    });
    return claimList;
  };

  const getClaimColDefs = (data: Claim[]): ResColumnDef[] => {
    let tableHeader: ResColumnDef[] = [];
    let header: ResColumnDef;

    for (let headerName in data[0]) {
      if (headerName === "claimNo") {
        header = {
          field: headerName,
          flex: 1,
          resizable: true
        };
      }
      else if(headerName === "outcomeChange"){
        header = {
          field: headerName,
          flex: 2,
          resizable: true
        };
      }
       else {
        header = {
          field: headerName,
          flex: 2,
          resizable: true
        };
      }
      tableHeader.push(header);
    }
      tableHeader.unshift({
        field: "Select",
        resizable: true,
        checkboxSelection: true,
        flex: 1
       });
    return tableHeader;
  };

  const getBiasColDefs = (data: Bias[]) => {
    let colDefs: ResColumnDef[] = [];

    let colDef: ResColumnDef;
    for (let headerName in data[0]) {
        colDef = {
          field: headerName,
          flex: 1,
          resizable: true
        };
      colDefs.push(colDef);
    }
    return colDefs;

  }

  const getHeadersWithProgressBar = (tableHeaders: TableColumnField[]) => {
    const set = new Set(columnWithGraphs);
    const tableHeaderWithProgressBar = tableHeaders.map((data: any) =>
      set.has(data.field)
        ? { ...data, cellRenderer: "ProgressCellRenderer",flex:1 }
        : data
    );
    return tableHeaderWithProgressBar;
  };

  const getDataWithFraudSelection = (data:any)=>{
   if(cardValue==="Fraud to Non Fraud"||cardValue==="Non Fraud to Fraud"){
      var fraudData=data.filter((el:any)=>{
        return el.outcomeChange===cardValue
      })
    }else{
      fraudData = data
    }
    return fraudData
  }

  useEffect(() => {
    if (activeTab === claimTab) {
      const FormatedDataForClaims: any = getFormatedDataForClaims(claims);
      const dataWithFraudFilter = getDataWithFraudSelection(FormatedDataForClaims)
      
      const tableHeaders: ResColumnDef[] = getClaimColDefs(FormatedDataForClaims);
      setTableColumns(tableHeaders);
      const dataWithFraud:any[] = getRoundedValues(dataWithFraudFilter);
      setTableData(dataWithFraud);
    } else {
      const tableHeaders: TableColumnField[] = getBiasColDefs(bias);
      const removedBiasTableHeader = getHeadersWithProgressBar(tableHeaders);
      setTableColumns(removedBiasTableHeader);
      const biasData:any[] = getRoundedValues(bias);
      setTableData(biasData);
    }
  }, [activeTab, bias, claims,cardValue]);

  const getFilteredValue = (filteredValue: Claim[]) => {
    const featureDistributionOnGraph: any[] = [];
    filteredValue.forEach((features) => {
      featureDistributionOnGraph.push({
        biasedProbability: features.biasedProbability,
        genderM: features.genderM,
        maritalStatus: features.maritalStatus,
        maritalStatusUnknown: features.maritalStatusUnknown,
        livingStatusRent: features.livingStatusRent,
        unbiasedProbability: features.unbiasedProbability,
      });
    });
    return featureDistributionOnGraph;
  };

  const getGraphData = (formatedData: any[]) => {
    let graphValue: any = {};
    let graphList: FeatureContribution[] = [];
    for (let graphValues in formatedData[0]) {
      graphValue = {
        name: graphValues,
        y: formatedData[0][graphValues],
      };
      graphList.push(graphValue);
    }
    return graphList;
  };

  useEffect(() => {
    if (currentRowValue === undefined) {
      var filteredValue = claims.filter((claim) => {
        return claim.claimNo === "0";
      });
    } else {
      filteredValue = claims.filter((claim) => {
        return claim.claimNo === currentRowValue;
      });
    }
    const formatedData = getFilteredValue(filteredValue);
    const graphData = getGraphData(formatedData);
    const newGraphData:any[] =getRoundedValues(graphData);
    setGraphData(newGraphData);
  }, [claims, currentRowValue]);

  if (isLoading) {
    return <PageLoader/>
  }

  return (
    <>
      <PageTitle element={<Header title="Model Result" />} />

      {modelResult ? (
        <>
          <ModelResultCardList claimBiasDataCards={claimBiasDataCards} setCardValue={setCardValue} />
          <div className="row p-1">
            <ul className="nav nav-tabs nav-pills p-1 px-3 border-0 mb-3 fs-7">
              <li className="nav-item">
                <button
                  className={`nav-link ${
                    activeTab === claimTab ? "active" : ""
                  } `}
                  data-bs-toggle="tab"
                  onClick={() => tabClicked(claimTab)}
                >
                  Claim Probability
                </button>
              </li>

              <li className="nav-item">
                <button
                  className={`nav-link ${
                    activeTab === biasTab ? "active" : ""
                  } `}
                  onClick={() => tabClicked(biasTab)}
                  data-bs-toggle="tab"
                >
                  Removed Bias
                </button>
              </li>
            </ul>

            <div className="tab-content" id="myTabContent">
              <div
                className={`tab-pane fade ${
                  activeTab === claimTab ? "active show" : ""
                }`}
                role="tabpanel"
              >
                <div className="row">
                  <div className="col-xl-6">
                    <ClaimProbabilityTable
                      height={500}
                      dataList={tableData}
                      tableColumns={tableColumns}
                      setCurrentRowValue={setCurrentRowValue}
                      tableTitle={claimTab}
                      setCardValue={setCardValue}
                    />
                  </div>
                  <div className="col-xl-6">
                    <WaterfallGraph
                      graphTitle="Feature Contribution towards Probability"
                      data={graphData}
                    />
                  </div>
                </div>
              </div>

              <div
                className={`tab-pane fade ${
                  activeTab === biasTab ? "active show" : ""
                }`}
                role="tabpanel"
              >
                <ClaimProbabilityTable
                  height={200}
                  dataList={tableData}
                  setCardValue={setCardValue}
                  setCurrentRowValue={setCurrentRowValue}
                  tableColumns={tableColumns}
                />
              </div>
            </div>
          </div>
        </>
      ) : (
          <ErrorsPage message={'Model Result records not found!'}></ErrorsPage>
      )}
    </>
  );
};
function mapState(state: any) {
  const { modelResultData } = state;
  return { modelResultData };
}

export default connect(mapState)(ModelResult);
