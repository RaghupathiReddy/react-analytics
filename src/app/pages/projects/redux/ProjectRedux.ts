import { Action } from "@reduxjs/toolkit";
import { type } from "os";
import {
  IProject,
  ProjectModel,
  ProjectRunStatus,
} from "../models/ProjectModel";
import { NotificationModel } from "../../../Models/NotificationModel";
export interface ActionWithPayload<T> extends Action {
  payload: T;
}

export const actionTypes = {
  GetAllProjects: "[GetProjects] Action",
  SetSellectedProject: "[SetSelectedProject] Action",
  GetRunStatus: "[GetRunStatus] Action",
  SetRunStatus: "[SetRunStatus] Action",
};

const initialProjectState: IProjectState = {
  allProjects: [],
  selectedProject: {
    projectId: "",
    projectName: "",
    industry: "",
    useCase: "",
    projectStage: "",
  }
};

export type IProjectState = {
  allProjects: Array<IProject>;
  selectedProject?: {
    projectId: string;
    projectName: string;
    industry: string;
    useCase: string;
    projectStage: string;
  };
};

export type IProjectStatusUpdate = Partial<NotificationModel>;
export type ActionPayload = IProjectState & IProjectStatusUpdate;

export const ProjectReducer = (
  state: IProjectState = initialProjectState,
  action: ActionWithPayload<ActionPayload>
) => {
  switch (action.type) {
    case actionTypes.GetAllProjects: {
      const allProjects = action.payload.allProjects;
      return { ...state, allProjects: allProjects };
    }
    case actionTypes.SetSellectedProject: {
      const selectedProject = action.payload?.selectedProject;
      return { ...state, selectedProject };
    }
    case actionTypes.SetRunStatus: {
      return {
        ...state,
        allProjects: state.allProjects.map((project: IProject) => {

          if (project.projectId === action.payload?.projectId) {
            project.isRunComplete = true;
            project.projectStatus = action.payload?.updatedProjectStatus;
          }
          
          return project;
        }),
      };
    }
    default:
      return state;
  }
};

export const actions = {
  getAllProjects: (data: Array<IProject>) => ({
    type: actionTypes.GetAllProjects,
    payload: { allProjects: data },
  }),
  setSelectedProject: (data: Partial<ProjectModel>) => ({
    type: actionTypes.SetSellectedProject,
    payload: { selectedProject: data },
  }),
  setProjectRunStatus: (notification: IProjectStatusUpdate) => ({
    type: actionTypes.SetRunStatus,
    payload: notification,
  }),
};
