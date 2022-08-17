export interface TreeMapData {
  name: string,
  value: number,
  colorValue: number,
}

export interface TableColumn {
  field: string,
  width?: number,
  resizable?: boolean,
  sort?: "asc" | "desc",
  checkboxSelection?: boolean,
}

export interface FETreepMap {
  category: string,
  features: string,
  rank: string,
}

export interface OccurenceTableColumnField{ 
  claimNumber: number,
  NewProbabilityOfClaim: number,
  OriginalProbabilityOfClaim: number,
  change: number,
}
export interface OccurenceData {
 claimNumber: number,
  accidentsite_Local: number
  accidentsite_ParkingLot:number
  addresschangeind_1:number
  ageofdriver: number
  ageofvehicle: number
  annualincome: number
  biasedClass:number
  channel_Online: number
  channel_Phone: number
  claimestpayout: number
  flag: number
  gender_M: number
  higheducationind_1: number
  liabprct: number
  livingstatus_Rent: number
  "maritalstatus_1.0": number
  maritalstatus_Unknown: number
  pastnumofclaims_1: number
  pastnumofclaims_2: number
  pastnumofclaims_3: number
  pastnumofclaims_4: number
  pastnumofclaims_5: number
  pastnumofclaims_6: number
  policyreportfiledind_1: number
  saftyrating: number
  unbiasedClass: number
  unbiasedProbability: number
  ununbiasedProbability: number
  vehiclecategory_Large: number
  vehiclecategory_Medium: number
  vehiclecolor_blue: number
  vehiclecolor_gray: number
  vehiclecolor_other: number
  vehiclecolor_red: number
  vehiclecolor_silver: number
  vehiclecolor_white: number
  vehicleprice: number
  vehicleweight: number
  "witnesspresentind_1.0": number
  witnesspresentind_Unknown: number
}
export interface FeatureExplainabilityTableData {
  rank: number,
  flex: number,
  feature: string,
  averageShap: number,
  totalPositive: number,
  totalNegative: number,
  occurance: number,
  percentagePresentEntries: number,
  category: string,
  occurenceList: OccurenceData[],
}
export interface FeatureExplainabilityData {
  featureExplainabilityTreemap: FETreepMap[],
  featureExplainabilityTable: FeatureExplainabilityTableData[],
  featureExplainabilityEntryTable:OccurenceData[]
}

export interface IPredictionRequest{
  messageId: string;
  predictions:object;
  projectId: string;
}
