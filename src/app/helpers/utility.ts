import { CoordinatePoint } from "../Models/GraphModels";
import { MatrixCellInfo, MatrixRow } from "../Models/MatrixModels";

export const getRoundedValue = (value: number, decimalPlacesCount: number) => {
    const factor = Math.pow(10, decimalPlacesCount);
    return Math.round((value + Number.EPSILON) * factor) / factor
}

export const getRoundedString = (value: number, decimalPlacesCount: number) =>{
    return getRoundedValue(value, decimalPlacesCount).toString();
}

export const getFormattedString = (value: number) => {
    return value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

export const getPercentageString = (value: number) => {
    return value.toFixed(1) + "%"
}

export const getCombinedArray = (xAxisArray: number[], yAxisArray: number[]): number[][] => {
    var combinedArray: number[][] = [];
    for (let index = 0; index < xAxisArray.length; index++) {
        const xValue = xAxisArray[index];
        const yValue = yAxisArray[index];

        combinedArray.push([xValue, yValue]);
    }
    return combinedArray
}

export const getRowHeadingsFromMatrixData= (rows: MatrixRow[]) =>{    
    var rowHeadings: string[] = [];
    rows.forEach(row => {
        rowHeadings.push(row.heading);
    });
    return rowHeadings;
}

export const getColumnHeadingsFromMatrixData= (rows: MatrixRow[]) =>{
    const singleRow = rows[0];
    var columnHeadings: string[] = [];
    singleRow.cells.forEach(column => {
        columnHeadings.push(column.columnHeading);
    }
    );
    return columnHeadings;
}

export const getColumnsFromMatrixData = (matrixData: MatrixRow[]) => {
    const matrixColumns = matrixData.map((row: MatrixRow) =>{
        return row.cells
    })    
    return matrixColumns;
}

export const getCellInfo = (matrixRows: MatrixRow[], coordinatePoint: CoordinatePoint): MatrixCellInfo => {
    const {x , y} = coordinatePoint; // this is a coordinate point having x, y values
    let columnHeading: string | null = null;
    let rowHeading: string | null = null;

    const cellRow = matrixRows[y];
    rowHeading = cellRow.heading;
    columnHeading = cellRow.cells[x].columnHeading;

    return { 
        rowHeading: rowHeading,
        columnHeading: columnHeading
    }
}

export const getChartPointPositionFromEvent = (event: any): CoordinatePoint => {
    // this is guaranteed to work only for High Charts events
    const {point} = event;
    const pointPosition = point.options;
    const {x, y} = pointPosition;

    const coordinatePoint: CoordinatePoint = {
      x: x,
      y: y
    }
    return coordinatePoint;
  }

export const getRandomNumber = (countOfDigits: number): number => {
    const randomNumber = Math.floor(Math.random() * 10 ** countOfDigits);
    return randomNumber;
}

export function areStringsEqualIgnoreCase(firstString: string, secondString: string): boolean  {
    let areEqual = firstString.toUpperCase() === secondString.toUpperCase();
    return areEqual;
  }