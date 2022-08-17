import {Action} from '@reduxjs/toolkit'

export interface ActionWithPayload<Type> extends Action {
  payload: Type
}
export const actionTypes = {
  GetFeatureExplainability: '[GetFeatureExplainability] Action',
}

const initialFEState: IFEState = {
  featureExplainabilityData: {},
}

export interface IFEState {
  featureExplainabilityData: any
}

export const FEReducer = (
  state: IFEState = initialFEState,
  action: ActionWithPayload<IFEState>
) => {
  switch (action.type) {
    case actionTypes.GetFeatureExplainability: {
      const featureExplainabilityData = action.payload.featureExplainabilityData

      return {
        ...state,
        featureExplainabilityData: featureExplainabilityData,
      }
    }
    default:
      return state
  }
}

export const actions = {
  GetFeatureExplainability: (data: any) => ({
    type: actionTypes.GetFeatureExplainability,
    payload: {
      featureExplainabilityData: data,
    },
  }),
}
