import {Action} from '@reduxjs/toolkit'
import { ProjectForm, IColumnsState } from '../Models/Project'

export interface ActionWithPayload<T> extends Action {
  payload: T
}

export const actionTypes = {
  GetAllTopics: '[GetAllTopics] Action',
  SetSelectedTopic: '[SetSelectedTopic] Action',
  SetColumnsInfo: '[SetColumnsInfo] Action',
  SetNewProjectDetails: '[SetNewProjectDetails] Action',
  SetYFileColumnsInfo: '[SetYFileColumnsInfo] Action',
}

const initialTopicsState: ITopicsState = {
  topics: [],
  selectedTopic: {
    name: '',
    requiredColumns: []
  },
  newProject: {
    modelName: '',
    modelDescription: '',
    columns: [],
    yFileColumns: [],
    projectType: ''
  }  
}

export interface IChildTopicState {
  name: string,
  requiredColumns: Array<any>
}


export interface ITopicsState {
  topics: Array<{
    title: string,
    description: string,
    children: Array<IChildTopicState>,
  }>
  selectedTopic: IChildTopicState,
  newProject: ProjectForm
}

export const BusinessTopicReducer = (state: ITopicsState = initialTopicsState, action: ActionWithPayload<ITopicsState>)=>{
  switch (action.type) {
    case actionTypes.GetAllTopics: {
      return action.payload;
    }
    case actionTypes.SetSelectedTopic: {
      const selectedTopic = action.payload;
      return {...state, selectedTopic};
    }
    case actionTypes.SetColumnsInfo: {
      const columns = action.payload;
      return {...state, newProject: {...state.newProject, columns}}
    }
   case actionTypes.SetYFileColumnsInfo: {
      const yFileColumns = action.payload;
      return {...state, newProject: {...state.newProject, yFileColumns}}
   }
    case actionTypes.SetNewProjectDetails: {
      const projectData = action.payload
      const newProject = { ...state.newProject, ...projectData};
      return {...state, newProject}
    }
    default:
      return state
  }
}


export const actions = {
  getAllTopics: (data: Array<ITopicsState>) => ({type: actionTypes.GetAllTopics, payload: {topics: data}}),
  setSelectedTopic: (data: IChildTopicState) => ({type: actionTypes.SetSelectedTopic, payload: data}),
  setColumnsInfo: (data: Array<IColumnsState>) => ({type: actionTypes.SetColumnsInfo, payload: data}),
  setNewProjectDetails: (data: ProjectForm) => ({type: actionTypes.SetNewProjectDetails, payload: data}),
  setYFileColumnsInfo: (data: Array<IColumnsState>) => ({type: actionTypes.SetYFileColumnsInfo, payload: data}),
}
