import { API_ROUTE } from "../../../../API/api-endpoints";
import { getAPI } from "../../../../API/API";

export function getFeatureExplainbilityByID(projectId: string) {
  return getAPI(`${API_ROUTE.featureExplainbility}/${projectId}`);
}
