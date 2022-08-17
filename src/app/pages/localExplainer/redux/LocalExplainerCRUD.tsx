import { getAPI, postAPI } from "../../../../API/API";
import { API_ROUTE } from "../../../../API/api-endpoints";
import { IPredictionRequest } from "../../../Models/FeatureExplainabilityModels";

export function getLocalExplainerChartData(projectId:string,claimNumber:number){
    return getAPI(`${API_ROUTE.localExplainer}/${projectId}?claimNumber=${claimNumber}`)
}

export function getLocalExplainerData(projectId:string, queryString ?:string){
    return getAPI(`${API_ROUTE.localExplainer}/records/${projectId}?${queryString}`)
}

export function postPredict(predictionRequest: IPredictionRequest){
    return postAPI(`${API_ROUTE.azureQueue}`,predictionRequest)
}

export function getFeatureRankings(projectId:string){
    return getAPI(`${API_ROUTE.featureRanking}/${projectId}`)
}