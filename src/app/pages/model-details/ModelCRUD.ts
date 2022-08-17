import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL

export const MODEL_URL = `${API_URL}/model`


export function getModelByModelId(modelId:string) {
  return axios.get<any>(`${MODEL_URL}/${modelId}`)
}
