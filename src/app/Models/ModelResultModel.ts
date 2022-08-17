export interface Claim {
  biasedClass?: number;
  biasedProbability?: number;
  claimNo: string;
  flag: number;
  genderM?: number;
  livingStatusRent?: number;
  maritalStatus?: number;
  maritalStatusUnknown?: number;
  unbiasedClass?: number;
  unbiasedProbability?: number;
  outcomeChange?: string;
}

export interface FeatureContribution {
  order: number;
  name: string;
  y: number;
}

export interface Bias {
  bias: string;
  previousImpact: string;
  "#OfOccurance": number;
  claimsImpacted: number;
  biasedStatisticalParity: number;
  unbiasedStatisticalParity: number;
  biasedDisparateImpact: number;
  unbiasedDisparateImpact: number;
  biasName: string;
}

export interface TableColumnField {
  field: string;
  checkboxSelection?: boolean;
  width?: number;
  cellRenderer?: string;
}
export interface RemovedBiasTableColumn{
  KPI:string,
  values:number,
}