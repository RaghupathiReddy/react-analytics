import React, { useState } from "react";
import WaterfallGraph from "../../components/graphs/WaterfallGraph/WaterfallGraph";
import RecordsTable from "./tables/RecordsTable";
import { useEffect } from "react";
import RecordEditorTable from "../localExplainer/tables/RecordEditorTable";
import { getLocalExplainerData } from "./redux/LocalExplainerCRUD";
import { useParams } from "react-router-dom";
import { connect, useDispatch } from "react-redux";
import * as LocalExplainerRedux from "./redux/LocalExplainerRedux";
import { FeatureValues, LocalExplainerRecord, SelectedRowRecord, WaterfallGraphData } from "../../Models/LocalExplainerModels";
import { ErrorsPage } from "../../modules/errors/ErrorsPage";
import NodeFilters from "./filters";
import PageLoader from "../../components/loaders/PageLoader";

type ILocalExplainer = {
	localExplainerRecords: LocalExplainerRecord[]
	localExplainerRecordGraph: WaterfallGraphData[]
	selectedRow: SelectedRowRecord
	threshold: number
	featureRanking : FeatureValues[]
}

const LocalExplainer: React.FC<ILocalExplainer> = ({ localExplainerRecords, 
													 localExplainerRecordGraph, 
													 selectedRow, 
													 threshold, 
													 featureRanking 
													}) => {


	const { projectId } = useParams()
	const dispatch = useDispatch()
	const isDataAvailable = localExplainerRecords && localExplainerRecords.length === 0;

	const [secondWaterfallChartData, setSecondWaterfallChartData] = useState<WaterfallGraphData[] | null>(null);

	useEffect(() => {

	}, [projectId, dispatch]);

	const handleResponseForWaterFall = (response: WaterfallGraphData[]) => {
		setSecondWaterfallChartData(response);
	}

	return isDataAvailable ? (
		<>
			<ErrorsPage message={'Local Explainer records not found!'}></ErrorsPage>
		</>
	) : (
		<>
			<div className="d-flex mt-2">
				<div className="card col-2 me-2 p-2 pt-10 mb-2">
					<NodeFilters></NodeFilters>
				</div>
				<div className="d-flex flex-column col-10">
					<div className="card flex-fill p-4">
						{featureRanking && <RecordsTable threshold={threshold} tableData={localExplainerRecords} featureRanks={featureRanking}/>}
					</div>
					<div className="d-flex mt-2 mb-2">
						<div className="card col-3  p-5">
							{selectedRow && <RecordEditorTable setSecondWaterFallGraph={handleResponseForWaterFall} />}
						</div>
						<div className="d-flex col-9 flex-fill flex-column">
							<div className="card ms-2">
								{selectedRow && <WaterfallGraph 
									graphTitle={`Variable importance analysis for claim no. ${selectedRow['claim no']}`} 
									data={localExplainerRecordGraph} 
								/>}
							</div>
							<div className="card m-2 d-flex flex-fill">
								{!secondWaterfallChartData ?  <>
								<h3 className="text-center p-15 m-20 text-info text-muted">Please edit the values and click on predict button to load counterfactual values graph.</h3>
								</>:
								secondWaterfallChartData.length === 0 ?
									(<>
										<div className="card ms-2 mt-2 d-flex flex-center flex-fill">
											<PageLoader message=" Graph is loading, do not refresh the page" />
										</div>
									</>)
									:
									<WaterfallGraph 
										graphTitle={`Counterfctual variable importance analysis for claim no. ${selectedRow['claim no']}`} 
										data={secondWaterfallChartData} />}
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};


function mapState(state: any) {
	const { localExplainerRecords, localExplainerRecordGraph, selectedRow, threshold, featureRanking } = state.localExplainer;
	return { localExplainerRecords, localExplainerRecordGraph, selectedRow, threshold, featureRanking };
}

export default connect(mapState)(LocalExplainer);
