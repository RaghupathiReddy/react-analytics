import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL

export const GET_ALL_NOTIFICATIONS = (userId: string) => `${API_URL}/notification/all/${userId}`

export const SET_NOTIFICATION_READ = (notificationId: string) => `${API_URL}/notification/${notificationId}`

export const CHECK_FOR_NOTIFICATION = (userId: string) => `${API_URL}/notification/check/${userId}`

export function checkForNewNotifications(userId: string, timestamp?: number){
    return axios.get<any>(CHECK_FOR_NOTIFICATION(userId));
}

export function getAllNotifications(userId: string){
    return axios.get<any>(GET_ALL_NOTIFICATIONS(userId))
};

export function setNotificationRead(notificationId: string){
    return axios.put(SET_NOTIFICATION_READ(notificationId));
}

