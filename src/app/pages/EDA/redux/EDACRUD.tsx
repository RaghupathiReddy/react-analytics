import { getAPI } from "../../../../API/API";
import {API_ROUTE} from "../../../../API/api-endpoints";

export function getEDAData(projectID : string){
    return getAPI(`${API_ROUTE.edaScreenTwo}/${projectID}`)
}