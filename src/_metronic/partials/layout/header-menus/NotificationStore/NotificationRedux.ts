import { NotificationModel } from '../../../../../app/Models/NotificationModel';
import {Action} from '@reduxjs/toolkit'

export interface ActionWithPayload<T> extends Action {
  payload: T
}

export const actionTypes = {
    GetNotifications: '[GetNotifications] Action',
    AddNotifications: '[AddNotifications] Action'
}

const initialNotificationState: INotificationState = {
  allNotifications: []
}

export interface INotificationState {
  allNotifications: Array<NotificationModel>
}

export const NotificationReducer = (state: INotificationState = initialNotificationState, action: ActionWithPayload<INotificationState>)=>{
  switch (action.type) {
    case actionTypes.GetNotifications: {
      const notifications = action.payload.allNotifications
      return { ...state, allNotifications: notifications }
    }
    case actionTypes.AddNotifications: {
      return { ...state, allNotifications: action.payload.allNotifications.concat(state.allNotifications) }
    }
    default:
      return state
  }
}


export const actions = {
  setNotifications: (data: Array<NotificationModel>) => ({type: actionTypes.GetNotifications, payload: {allNotifications: data}}),
  addNotifications: (notifications: Array<NotificationModel>) => ({type: actionTypes.AddNotifications, payload: {allNotifications : notifications}})
}
