import { DefaultColumnDef, ResColumnDef } from "../../Models/MatrixModels";

export interface GlobalExplainerTiles {
  property: string;
  value: number;
}


export interface PlotLine {
  color: string;
  width: number;
  value: number;
}

export interface GraphData {
  topBar: number;
  labelForCategory: string;
  bottomBar: number;
}

export interface ColumnAndLineSeries {
  name: string;
  color: string;
  data: number[];
}
export interface GlobalExplainerSummary {
  accuracy: number
  precision: number
  recall: number
  auc: number
  f1: number
}

export interface GlobalData {
  probability: number,
  accuracy: number,
  recall: number,
  f1: number,
  precision: number,
  auc: number,
  true_negative: number,
  false_positive: number,
  false_negative: number,
  true_positive: number,
  fraud: number,
  non_fraud: number,
}

export interface ShapData {
  avg_shap: number
  feature: string
  global_max: number
  global_min: number
  rank?: number
}

export interface ColumnWithParams extends DefaultColumnDef {
  cellRendererParams?: ParamValue;
  flex?: number
}

export interface ParamValue {
  maximumShapAverage: number
}
