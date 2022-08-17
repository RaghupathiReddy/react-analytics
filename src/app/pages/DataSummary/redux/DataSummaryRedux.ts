import {Action} from '@reduxjs/toolkit'
import { SummaryPageData } from "../../../Models/DataSummaryModels";

export interface ActionWithPayload<Type> extends Action {
  payload: Type;
}
export const actionTypes = {
  GetSummary: "[GetSummary] Action",
};

export const initialDataSummary: IDataSummary = {
  dataSummary: null,
};

export interface IDataSummary {
  dataSummary: SummaryPageData | null;
}

export const DataSummaryReducer = (
  state: IDataSummary = initialDataSummary,
  action: ActionWithPayload<IDataSummary>
) => {
  switch (action.type) {
    case actionTypes.GetSummary: {
      const dataSummary = action.payload.dataSummary;

      return {
        ...state,
        dataSummary,
      };
    }
    default:
      return state;
  }
};

export const actions = {
  GetSummary: (data: SummaryPageData) => ({
    type: actionTypes.GetSummary,
    payload: {
      dataSummary: data,
    },
  }),
};
