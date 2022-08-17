import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {  connect, useDispatch } from "react-redux";
import { PageTitle } from "../../../_metronic/layout/core";
import Header from "../../components/header";
import PageLoader from "../../components/loaders/PageLoader";
import ConfusionMatrix from "../../components/Tables/ConfusionMatrix";
import { MatrixRow } from "../../Models/MatrixModels";
import { ErrorsPage } from "../../modules/errors/ErrorsPage";
import { GlobalData, GlobalExplainerSummary, GlobalExplainerTiles, ShapData } from "./GlobalExplainerModel";
import { GlobalExplainerCardList } from "./GlobalExplainerSummary";
import { getGlobalExplainbilityData, getGlobalExplainbilitySummary } from "./redux/GlobalExplainerCRUD";
import ThresholdSlider from "./ThresholdSlider";
import StackedGraph from "./StackedGraph";
import ThresholdChart from "./ThresholdChart";
import * as LocalExplainerRedux from "../localExplainer/redux/LocalExplainerRedux";
import ShapTable from "./ShapTable";

interface IGlobalExplainabilityProps {
  selectedThreshold?: number | null;
};

export const GlobalExplainability: React.FC<IGlobalExplainabilityProps> = (props) => {
  
  let prevSelectedThreshold = props.selectedThreshold;

  const [globalExplainability, setGlobalExplainability] = useState<GlobalData[]>([]);

  const prevSelectedThresholdOrDefault = prevSelectedThreshold ? prevSelectedThreshold : 0.5;
  
  const [thresholdProbability, setThresholdProbability] = useState<number>(prevSelectedThresholdOrDefault);

  const [confusionMatrixData, setConfusionMatrixData] = useState<MatrixRow[]>([]);

  const [isStackBarSelected, setIsStackBarSelected] = useState<boolean>(false)

  const [selectedStackRange, setSelectedStackRange] = useState("")

  const [shapTableData, setShapTableData] = useState<ShapData[] | any[]>([])

  const [shapTableTempData, setShapTableTempData] = useState<ShapData[]>([])

  const dispatch = useDispatch();
  

  const [isLoading, setIsLoading] = useState(true);
  const [globalExplainabilitySummary, setGlobalExplainabilitySummary] = useState<GlobalExplainerSummary>({
    accuracy: 0,
    precision: 0,
    recall: 0,
    auc: 0,
    f1: 0,
  })
  const [cardData, setCardData] = useState<GlobalExplainerTiles[]>([])

  const [thresholdState, setThresholdSate] = useState<any>(null);

  const { projectId } = useParams();

  const LoadRoundedAndSortedData = (data: any[]) => {
    data.forEach((element: any) => {
      Object.entries(element).forEach(([key, value]) => {
        if (typeof value === "number") {
          element[key] = +value.toFixed(3);
        }
      });
    });

    return data.sort((a, b) => (a.probability > b.probability) ? 1 : ((b.probability > a.probability) ? -1 : 0))
  };
  const loadGlobalExplainbilityDataFromAPI = (projectId: string | undefined) => {
    if (projectId) {
      getGlobalExplainbilityData(projectId)
        .then((res) => {
          const api_response = res.data.globalExplainer
          setGlobalExplainability(LoadRoundedAndSortedData(api_response));
          setShapTableData(res.data.featureRanking[0].values)
          setShapTableTempData(res.data.featureRanking[0].values)
          setIsLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setIsLoading(false);
        });


    }
  }


  useEffect(() => {
    loadGlobalExplainbilityDataFromAPI(projectId)
  }, [projectId]);


  const getDataForThreshold = (data: GlobalData[]) => {
    const filteredData = data.filter(el => {
      return el.probability === thresholdProbability
    })

    return filteredData
  }

  useEffect(() => {
    setThresholdSliderProps()
  }, [])

  useEffect(() => {
    let cardSummaryData: GlobalData[] = getDataForThreshold(globalExplainability)

    if (cardSummaryData.length !== 0) {
      var { accuracy, recall, f1, precision, auc } = cardSummaryData[0]
      cardSummaryData = getDataForThreshold(globalExplainability)
    }

    const dataForThreshold = getDataForThreshold(globalExplainability)

    if (dataForThreshold) {
      var confusionMatrixMockData = getConfusionMatrixData({ ...dataForThreshold[0] });
      setConfusionMatrixData(confusionMatrixMockData);

    }

    setGlobalExplainabilitySummary({
      accuracy: accuracy,
      recall: recall,
      f1: f1,
      precision: precision,
      auc: auc,
    })



  }, [globalExplainability, thresholdProbability])

  function setThresholdSliderProps() {
    if (globalExplainability) {
      const step = 0.01
      const minThreshold = 0;
      const maxThreshold = 1;

      setThresholdSate({
        thresholdProbability,
        minThreshold,
        maxThreshold,
        step,
      })

    }

  }

  function numberWithCommas(x: string) {
    if (x) {
      return x.replace(/\B(?=(\d{3})+(?!\d))/g, ",");;

    }
  }

  function getValueWithPercentage(count: number, totalCount: number): string {
    const percentageOfCount: number = (count / totalCount) * 100;
    const percentageOfCountStr: string = percentageOfCount.toFixed(2).toString();
    const formattedPercentageOfCountStr: string = `(${percentageOfCountStr}%)`

    const countStr: string = count?.toString();
    const countAndPercentageCountStr = numberWithCommas(countStr) + " - " + formattedPercentageOfCountStr;
    return countAndPercentageCountStr
  }

  function getConfusionMatrixData(data: any) {

    const totalCount = data.true_negative + data.false_positive + data.false_negative + data.true_positive;

    const confusionMatrixMockData: MatrixRow[] = [
      {
        heading: "Non fraud",
        cells: [
          {
            columnHeading: "Non fraud",
            value: getValueWithPercentage(data.true_positive, totalCount),
          },
          {
            columnHeading: "Fraud",
            value: getValueWithPercentage(data.false_positive, totalCount),
          },

        ]
      },
      {
        heading: "Fraud",
        cells: [
          {
            columnHeading: "Fraud",
            value: getValueWithPercentage(data.false_negative, totalCount),
          },
          {
            columnHeading: "Non fraud",
            value: getValueWithPercentage(data.true_negative, totalCount)
          }
        ]
      },
    ]

    return confusionMatrixMockData

  }


  const handleThresholdChange = (newThreshold: number) => {
    dispatch(LocalExplainerRedux.actions.setSelectedThreshold(newThreshold));
    setThresholdProbability(newThreshold);

  }


  const getCardValueFromSummary = (globalExplainabilitySummary: GlobalExplainerSummary) => {
    const cardData: GlobalExplainerTiles[] = [];
    Object.entries(globalExplainabilitySummary).forEach(
      ([key, value]) => {
        if (key !== "_id" && key !== "projectId") {
          cardData.push({ property: key, value: value });
        }
      })
    return cardData
  }

  useEffect(() => {
    const cardData: GlobalExplainerTiles[] = getCardValueFromSummary(globalExplainabilitySummary)
    setCardData(cardData)
  }, [globalExplainabilitySummary])

  const loadShapData = (projectId: string | undefined, start: number, end: number) => {
    if (projectId) {
      getGlobalExplainbilitySummary(projectId, start, end).then((res) => {
        const api_response = res.data.shapRecords

        setShapTableData(LoadRoundedAndSortedData(api_response))
        setIsLoading(false);
      }).catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
    }
  }
  useEffect(() => {

    if (isStackBarSelected && selectedStackRange !== "") {
      setShapTableData([])
      const probabilityRange = selectedStackRange.split("-")
      const start = parseFloat(probabilityRange[0])
      const end = parseFloat(probabilityRange[1])
      loadShapData(projectId, start, end)

    }


  }, [projectId, selectedStackRange, isStackBarSelected])

  useEffect(() => {
    setSelectedStackRange("")
    setIsStackBarSelected(false)
    //call your increment function here
  }, [thresholdProbability]) 

  if (isLoading) {
    return <PageLoader></PageLoader>;
  }

  return (
    <div className="container-fluid d-flex flex-column justify-content-around">
      <PageTitle
        element={
          <Header title="Global Explainability">
            <Link
              className="btn btn-primary"
              to="bias-identification/62863b043f0d7d1c5443a354"
            >
              Bias Identification
            </Link>
          </Header>
        }
      />
      {globalExplainability.length !== 0 ? (<>

        <div className="row d-flex justify-content-between  align-self-between align-content-center align-item-center py-1" >
          <div className="col-xl-9 text-capitalize">
            <GlobalExplainerCardList cardData={cardData} />
          </div>

          <div className="col-xl-3">
            <ThresholdSlider step={thresholdState.step} minThreshold={thresholdState.minThreshold} maxThreshold={thresholdState.maxThreshold} threshold={thresholdProbability} setValue={handleThresholdChange} />
          </div>
        </div>
        <div className="row">
          <div className="col-xl-6 px-2 py-1">
            <ThresholdChart cardData={cardData} globalExplainability={globalExplainability} />
          </div>
          <div className="col-lg-6  px-2 py-1">
            <ConfusionMatrix dataRows={confusionMatrixData} />

          </div>
        </div>

        <div className="row">
          <div className="col-lg-6  px-2 py-1">
            <StackedGraph
              setSelectedStackRange={setSelectedStackRange}
              setIsStackBarSelected={setIsStackBarSelected}
              thresholdState={thresholdState}
              value={thresholdProbability}
              globalExplainability={globalExplainability}
              isStackBarSelected={isStackBarSelected}
              selectedStackRange={selectedStackRange}
            />
          </div>
          <div className="col-lg-6  px-2 py-1">

            {shapTableData.length !== 0 ? (<>
              <ShapTable selectedStackRange={selectedStackRange} isStackBarSelected={isStackBarSelected} shapTableData={shapTableData} shapTableTempData={shapTableTempData} />
            </>) : (
                <div className="col-lg-6 w-100 h-100 card p-2 flex-center" data-kt-indicator="on">

                <PageLoader />
              </div>)}
          </div>

        </div></>) : (
          <div className="w-100 h-100 flex-center">
            <ErrorsPage message={'Global Explainer records not found!'}></ErrorsPage>
          </div>

      )}


    </div>
  );
};


function mapState(state: any) {
	const { threshold } = state.localExplainer;
  
	return {selectedThreshold: threshold};
}

export default connect(mapState)(GlobalExplainability);