export interface IProject {
  projectName: string;
  projectDescription: string;
  projectCreatedDate: Date;
  projectId: string;
  isRunComplete: boolean,
  projectStatus?: string
}

export interface ProjectRunStatus{
  projectId: string
  isRunComplete: boolean
}

export interface ProjectModel {
    created_date: string
    industry: string
    project_name: string
    project_stage: string
    update_data: string
    use_case: string
    userId: string
    _id: string
}

export interface CreateProject extends DataFields, ProjectFields{
  model: Partial<ModelFields>;
}

export interface ModelFields {
  modelName: string;
  modelType: string;
  dataToPredict: string;
  modelFile: string | undefined | never[];
}

export interface DataFields{
  datasetName: string;
  datasetType: string;
  dataFile: string | undefined | never[];
  datasetSize: number| undefined;
}

export interface ProjectFields {
  userId: string | null;
  projectName: string;
  projectStage: string;
  industry: string;
  useCase: string;
}

export interface FileDetails {
  fileURL: string | undefined;
  fileSize: number | undefined;
}
