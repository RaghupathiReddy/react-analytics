import { LocalExplainerRecord, WaterfallGraphData } from "../../Models/LocalExplainerModels"

export function getWaterfallChartData (data:LocalExplainerRecord, excludedGraphColumns:string[]): WaterfallGraphData[]{
    let chartData : WaterfallGraphData[] = []
    Object.entries(data).map(([key, val]: [string,any], index: number) => {
        if (!excludedGraphColumns.includes(key)){ 
            chartData.push({ name: key, y: val})
        }
        return true
    })
    return chartData
}