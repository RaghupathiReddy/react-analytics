export interface LocalExplainerRecord {
	projectId: string;
	claimno: number;
}

export interface SelectedRowRecord {
	projectId?: string;
	'claim no'?: number;
}

export interface WaterfallGraphData {
	order?: number;
	name: string;
	y: number;
}

export interface FeatureValues {
	feature: string;
	avg_shap: number;
	rank: number;
	global_min: number;
	global_max: number;
}

export interface IFilter {
	filterKey: string;
	filterCondition: string;
	isCategoricalData: boolean;
	filterCriteria: string | number;
}
