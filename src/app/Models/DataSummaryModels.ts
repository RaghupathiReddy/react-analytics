
 export interface RateInfo {
    acceptedRate: number;
    errorRate: number;
    claimRate: number;
    noClaimRate: number;
    noOfClaims: number;
    fraudalent: number;
    nonFraudalent: number;
}
export  interface ErrorInfo {
    type: string;
    count: number;
}
export interface SummaryPageData {
      documentCount: number;
      errorsInfo: ErrorInfo[];
      modelTarget: string;
      projectId?: string;
      rateInfo: RateInfo;
      _id?: string;
}