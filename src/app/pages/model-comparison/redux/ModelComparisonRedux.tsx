import { Action } from "redux";
import {ModelComparisonStatsData} from "../../../Models/ModelComparisonModel";

export interface ActionWithPayload<Type> extends Action {
	payload: Type;
}

export const actionTypes = {
	getModelComparisonData: "[GetModelComparisonData] Action",
};

export const actions = {
	getModelComparisonData: (data: IModelComparisonState) => ({
		type: actionTypes.getModelComparisonData,
		payload: data,
	}),
};

export interface IModelComparisonState {
    _id : string | null
    projectId : string | null
    ensembleModel ?: any , //TODO: Replace type when data is available
    logisticsRegression : ModelComparisonStatsData | null,
    svm : ModelComparisonStatsData | null,
    randomForest : ModelComparisonStatsData | null,
    xgBoost : ModelComparisonStatsData | null,
    neuralNetwork ?: ModelComparisonStatsData | null
}


  export const initialModelComparisonState : IModelComparisonState = {
    _id : null,
    projectId : null,
    logisticsRegression:null,
    svm:null,
    randomForest:null,
    xgBoost:null,
    neuralNetwork:null,
}

export const ModelComparisonReducer = (
	state: IModelComparisonState = initialModelComparisonState,
	action: ActionWithPayload<IModelComparisonState>
) => {
    switch(action.type){
        case actionTypes.getModelComparisonData : {

            const data = action.payload
            return {
                ...state,
                ...data
            }
        }
        default : return state
    }
};
