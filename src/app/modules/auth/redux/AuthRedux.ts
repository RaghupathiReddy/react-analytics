import {Action} from '@reduxjs/toolkit'
import {persistReducer} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import {put, takeLatest, select} from 'redux-saga/effects'
import {UserModel} from '../models/UserModel'
import {getUserByToken} from "./AuthCRUD";

export interface ActionWithPayload<T> extends Action {
  payload?: T
}

export const actionTypes = {
  Login: '[Login] Action',
  Logout: '[Logout] Action',
  Register: '[Register] Action',
  UserRequested: '[Request User] Action',
  UserLoaded: '[Load User] Auth API',
  SetUser: '[Set User] Action',
}

const initialUser: UserModel = {
  _id: '',
  username: '',
  password: '',
  email: '',
  firstName: '',
  lastName: ' ',
  industry: '',
  userCreatedDate: new Date(),
  userLastLoggedIn: new Date(),
  __v: 0
}

const initialAuthState: IAuthState = {
  user: initialUser,
  accessToken: undefined,
}

export interface IAuthState {
  user: UserModel
  accessToken?: string
}

export const reducer = persistReducer(
  {storage, key: 'plainx', whitelist: ['user', 'accessToken']},
  (state: IAuthState = initialAuthState, action: ActionWithPayload<IAuthState>) => {
    switch (action.type) {
      case actionTypes.Login: {
        const accessToken = action.payload?.accessToken
        return {accessToken, 'user': initialUser}
      }

      case actionTypes.Register: {
        const accessToken = action.payload?.accessToken
        return {accessToken, 'user': initialUser}
      }

      case actionTypes.Logout: {
        return initialAuthState
      }

      case actionTypes.UserLoaded: {
        const user = action.payload?.user
        if(user)
          return {...state, user}
        else
          return state
      }

      case actionTypes.SetUser: {
        const user = action.payload?.user
        if(user)
          return {...state, user}
        else
          return state
      }

      default:
        return state
    }
  }
)

export const actions = {
  login: (accessToken: string) => ({type: actionTypes.Login, payload: {accessToken}}),
  register: (accessToken: string) => ({
    type: actionTypes.Register,
    payload: {accessToken},
  }),
  logout: () => ({type: actionTypes.Logout}),
  requestUser: () => ({
    type: actionTypes.UserRequested,
  }),
  fulfillUser: (user: UserModel) => ({type: actionTypes.UserLoaded, payload: {user}}),
  setUser: (user: UserModel) => ({type: actionTypes.SetUser, payload: {user}})
}

export function* saga() {
  yield takeLatest(actionTypes.Login, function* loginSaga() {
    yield put(actions.requestUser())
  })

  yield takeLatest(actionTypes.Register, function* registerSaga() {
    yield put(actions.requestUser())
  })

  yield takeLatest(actionTypes.UserRequested, function* userRequested() {
    // @ts-ignore
    const getToken = (state) => state.auth.accessToken;
    // @ts-ignore
    let token = yield select(getToken)
    const {data: user} = yield getUserByToken(token)
    yield put(actions.fulfillUser(user))
  })
}
