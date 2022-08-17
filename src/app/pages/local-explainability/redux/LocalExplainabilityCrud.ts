import axios from "axios";

//CONTAINS ALL API CALLS FOR CRUD OPS!

const API_URL = process.env.REACT_APP_API_URL

export const GET_LOCAL_EXPLAINABILITY_DATA_BY_ID = (modelId : string | undefined) => `${API_URL}/model/local_explainability/${modelId}`

export function getData(modelId : string | undefined) {
    return axios.get<any>(GET_LOCAL_EXPLAINABILITY_DATA_BY_ID(modelId))
}