import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { PageTitle } from "../../../_metronic/layout/core";
import ModelComparisonStats from "../../components/cards/ModelStats/ModelComparisonStats";
import Header from "../../components/header";
import FeatureTable from "./tables/FeatureTable";
import KPITable from "./tables/KPITable";
import NeuralNetworkTable from "./tables/NeuralNetworkTable";
import StatusTable from "./tables/StatusTable";
import * as ModelComparisonRedux from "./redux/ModelComparisonRedux";
import { ModelComparisonScores, ModelComparisonStatsData} from "../../Models/ModelComparisonModel";
import { getModelComparisonData } from "./redux/ModelComparisonCRUD";
import { Col, Row } from "reactstrap";
import PageLoader from "../../components/loaders/PageLoader";
import { ErrorsPage } from "../../modules/errors/ErrorsPage";


type ModelComparisonProps = {
	data : {
	_id : string;
	projectId : string;
	logisticsRegression: ModelComparisonStatsData;
	svm: ModelComparisonStatsData;
	randomForest: ModelComparisonStatsData;
	xgBoost: ModelComparisonStatsData;
	neuralNetwork: ModelComparisonStatsData;
	ensembleModel?: ModelComparisonScores;
	}
};

const ModelComparison: React.FC<ModelComparisonProps> = ({data}) => {
	const { neuralNetwork, logisticsRegression, xgBoost, svm, randomForest } = data;
	const dispatch = useDispatch();
	const { projectId } = useParams();
	const tableHeight = 250;
	const isDataAvailable = data !== ModelComparisonRedux.initialModelComparisonState;
	const [isLoading, setIsLoading] = useState(true)
	const [selectedModelData, setSelectedModelData] = useState<ModelComparisonStatsData | null>(null);

	useEffect(() => {
	if (!projectId || isDataAvailable) 
	return;

	getModelComparisonData(projectId)
	.then(({ data }) => {
		dispatch(ModelComparisonRedux.actions.getModelComparisonData(data.data));
		setIsLoading(false)
	})
	.catch((err) => {
		console.log(err);
		setIsLoading(false)

	});
	}, [projectId,isDataAvailable,dispatch]);

	useEffect(()=>{
		if(neuralNetwork !== ModelComparisonRedux.initialModelComparisonState.neuralNetwork) 
			setSelectedModelData(neuralNetwork)
		if(selectedModelData)
			setIsLoading(false)
	},[neuralNetwork, selectedModelData])


	const [cardHighlights, setCardHighlights] = useState({
		neuralNetwork: true,
		logisticsRegression: false,
		xgBoost: false,
		svm: false,
		randomForest: false,
	});

	const setModelStatsHighlight = (cardTitle: string) => {
	switch (cardTitle) {
		case "Logistics Regression":
			setCardHighlights({
				neuralNetwork: false,
				logisticsRegression: true,
				xgBoost: false,
				svm: false,
				randomForest: false,
			});
			break;
		case "SVM":
			setCardHighlights({
				neuralNetwork: false,
				logisticsRegression: false,
				xgBoost: false,
				svm: true,
				randomForest: false,
			});
			break;
		case "Random Forest":
			setCardHighlights({
				neuralNetwork: false,
				logisticsRegression: false,
				xgBoost: false,
				svm: false,
				randomForest: true,
			});
			break;
		case "XG Boost":
			setCardHighlights({
				neuralNetwork: false,
				logisticsRegression: false,
				xgBoost: true,
				svm: false,
				randomForest: false,
			});
			break;
		case "Neural Network":
			setCardHighlights({
				neuralNetwork: true,
				logisticsRegression: false,
				xgBoost: false,
				svm: false,
				randomForest: false,
			});
			break;
		default:
			setCardHighlights({
				neuralNetwork: true,
				logisticsRegression: false,
				xgBoost: false,
				svm: false,
				randomForest: false,
			});
			break;
	}
	};

	const handleOnClick = (data: any, cardTitle: string) => {
		setSelectedModelData(data);
		setModelStatsHighlight(cardTitle);
	};

	return isLoading ? (
		<PageLoader />	
	):
	(
	<>
	<PageTitle element={<Header title="Model Comparison"> 
		<Link className="btn btn-primary" to="/feature-explainability/62a31b74d469688069d7e705">
			Feature Explainability
		</Link>
	</Header>
	} />
				{isDataAvailable ? <><div className="d-flex flex-row flex-fill flex-wrap justify-content-around model-comparison p-2">
					{logisticsRegression && logisticsRegression.modeComparisonScores &&
						<ModelComparisonStats
							iconPath="\media\icons\turing\logisticsRegression.svg"
							iconColorClass="svg-icon-info"
							cardTitle={"Logistics Regression"}
							modelComparisonInfo={logisticsRegression.modeComparisonScores}
							handleOnClick={handleOnClick}
							modelData={logisticsRegression}
							isBorderHighlighted={cardHighlights.logisticsRegression}
						/>}
					{svm && svm.modeComparisonScores &&
						<ModelComparisonStats
							iconPath="\media\icons\turing\svmBlack.svg"
							cardTitle={"SVM"}
							modelComparisonInfo={svm.modeComparisonScores}
							handleOnClick={handleOnClick}
							modelData={svm}
							isBorderHighlighted={cardHighlights.svm}
						/>}
					{randomForest && randomForest.modeComparisonScores &&
						<ModelComparisonStats
							iconPath="\media\icons\turing\randomForest.svg"
							cardTitle={"Random Forest"}
							modelComparisonInfo={randomForest.modeComparisonScores}
							handleOnClick={handleOnClick}
							modelData={randomForest}
							isBorderHighlighted={cardHighlights.randomForest}
						/>}
					{xgBoost && xgBoost.modeComparisonScores &&
						<ModelComparisonStats
							iconPath="\media\icons\turing\xgBoost.svg"
							cardTitle={"XG Boost"}
							modelComparisonInfo={xgBoost.modeComparisonScores}
							handleOnClick={handleOnClick}
							modelData={xgBoost}
							isBorderHighlighted={cardHighlights.xgBoost}
						/>}
					{neuralNetwork && neuralNetwork.modeComparisonScores &&
						<ModelComparisonStats
							iconPath="\media\icons\turing\neural.svg"
							iconColorClass="svg-icon-warning"
							cardTitle={"Neural Network"}
							modelComparisonInfo={neuralNetwork.modeComparisonScores}
							handleOnClick={handleOnClick}
							modelData={neuralNetwork}
							isBorderHighlighted={cardHighlights.neuralNetwork}
						/>}
				</div>
					{selectedModelData && <Row className="min-h-250px mh-450px">
						<Col  >
							<KPITable data={selectedModelData} height={tableHeight} />
						</Col>

						<Col md="auto">
							<StatusTable data={selectedModelData} height={tableHeight} />
						</Col>

						<Col>
							<FeatureTable data={selectedModelData} height={tableHeight} />
						</Col>
					</Row>}
					{selectedModelData && cardHighlights.neuralNetwork && (
						<div className="d-flex flex-row flex-fill flex-wrap min-h-250px mh-250px">
							<NeuralNetworkTable data={selectedModelData} />
						</div>
					)}</> : <ErrorsPage message={'Model Comparsion records not found!'}></ErrorsPage>}

	</>
	);
};

function mapState(state: any) {
	const {modelComparison:data} = state
	return {data}
}
export default connect(mapState)(ModelComparison);
