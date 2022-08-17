import { Action } from "@reduxjs/toolkit";

export interface ActionWithPayload<Type> extends Action {
  payload: Type;
}
export const actionTypes = {
  GetModelResultData: "[GetGlobalExplainabilityData] Action",
};

const initialModelResultState: IModelResultState = {
  modelResultData: {},
};

export interface IModelResultState {
  modelResultData: any;
}

export const ModelResultReducer = (
  state: IModelResultState = initialModelResultState,
  action: ActionWithPayload<IModelResultState>
) => {
  switch (action.type) {
    case actionTypes.GetModelResultData: {
      const modelResultData = action.payload.modelResultData;

      return {
        ...state,
        modelResultData: modelResultData,
      };
    }
    default:
      return state;
  }
};

export const actions = {
  GetModelResultData: (data: any) => ({
    type: actionTypes.GetModelResultData,
    payload: {
      modelResultData: data,
    },
  }),
};
