import { useState, useEffect } from 'react';
import { useFormik } from 'formik'
import * as Yup from 'yup'
import clsx from 'clsx'
// import * as XLSX from 'xlsx';
import CSVReader, { IFileInfo } from 'react-csv-reader'
import { useNavigate } from 'react-router-dom'
import { useDispatch, connect } from 'react-redux';
import { ProjectForm } from './Models/Project';
import { getFileDetails } from '../../helpers/fileUploader';
import * as Topics from './Redux/ProjectRedux';
import { routePath } from '../../routing/route-paths';

const ExplainMyModelForm: React.FC<{ userId: string }> = ({ userId }) => {
  const [newApi, setNewApi] = useState<Boolean>(false);
  const [modelName, setModelName] = useState('');
  const [modelDescription, setModelDescription] = useState('');
  const [trainingData, setTrainingData] = useState<string | undefined>('');
  const [yFileData, setYFileData] = useState<string | undefined>('');
  const [yFile, setYFile] = useState<string | undefined>('');
  const [modelFile, setModelFile] = useState<string | undefined>('');
  const [trainingDataLoading, setTrainingDataLoading] = useState<boolean | undefined>(false);
  const [yFileLoading, setYFileLoading] = useState<boolean | undefined>(false);
  const [dataMapperTableData, setdataMapperTableData] = useState<string[]>([]);
  const [modelFileLoading, setModelFileLoading] = useState<boolean | undefined>(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();


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

  const initialValues = {
    modelName,
    modelDescription,
    newApi,
    trainingData,
    yFile,
    modelFile
  }

  const formik = useFormik({
    initialValues,
    validationSchema: projectSchema,
    onSubmit: (values) => {
      let projectDetails: ProjectForm = {
        modelName: values.modelName,
        modelDescription: values.modelDescription,
        trainingData: trainingData,
        yFile: yFile,
        modelFile: modelFile,
        userId: userId,
        projectType: 'Type 2'
      }
      dispatch(Topics.actions.setNewProjectDetails(projectDetails));
      navigate(routePath.dataMapper);
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

  const updateTrainingData = async (data: any, fileInfo: IFileInfo, file: File | undefined) => {
    setTrainingDataLoading(true);
    if (file) {
      getFileDetails(file).then(
        (details) => {
          setTrainingData(details.fileURL)
          setTrainingDataLoading(false);
          setdataMapperTableData(data.splice(0, 3))
          const columnInfo = Object.keys(data[0]).map((column) => { return { name: column, type: typeof (data[0][column]) } });
          dispatch(Topics.actions.setColumnsInfo(columnInfo));
        },
        (err) => {
          setTrainingDataLoading(false);
        });
    };
  };
  useEffect(() => {
    localStorage.setItem('dataMapperTableData', JSON.stringify(dataMapperTableData));

  }, [dataMapperTableData])

  const updateYFile = async (data: any, file: File | undefined) => {
    setYFileLoading(true);
    if (file) {
      getFileDetails(file).then(
        (details) => {
          setYFile(details.fileURL)
          setYFileLoading(false);
          setYFileData(data)
          const yFileColumnInfo = Object.keys(data[0]).map((column) => { return { name: column, type: typeof (data[0][column]) } });
          dispatch(Topics.actions.setYFileColumnsInfo(yFileColumnInfo));
        },
        (err) => {
          setYFileLoading(false);
        });
    };
  };

  useEffect(() => {
    localStorage.setItem('yFileData', JSON.stringify(yFileData));
  }, [yFileData])

  const updateModelFile = async (file: File | undefined) => {
    setModelFileLoading(true);
    if (file) {
      getFileDetails(file).then(
        (details) => {
          setModelFile(details.fileURL)
          setModelFileLoading(false);
        },
        (err) => {
          setModelFileLoading(false);
        });
    };
  };

  return (
    <form
      className='form w-100 fv-plugins-bootstrap5 fv-plugins-framework'
      id='kt_create_project_form'
      onSubmit={formik.handleSubmit}
    >
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

        {/* begin::Form group Model File */}
        <div className='fv-row mb-5'>
          <div className='form-label fw-bolder text-dark fs-6'>Training data</div>
          <span>
            {trainingDataLoading ?
              <span className='indicator-progress d-inline'>
                Please wait...
                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
              </span>
              :
              ''
            }
          </span>
          <CSVReader
            accept=".csv"
            cssClass='form-control form-control-lg form-control-solid csv-reader-input'
            onFileLoaded={(data, fileInfo, originalFile) => {
              updateTrainingData(data, fileInfo, originalFile);
            }}
            inputId="uploadDataFile"
            parserOptions={CSVParseOptions}
          />
        </div>
        <div className='fv-row mb-5'>
          <div className='form-label fw-bolder text-dark fs-6'>Y file</div>
          <span>
            {yFileLoading ?
              <span className='indicator-progress d-inline'>
                Please wait...
                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
              </span>
              :
              ''
            }
          </span>
          <CSVReader
            accept=".csv"
            cssClass='form-control form-control-lg form-control-solid csv-reader-input'
            onFileLoaded={(data, fileInfo, originalFile) => {
              updateYFile(data, originalFile);
            }}
            parserOptions={CSVParseOptions}
          />
        </div>
        <div className='fv-row mb-5'>
          <div className='form-label fw-bolder text-dark fs-6'>Model file</div>
          <span>
            {modelFileLoading ?
              <span className='indicator-progress d-inline'>
                Please wait...
                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
              </span>
              :
              ''
            }
          </span>
          <div
            className='form-control form-control-lg form-control-solid csv-reader-input' >
            <input
              accept='.h5,.pkl'
              type="file"
              onChange={(event: any) => updateModelFile(event.target.files[0])}
            />
          </div>
        </div>
      </div>
      <div className="flex-fill d-flex align-items-center justify-content-end">
        <button
          type="submit"
          className="btn btn-primary create-new-model-import-data-button"
          disabled={formik.isSubmitting || !formik.isValid || !modelFile || !yFile || !trainingData} >
          Continue
        </button>
      </div>
    </form>
  )
}

function mapState(state: any) {
  const userId = state.auth.user._id;
  return { userId };
}

export default connect(mapState)(ExplainMyModelForm)