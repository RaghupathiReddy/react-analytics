import {Action} from '@reduxjs/toolkit'

export interface ActionWithPayload<T> extends Action {
  payload: T
}
export const actionTypes = {
  GetGlobalExplainabilityData: '[GetGlobalExplainabilityData] Action',
}

const initialGEState: IGEState = {
  globalExplainabilityData: {},
}

export interface IGEState {
  globalExplainabilityData: any
}

export const GEReducer = (
  state: IGEState = initialGEState,
  action: ActionWithPayload<IGEState>
) => {
  switch (action.type) {
    case actionTypes.GetGlobalExplainabilityData: {
      const globalExplainabilityData = action.payload.globalExplainabilityData

      return {
        ...state,
        globalExplainabilityData: globalExplainabilityData,
      }
    }
    default:
      return state
  }
}

export const actions = {
  GetGlobalExplainabilityData: (data: any) => ({
    type: actionTypes.GetGlobalExplainabilityData,
    payload: {
      globalExplainabilityData: data,
    },
  }),
}
