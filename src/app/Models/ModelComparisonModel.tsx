export interface ModelComparisonScores {
	accuracyScore: number;
	recallScore: number;
	precisionScore: number;
	aucScore: number;
}

export interface KPI {
	title: string;
	value: any; //TODO : replace once data is available
}

export interface FeatureCategory {
	featureCategory: string;
	featureCount: number;
	examples: any; //TODO : replace once data is available
	rank: number;
}

export interface Status {
	feature: string;
	status: boolean;
}

export interface NeuronsTable {
	layer: number;
	neuronsCount: number;
	activationFunction: string;
}

export interface ModelComparisonStatsData {
	modeComparisonScores: ModelComparisonScores;
	featureCategories: FeatureCategory[];
	kpi: KPI[];
	status: Status[];
	neuronsTable?: NeuronsTable[]
}


