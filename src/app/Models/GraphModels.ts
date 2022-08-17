import { PlotLine } from "../pages/GlobalExplainer/GlobalExplainerModel";
import { GraphSeries } from "./EDAModels";

export interface GraphDataClass{
    from: number | null;
    to: number | null;
    name: string;
    color: string;
}

export interface NetworkGraphLink{
    from: string;
    to: string;
}

export interface CoordinatePoint{
    x: number;
    y: number;
}

export interface GraphProps{
    chartTitle ?: string
    xAxisTitle ?: string
    yAxisTitle ?: string
    secondaryYAxisTitle ?: string
    categories : string[]
    series : GraphSeries[]
    plotline?: PlotLine[]
    setIsStackBarSelected?: (value: boolean) => void
    setSelectedStackRange?: (value: string) => void
    isStackBarSelected?: boolean
    selectedStackRange?: string
}