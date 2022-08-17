import { getAPI } from "../../../../API/API"
import { API_ROUTE } from "../../../../API/api-endpoints"

export function getDataSummaryResponse(projectId:string) {
  return getAPI(`${API_ROUTE.dataSummary}/${projectId}`)
}
