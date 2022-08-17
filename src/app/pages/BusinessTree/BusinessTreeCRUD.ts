import { getAPI, putAPI } from "../../../API/API"
import { API_ROUTE } from "../../../API/api-endpoints"
import { NodeDatum } from "../../Models/TreeGraphModels"

export function getBuisnessTree(projectId:string) {
  return getAPI(`${API_ROUTE.businessTree}/${projectId}`)
}

export function updateBuisnessTree(projectId:string,treeStructure:NodeDatum) {
  return putAPI(`${API_ROUTE.businessTree}/${projectId}`,treeStructure)
}