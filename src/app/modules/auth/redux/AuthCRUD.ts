import axios from 'axios'
import config from '../../../config'
import {User} from '../models/UserModel' 
import {UserModel} from '../models/UserModel' 

const API_URL = config.HOST_NAME;

export const GET_USER_BY_ACCESSTOKEN_URL = `${API_URL}/user/verify_token`
export const LOGIN_URL = `${API_URL}/auth/login`
export const REGISTER_URL = `${API_URL}/user`
export const REQUEST_PASSWORD_URL = `${API_URL}/user/forgot_password`
export const UPDATE_PASSWORD_URL = `${API_URL}/user/update_password`

// Server should return AuthModel
export function login(username: string, password: string) {
  return axios.post(LOGIN_URL, {
    username,
    password,
  })
}

// Server should return AuthModel
export function register(user:User) {  
 return axios.post(REGISTER_URL, user).then((response) => {
    return response
  })
}

// Server should return object => { result: boolean } (Is Email in DB)
export function requestPassword(email: string, resetPasswordEndPoint: string) {
  return axios.post<{result: boolean}>(REQUEST_PASSWORD_URL, {
    email,
    resetPasswordEndPoint,
  })
}

export function updatePassword(password:string , userId : string | undefined , token : string | undefined){
  return axios.post(`${UPDATE_PASSWORD_URL}/${userId}/${token}`,{
    password
  })
}

export function getUserByToken(token:string) {
  return axios.post<UserModel>(GET_USER_BY_ACCESSTOKEN_URL)
}
