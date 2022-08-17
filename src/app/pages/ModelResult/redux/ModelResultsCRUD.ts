import { API_ROUTE } from "../../../../API/api-endpoints";
import { getAPI } from "../../../../API/API";

export function getModelResultByID(projectId: string) {
  return getAPI(`${API_ROUTE.modelResults}/${projectId}`)
}
