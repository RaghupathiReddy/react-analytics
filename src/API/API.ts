import axios from "axios"
import config from "../app/config"

//TODO: Update the below function according to need as
//      we start using this across the application

export function getAPI(endpoint : string){
    return axios.get(`${config.HOST_NAME}${endpoint}`)
}
export function putAPI(endpoint : string,body : object){
    return axios.put(`${config.HOST_NAME}${endpoint}`,body)
}

export function postAPI(endpoint : string,body : object){
    return axios.post(`${config.HOST_NAME}${endpoint}`,body)
}