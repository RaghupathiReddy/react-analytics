import { getAPI } from "../../../API/API";
import { API_ROUTE } from "../../../API/api-endpoints";

export function getBiasFeaturesByID(projectId: string) {
  return getAPI(`${API_ROUTE.biasFeatures}/${projectId}`)
}