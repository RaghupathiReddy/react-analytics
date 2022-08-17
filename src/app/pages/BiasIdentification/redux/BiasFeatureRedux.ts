import { Action } from "@reduxjs/toolkit";
import { BiasFeaturePageData } from "../../../Models/BiasModels";

export interface ActionWithPayload<Type> extends Action {
  payload: Type;
}
export const actionTypes = {
    GetBiasFeaturesData: "[GetBiasFeatureData] Action",
};

export const initialBiasFeaturesData: IBiasFeaturesDataState = {
  biasFeaturesData: null,
};

export interface IBiasFeaturesDataState {
  biasFeaturesData: BiasFeaturePageData | null;
}

export const BiasFeatureReducer = (
  state: IBiasFeaturesDataState = initialBiasFeaturesData,
  action: ActionWithPayload<IBiasFeaturesDataState>
) => {
  switch (action.type) {
    case actionTypes.GetBiasFeaturesData: {
      const biasFeaturesData = action.payload.biasFeaturesData;

      return {
        ...state,
        biasFeaturesData
      };
    }
    default:
      return state;
  }
};

export const actions = {
GetBiasFeaturesData: (data: BiasFeaturePageData) => ({
    type: actionTypes.GetBiasFeaturesData,
    payload: {
        biasFeaturesData: data,
    },
  }),
};