export interface BiasFeaturePageData {
    biasFeatures: BiasFeature[];
    biasDataList: BiasData[];
}

interface BiasFeature{
    featureCategory: string;
    biasInfoList: BiasInfo[];
}

interface BiasInfo{
    biasCategory: string;
    biasIndicator: number;
    featureList: string[];
}

interface BiasData{
    name: string;
    biasCategory: string;
    statisticalParity: number;
    disparateImpact: number;
}

export interface BiasTableRow {
    name: string;
    biasCategory: string;
    statisticalParity: number;
    disparateImpact: number;
}