//ADD ALL THE REQUIRED MODELS AND TYPES FOR TS IN THIS FILE

export interface IScatterGraph {
    data: {
        name: string;
        data: (string | number)[][] | null;
    }[];
    xAxisLabel: string | 'Sugar levels' | 'abc';
    yAxisLabel: string | 'Age' | 'abc';
    yAxisTitle?: 'Sensitivity';
    xAxisTitle?: 'Specificity';
    dropdownOptions :string[] | undefined | null;
    handleXAxisVariable?: (val : any) => void;
    handleYAxisVariable?: (val : any) => void;
    pairSeriesNameWithData : Object | null  //can we assign a type to pair data?
}

export interface IScatterPlotPointsData {
    name: string, 
    color: string, 
    data: (string | number)[][]
}