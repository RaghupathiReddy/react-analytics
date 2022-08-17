import { Action } from "redux";
import { FeatureValues, IFilter, LocalExplainerRecord, SelectedRowRecord, WaterfallGraphData } from "../../../Models/LocalExplainerModels";

export interface ActionWithPayload<Type> extends Action {
	payload: Type;
}

export const actionTypes = {
    getLocalExplainerRecordsData : '[GetLocalExplainerRecordsData] Action',
    getLocalExplainerRecordGraphData : '[GetLocalExplainerRecordGraphData] Action',
    setSelectedThreshold: '[SetSelectedThreshold] Action',
    setSelectedRowData : '[SetSelectedRowData] Action',
    updateSelectedRowData : '[UpdateSelectedRowData] Action',
    updateFilteredRowsLoadingStatus : '[UpdateRowsLoadingStatus] Action',
    setFeatureRanking : '[SetFeatureRanking] Action',
    setFilter : '[SetFilter] Action'
}

export const actions = {
    getLocalExplainerRecordsData : (data : LocalExplainerRecord[]) =>({
        type : actionTypes.getLocalExplainerRecordsData,
        payload : data,
    }),
    getLocalExplainerRecordsGraphData : (data : WaterfallGraphData[]) =>({
        type : actionTypes.getLocalExplainerRecordGraphData,
        payload : data,
    }),

    setSelectedThreshold : (threshold : number) =>({
        type : actionTypes.setSelectedThreshold,
        payload : threshold,
    }),

    setSelectedRowData : (data:SelectedRowRecord) => ({
        type : actionTypes.setSelectedRowData,
        payload : data
    }),
    updateSelectedRowData : (data:SelectedRowRecord) => ({
        type : actionTypes.updateSelectedRowData,
        payload : data
    }),
    updateFilteredRowsLoadingStatus : (data:boolean) =>({
        type : actionTypes.updateFilteredRowsLoadingStatus,
        payload : data
    }),
    setFeatureRankings : (data : FeatureValues[]) =>({
        type : actionTypes.setFeatureRanking,
        payload : data
    }),
    setFilter : (data:IFilter[]) => ({
        type : actionTypes.setFilter,
        payload : data
    })
}

export interface ILocalExplainerState {
    localExplainerRecords : LocalExplainerRecord[] | null
    localExplainerRecordGraph : WaterfallGraphData[] | null
    selectedRow : SelectedRowRecord | null
    filteredRowsLoadingStatus : boolean
    threshold : number | null
    featureRanking : FeatureValues[] | null
    filter : IFilter[] | null
}

const initialLocalExplainerState : ILocalExplainerState = {
    filteredRowsLoadingStatus: false,
    localExplainerRecords: null,
    localExplainerRecordGraph: null,
    selectedRow: null,
    threshold: 0.5,
    featureRanking : null, 
    filter : null
}

export const LocalExplainerReducer = ( state : ILocalExplainerState = initialLocalExplainerState, action : ActionWithPayload<ILocalExplainerState>) => {
   switch(action.type){
        case actionTypes.getLocalExplainerRecordsData : {
            const data = action.payload
            return {
                ...state,
                localExplainerRecords : data
            }
        }
        case actionTypes.getLocalExplainerRecordGraphData : {
            const data = action.payload
            return {
                ...state,
                localExplainerRecordGraph : data
            }
        }
        case actionTypes.setSelectedThreshold : {
            const threshold = action.payload
            return {
                ...state,
                threshold : threshold
            }
        }
        case actionTypes.setSelectedRowData : {
            const data = action.payload
            return {
                ...state,
                selectedRow : data
            }
        }
        case actionTypes.updateSelectedRowData : {
           const data = action.payload
           return {
            ...state,
            selectedRow : data
           } 
        }
        case actionTypes.updateFilteredRowsLoadingStatus : {
            const data = action.payload
            return {
                ...state,
                filteredRowsLoadingStatus : data
            }
        }
        case actionTypes.setFeatureRanking : {
            const data = action.payload
            return {
                ...state,
                featureRanking : data 
            }
        }
        case actionTypes.setFilter : {
            const data = action.payload
            return {
                ...state,
                filter : data
            }
        }
        default : {
            return state
        }
   }
}
