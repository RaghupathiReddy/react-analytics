import {Action} from '@reduxjs/toolkit'

//CONTAINS REDUCERS AND ACTIONS

export interface ActionWithPayload<Type> extends Action {
  payload: Type
}

export const actionTypes = {
  getData: '[GetData] Action',
  toggleCounterfactualValues: '[Toggle] Action',
  setPairDataPredictedYes: '[PairData] Action',
  setPairDataPredictedNo: '[PairDataNo] Action',
  setPointEditedByUser: '[SavesEditedPoint] Action',
}

//tried to add as many types as possible, these will change later after api response is standard
export interface dataObject {
  cartype_Pickup?: number | string | null | undefined
  cartype_Pickup_org?: number | string | null | undefined
  cartype_Van?: number | string | null | undefined
  cartype_Van_org?: number | string | null | undefined
  cartype_z_SUV?: number | string | null | undefined
  cartype_z_SUV_org?: number | string | null | undefined
  caruse_Private?: number | string | null | undefined
  caruse_Private_org?: number | string | null | undefined
  clmfreq_1?: number | string | null | undefined
  clmfreq_1_org?: number | string | null | undefined
  clmfreq_2?: number | string | null | undefined
  clmfreq_2_org?: number | string | null | undefined
  clmfreq_3?: number | string | null | undefined
  clmfreq_3_org?: number | string | null | undefined
  clmfreq_4?: number | string | null | undefined
  clmfreq_4_org?: number | string | null | undefined
  clmfreq_5?: number | string | null | undefined
  clmfreq_5_org?: number | string | null | undefined
  education_Bachelors?: number | string | null | undefined
  education_Bachelors_org?: number | string | null | undefined
  education_Masters?: number | string | null | undefined
  education_Masters_org?: number | string | null | undefined
  education_PhD?: number | string | null | undefined
  education_PhD_org?: number | string | null | undefined
  gender_z_F?: number | string | null | undefined
  gender_z_F_org?: number | string | null | undefined
  homekids_1?: number | string | null | undefined
  homekids_1_org?: number | string | null | undefined
  homekids_2?: number | string | null | undefined
  homekids_2_org?: number | string | null | undefined
  homekids_3?: number | string | null | undefined
  homekids_3_org?: number | string | null | undefined
  homekids_4?: number | string | null | undefined
  homekids_4_org?: number | string | null | undefined
  homekids_5?: number | string | null | undefined
  homekids_5_org?: number | string | null | undefined
  kidsdriv_1?: number | string | null | undefined
  kidsdriv_1_org?: number | string | null | undefined
  kidsdriv_2?: number | string | null | undefined
  kidsdriv_2_org?: number | string | null | undefined
  kidsdriv_3?: number | string | null | undefined
  kidsdriv_3_org?: number | string | null | undefined
  kidsdriv_4?: number | string | null | undefined
  kidsdriv_4_org?: number | string | null | undefined
  mstatus_z_No?: number | string | null | undefined
  mstatus_z_No_org?: number | string | null | undefined
  mvrpts_1?: number | string | null | undefined
  mvrpts_1_org?: number | string | null | undefined
  mvrpts_2?: number | string | null | undefined
  mvrpts_2_org?: number | string | null | undefined
  mvrpts_3?: number | string | null | undefined
  mvrpts_3_org?: number | string | null | undefined
  mvrpts_4?: number | string | null | undefined
  mvrpts_4_org?: number | string | null | undefined
  mvrpts_5?: number | string | null | undefined
  mvrpts_5_org?: number | string | null | undefined
  mvrpts_6?: number | string | null | undefined
  mvrpts_6_org?: number | string | null | undefined
  mvrpts_7?: number | string | null | undefined
  mvrpts_7_org?: number | string | null | undefined
  mvrpts_8?: number | string | null | undefined
  mvrpts_8_org?: number | string | null | undefined
  mvrpts_9?: number | string | null | undefined
  mvrpts_9_org?: number | string | null | undefined
  mvrpts_10?: number | string | null | undefined
  mvrpts_10_org?: number | string | null | undefined
  mvrpts_11?: number | string | null | undefined
  mvrpts_11_org?: number | string | null | undefined
  mvrpts_12?: number | string | null | undefined
  mvrpts_12_org?: number | string | null | undefined
  mvrpts_13?: number | string | null | undefined
  mvrpts_13_org?: number | string | null | undefined
  occupation_Doctor?: number | string | null | undefined
  occupation_Doctor_org?: number | string | null | undefined
  occupation_Lawyer?: number | string | null | undefined
  occupation_Lawyer_org?: number | string | null | undefined
  occupation_Manager?: number | string | null | undefined
  occupation_Manager_org?: number | string | null | undefined
  occupation_Professional?: number | string | null | undefined
  occupation_Professional_org?: number | string | null | undefined
  occupation_Student?: number | string | null | undefined
  occupation_Student_org?: number | string | null | undefined
  parent1_Yes?: number | string | null | undefined
  parent1_Yes_org?: number | string | null | undefined
  predicted?: number | string | null | undefined
  predicted_value?: number | string | null | undefined
  redcar_yes?: number | string | null | undefined
  redcar_yes_org?: number | string | null | undefined
  revoked_Yes?: number | string | null | undefined
  revoked_Yes_org?: number | string | null | undefined
}

export interface ILocalExplainabilityState {
  defaultData: Array<dataObject>
  predictedYesRecordsArray: Array<dataObject> | null
  predictedNoRecordsArray: Array<dataObject> | null
  showCounterfactualValues: boolean
  pairSeriesNameWithData: Object 
  //THE ABOVE GENERIC OBJECT TYPE IS CAUSING TS ERRORS MAJORLY , HENCE FORCING TO USE ANY TYPE ,TAKE IT UP IN LATER DEV STAGE
  pointEditedByUser: dataObject | null
}

const initialLocalExplainabilityState: ILocalExplainabilityState = {
  defaultData: [],
  predictedYesRecordsArray: null,
  predictedNoRecordsArray: null,
  showCounterfactualValues: false,
  pairSeriesNameWithData: {}, 
  pointEditedByUser:null,
}

export const LocalExplainabilityReducer = (
  state: ILocalExplainabilityState = initialLocalExplainabilityState,
  action: ActionWithPayload<ILocalExplainabilityState>
) => {
  switch (action.type) {
    case actionTypes.getData: {
      const data = action.payload.defaultData

      let predictedYesData = data.filter((obj) => {
        return obj.predicted !== 0
      })

      let predictedNoData = data.filter((obj) => {
        return obj.predicted !== 1
      })

      return {
        ...state,
        defaultData: data,
        predictedYesRecordsArray: predictedYesData,
        predictedNoRecordsArray: predictedNoData,
      }
    }
    case actionTypes.toggleCounterfactualValues: {
      return {...state, showCounterfactualValues: !state.showCounterfactualValues}
    }
    case actionTypes.setPairDataPredictedYes: {
      let data = action.payload
      return {
        ...state,
        pairSeriesNameWithData: {
          ...state.pairSeriesNameWithData,
          predictedYes: data,
        },
      }
    }
    case actionTypes.setPairDataPredictedNo: {
      let data = action.payload
      return {
        ...state,
        pairSeriesNameWithData: {
          ...state.pairSeriesNameWithData,
          predictedNo: data,
        },
      }
    }
    case actionTypes.setPointEditedByUser: {
      let data = action.payload
      return {
        ...state,
        pointEditedByUser: data,
      }
    }
    default:
      return state
  }
}

export const actions = {
  getData: (data: Array<Object>) => ({
    type: actionTypes.getData,
    payload: {
      defaultData: data,
    },
  }),
  toggleCounterfactual: () => ({type: actionTypes.toggleCounterfactualValues, payload: null}),
  setPairDataPredictedYes: (data: Array<dataObject>) => ({
    type: actionTypes.setPairDataPredictedYes,
    payload: data,
  }),
  setPairDataPredictedNo: (data: Array<dataObject>) => ({
    type: actionTypes.setPairDataPredictedNo,
    payload: data,
  }),
  setPointEditedByUser: (data: dataObject) => ({
    type: actionTypes.setPointEditedByUser,
    payload: data,
  }),
}
