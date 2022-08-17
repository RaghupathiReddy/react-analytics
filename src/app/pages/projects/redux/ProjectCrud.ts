import { CreateProject } from './../models/ProjectModel';
import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL

export const GET_ALL_PROJECTS = (userId: string) => `${API_URL}/project/all/${userId}`
export const GET_PROJECT_BY_ID = (projectId: string | undefined) => ( `${API_URL}/project/${projectId}` )
export const GET_PROJECT_RUN_STATUS_BY_ID = (projectId: string | undefined) => ( `${API_URL}/project/status/${projectId}` )

export function getAllProjects(userId: string){
    return axios.get<any>(GET_ALL_PROJECTS(userId))
};

export function getProjectById(projectId: string | undefined){
    return axios.get<any>(GET_PROJECT_BY_ID(projectId))
}

export function createProject(newProject: CreateProject): any{
    return axios.post(`${API_URL}/project/new`, newProject);
}

export function getProjectRunStatusById(projectId: string | undefined){
    return axios.get<any>(GET_PROJECT_RUN_STATUS_BY_ID(projectId))
}