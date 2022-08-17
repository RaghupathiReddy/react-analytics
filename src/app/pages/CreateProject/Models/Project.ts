export interface ProjectForm {
  modelName: string
  modelDescription: string
  dataFile?: string | undefined | never[]
  trainingData?: string | undefined
  yFile?: string | undefined
  modelFile?: string | undefined
  columns?: Array<IColumnsState>
  yFileColumns?: Array<IColumnsState>
  projectType: string
  userId?: string
}

export interface IColumnsState {
  name: string
  type: "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function"
  comment?: string
  label?: string
  binning?:  boolean
  oneNotEncoding?: boolean
  standardization?: boolean
  labelEncoding?: boolean
}

export const columnsInitialState: IColumnsState= {
  name: "",
  type: "string",
  comment: "",
  label: "",
  binning: false,
  oneNotEncoding: false,
  standardization: false,
  labelEncoding: false
}
  
export interface FileDetails {
  fileURL: string | undefined
  fileSize: number | undefined
  fileName: string | undefined
}
