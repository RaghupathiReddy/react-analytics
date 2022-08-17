export interface ModelDataRow {
    name: string;
    values: ModelDetailCell[];
}

export interface ModelDetailCell {
    columnHeading: string;
    value: string;
}
