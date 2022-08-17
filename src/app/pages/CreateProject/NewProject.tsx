import { useState } from 'react';
import { useFormik } from 'formik'
import * as Yup from 'yup'
import clsx from 'clsx'
// import * as XLSX from 'xlsx';
import CSVReader, { IFileInfo } from 'react-csv-reader'
import { useNavigate } from 'react-router-dom'

import { useDispatch, connect } from 'react-redux';
import { ProjectForm, FileDetails } from './Models/Project';
import { getFileDetails } from '../../helpers/fileUploader';
import * as Topics from './Redux/ProjectRedux';

const NewProject: React.FC<{ selectedTopic: Topics.IChildTopicState }> = ({ selectedTopic }) => {
  const [newApi, setNewApi] = useState<Boolean>(false);
  const [previousValue, setPreviousValue] = useState<string>('');
  const [modelName, setModelName] = useState('');
  const [modelDescription, setModelDescription] = useState('');
  const [dataFile, setDataFile] = useState('');
  const [modelFile, setModelFile] = useState('');
  const [fileUploading, setFileUploading] = useState<boolean | undefined>(false);
  const navigate = useNavigate()

  if (selectedTopic.name !== previousValue) {
    setNewApi(false);
    setPreviousValue(selectedTopic.name);
  }

  const projectSchema = Yup.object().shape({
    modelName: Yup.string()
      .min(3, 'Minimum 3 symbols')
      .max(50, 'Maximum 50 symbols')
      .required('Model name is required'),
    modelDescription: Yup.string()
      .min(3, 'Minimum 3 symbols')
      .max(50, 'Maximum 50 symbols')
      .required('Description is required'),
  })
  const dispatch = useDispatch();

  const initialValues = {
    modelName,
    modelDescription,
    newApi,
    dataFile,
    modelFile
  }

  const [fileDetails, setFileDetails] = useState<FileDetails>({ fileURL: undefined, fileSize: undefined, fileName: undefined })
  const formik = useFormik({
    initialValues,
    validationSchema: projectSchema,
    onSubmit: (values) => {
      if (!fileDetails.fileURL) {
        return
      }
      let projectDetails: ProjectForm = {
        modelName: values.modelName,
        modelDescription: values.modelDescription,
        dataFile: fileDetails.fileURL,
        projectType: "Type 1",
      }
      dispatch(Topics.actions.setNewProjectDetails(projectDetails));
      navigate('/data-mapper');
    }
  })

  const CSVParseOptions = {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    transformHeader: (header: any) =>
      header
        .replace(/\W/g, '_')
  }

  const handlefileChange = async (data: any, fileInfo: IFileInfo, file: File | undefined) => {
    setFileUploading(true);
    if (file) {
      getFileDetails(file).then(
        (details) => {
          setFileDetails(details)
          const columnInfo = Object.keys(data[0]).map((column) => { return { name: column, type: typeof (data[0][column]) } });
          dispatch(Topics.actions.setColumnsInfo(columnInfo));
          setFileUploading(false);
        },
        (err) => {
          setFileUploading(false);
        });
    };
  };

  const setApiDetails = (e: any) => {
    setNewApi(e.currentTarget.checked);
  }

  const checkForFiles = () => {
    if (fileDetails.fileURL)
      return false;
    else
      return true;
  }

  return (
    <form
      className='form w-100 fv-plugins-bootstrap5 fv-plugins-framework'
      id='kt_create_project_form'
      onSubmit={formik.handleSubmit}
    >
      <div className="d-flex flex-row justify-content-between create-new-model-header">
        <div className="d-flex flex-fill flex-column justify-content-around">
          <p className="text-dark fw-bolder fs-6">Create New Model</p>
          <p className="">{selectedTopic.name}</p>
        </div>
      </div>
      {/* begin::Form group Model name */}
      <div className='fv-row mb-7'>
        <div>
          <label className='form-label fs-6 fw-bolder text-dark'>Model name</label>
          <input
            placeholder='Model name'
            type='text'
            autoComplete='off'
            {...formik.getFieldProps('modelName')}
            className={clsx(
              'form-control form-control-lg form-control-solid',
              {
                'is-invalid': formik.touched.modelName && formik.errors.modelName,
              },
              {
                'is-valid': formik.touched.modelName && !formik.errors.modelName,
              }
            )}
          />
          {formik.touched.modelName && formik.errors.modelName && (
            <div className='fv-plugins-message-container'>
              <div className='fv-help-block'>
                <span role='alert'>{formik.errors.modelName}</span>
              </div>
            </div>
          )}
        </div>

        {/* begin::Form group Model Description */}
        <div className='fv-row mb-7'>
          <label className='form-label fs-6 fw-bolder text-dark'>Model description</label>
          <input
            placeholder='What needs to be predicted'
            type='text'
            autoComplete='off'
            {...formik.getFieldProps('modelDescription')}
            className={clsx(
              'form-control form-control-lg form-control-solid',
              { 'is-invalid': formik.touched.modelDescription && formik.errors.modelDescription },
              {
                'is-valid': formik.touched.modelDescription && !formik.errors.modelDescription,
              }
            )}
          />
          {formik.touched.modelDescription && formik.errors.modelDescription && (
            <div className='fv-plugins-message-container'>
              <div className='fv-help-block'>
                <span role='alert'>{formik.errors.modelDescription}</span>
              </div>
            </div>
          )}
        </div>
        {/* end::Form group */}

        <div className='pb-4'>
          <label className='form-check form-switch form-switch-sm form-check-custom form-check-solid flex-stack'>
            <span className='form-check-label text-gray-700 fs-6 fw-bold ms-0 me-2'>
              Do you have an existing AI model?
            </span>
            <input className='form-check-input' type='checkbox' value='true' onChange={(e) => setApiDetails(e)} />
          </label>
        </div>

        <span className='form-check form-check-custom form-check-solid mb-4'>
          <label
            className='form-check-label text-gray-700 fs-6 fw-bold ms-0 me-2'
          >Upload Method</label>
          <input
            className='form-check-input'
            type='radio'
            name='uploadMethod'
            value='file'
          />
          <label
            className='form-check-label text-gray-700 fs-8'
          >CSV File Upload</label>
          <input
            className='form-check-input'
            type='radio'
            name='uploadMethod'
            value='apiIntegration'
          />
          <label
            className='form-check-label text-gray-700 fs-8'
          >API Integration</label>
        </span>

        {/* begin::Form group Model File */}
        <div className='fv-row mb-5'>
          <div className='form-label fw-bolder text-dark fs-6'>Data File</div>
          <span>
            {fileUploading ?
              <span className='indicator-progress d-inline'>
                Please wait...
                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
              </span>
              :
              fileDetails.fileName
            }
          </span>
          <CSVReader
            cssClass='form-control form-control-lg form-control-solid csv-reader-input'
            onFileLoaded={(data, fileInfo, originalFile) => {
              handlefileChange(data, fileInfo, originalFile);
            }}
            inputId="uploadDataFile"
            parserOptions={CSVParseOptions}
          />
        </div>
        {newApi ? (
          <div className='fv-row mb-5 upload-file'>
            <div className='form-label fw-bolder text-dark fs-6'>Model File</div>
            <span>
              {fileUploading ?
                <span className='indicator-progress  d-block'>
                  Please wait...
                  <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                </span>
                :
                fileDetails.fileName
              }
            </span>
            <CSVReader
              cssClass='form-control form-control-lg form-control-solid csv-reader-input custom-file-input'
              inputId="uploadModelFile"
              onFileLoaded={(data, fileInfo, originalFile) => {
                console.log(fileInfo);
              }}
              parserOptions={CSVParseOptions}
            />
          </div>)
          : ''}
      </div>
      <div className="flex-fill d-flex align-items-center justify-content-end">
        <button
          type="submit"
          className="btn btn-primary create-new-model-import-data-button"
          disabled={formik.isSubmitting || !formik.isValid || !fileDetails.fileURL} >
          Continue
        </button>
      </div>
    </form>
  )
}

function mapState(state: any) {
  const { selectedTopic } = state.businessTopics;
  return { selectedTopic };
}

export default connect(mapState)(NewProject)