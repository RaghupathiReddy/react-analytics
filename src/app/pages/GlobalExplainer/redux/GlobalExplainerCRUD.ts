import { API_ROUTE } from "../../../../API/api-endpoints";
import { getAPI } from "../../../../API/API";

export function getGlobalExplainbilityData(projectId: string) {
  return getAPI(`${API_ROUTE.globalExplainability}/${projectId}`);
}


export function getGlobalExplainbilitySummary(projectId: string, start: number, end: number) {
  return getAPI(`${API_ROUTE.globalExplainabilityShapData}/${projectId}/${start}/${end}`);
}
