export interface GraphSeries {
	name: string;
	data: number[];
	color?: string;
}

export interface IEDAState {
	columnAndLineChart: StackedColumnLineChartData[];
	stackedBarChart: StackedBarChartData[];
	areaChart: AreaChartData[];
	heatMap: HeatMapData;
}

export interface StackedColumnLineChartData {
	slab: string;
	kpi: string;
	claimCount: number;
	averageFraudPercentage: number;
}

export interface StackedBarChartData {
	ageOfDriver: string;
	ownerPercentage: number;
	rentalPercentage: number;
}

export interface AreaChartData {
	vehicleWeight: string;
	ownerPercentage: number;
	rentalPercentage: number;
}

export interface HeatMapData {
	xAxisCategories: string[];
	yAxisCategories: string[];
	values: (number | null)[];
}