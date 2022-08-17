import axios from 'axios'
import { ProjectForm } from '../Models/Project'

const API_URL = process.env.REACT_APP_API_URL

export const MODEL_URL = `${API_URL}/api/get_all_topics`

export function getAllBusinessTopics() {
  return axios.get<any>(`${MODEL_URL}`)
}

export function createProject(newProject: ProjectForm): any{
  return axios.post(`${API_URL}/project`, newProject);
}