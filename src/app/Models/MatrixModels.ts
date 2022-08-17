
export interface MatrixRow {
  heading: string
  cells: MatrixCell[]
}

export interface MatrixCell {
  columnHeading: string
  value: number | string;
}

export interface MatrixCellInfo{
  columnHeading: string;
  rowHeading: string;
  color?:string;
}

export interface DefaultColumnDef{
  field: string;
  headerName?:string;
  headerClass?:string;
  cellClass?: string;
  cellRenderer?: string;
  valueFormatter?: (params: any) => string;
  checkboxSelection?: boolean;
  resizable?: boolean;
}

// not recommended to use this unless you want fixed width columns/table
export interface ColumnDef extends DefaultColumnDef{
  width: number;
}

// recommended to use this instead of ColumnDef to keep table responsive
export interface ResColumnDef extends DefaultColumnDef {
  flex: number;
}


