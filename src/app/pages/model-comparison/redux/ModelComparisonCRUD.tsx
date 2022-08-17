import { getAPI } from "../../../../API/API";
import {API_ROUTE} from "../../../../API/api-endpoints";

export function getModelComparisonData(projectID : string){
    return getAPI(`/${API_ROUTE.modelComparison}/${projectID}`)
}