import {Action} from '@reduxjs/toolkit'
import { IEDAState } from '../../../Models/EDAModels'

//CONTAINS REDUCERS AND ACTIONS

export interface ActionWithPayload<Type> extends Action {
  payload: Type
}

export const actionTypes = {
    getEDAData : '[GetEDAData] Action'
}

export const actions = {
    getEDAData : (data : IEDAState) => ({type : actionTypes.getEDAData ,payload : data})
}

export const initialState = {
    columnAndLineChart: [],
	stackedBarChart: [],
	areaChart:[],
	heatMap: {
        xAxisCategories: [],
	    yAxisCategories: [],
	    values:[],
    }
}
export const EDAReducer = (state :IEDAState = initialState ,   action: ActionWithPayload<IEDAState>) =>{
    switch(action.type){
        case (actionTypes.getEDAData): {
            const data = action.payload
            return {
                ...state,
                ...data
            }
        }
        default : 
            return state
    }
}