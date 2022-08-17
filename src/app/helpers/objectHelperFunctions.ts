import { IGenericObject } from "../Models/ObjectModel";


export function excludeProperties(data: IGenericObject, excludedProperties: string[]): object {
    let newData:IGenericObject = {};
    for (let key in data) {
        if (!excludedProperties.includes(key)) {
            newData[key] = data[key];
        }
    }
    return newData;
  
}
