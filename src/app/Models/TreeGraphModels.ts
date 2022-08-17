import { RawNodeDatum } from "react-d3-tree/lib/types/common";

export interface NodeDatum extends RawNodeDatum {
    nodeData?: Array<any>,
    nodeDisplayData?: any
}
export interface Filter {
    filterName: string,
    isCategoricalData: boolean,
    filterValues: Array<string|number>
}
export interface FilterCriteria {
    filterKey: string,
    filterCondition: string,
    filterCriteria: string,
}
export interface BinaryTreeData {
    _id : string,
    treeGraphData : NodeDatum[],
    projectId : string,
    filter : Filter[],
    dataset : any
}
export interface SelectedNode {
    nodeName:string,
    filters : FilterCriteria[]
}