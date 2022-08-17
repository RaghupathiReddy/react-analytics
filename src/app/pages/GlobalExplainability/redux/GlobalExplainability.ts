import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL

export const GET_GLOBAL_EXPLAINABILITY = (recordId: string | undefined) =>
  `${API_URL}/model/global_explainability/${recordId}`

export function getGlobalExplainability(recordId: string | undefined) {
  return axios.get<any>(GET_GLOBAL_EXPLAINABILITY(recordId))
}
