import { useEffect, useState } from "react";
import { connect } from "react-redux";
import DataMapperTable from './DataMapperTable'
import { createProject } from './Actions/ProjectCRUD';
import { IAuthState } from "../../modules/auth";
import { ITopicsState } from "./Redux/ProjectRedux";
import { useNavigate } from 'react-router-dom'
import { routePath } from "../../routing/route-paths";
import { PageTitle } from "../../../_metronic/layout/core";
import Header from "../../components/header";
import YFileValidationTable from "./YFileValidationTable";


const DataMapperPage: React.FC<{ businessTopics: ITopicsState, auth: IAuthState }> = ({ businessTopics, auth }) => {

  const [primaryKey, setPrimaryKey] = useState<string>('');
  const [dependentVariable, setDependentVariable] = useState<string>('');
  const [isYTableSelected, setIsYTableSelected] = useState<boolean>(false);
  const navigate = useNavigate()

  const submitCreateProject = () => {
    const userId = auth.user._id
    const formData = {
      ...businessTopics.newProject,
      userId,
      primaryKey,
      dependentVariable,

    }
    createProject(formData).then((data: any) => {
      navigate(routePath.homePage);
    })
      .catch(() => {
        console.log('Failed to create project')
      });
  };
  const handleYTableSelection = () => {
    setIsYTableSelected(true);
  }
  useEffect(() => {
    if (businessTopics.newProject.columns && businessTopics.newProject.columns.length === 0) {
      navigate('/create-project-form')
    }
  }, []);

  const validateForm = () => {
    if (businessTopics.newProject.projectType === 'Type 2')
      return true;
    else if (primaryKey === "" || dependentVariable === "")
      return false;
    return true;
  }

  return (
    <>
      <PageTitle element={<Header title="Master Data Mapping" backURL={routePath.createProject} />}></PageTitle>
      <hr></hr>
      {businessTopics.newProject.projectType === 'Type 2' ?
        <div className="d-flex flex-row justify-content-between align-items-center">
          <div className="d-flex dflex-row"></div>
          <div
            className="d-flex dlex-row justify-content-right mr-2 input-disabled"
            title={validateForm() ? '' : 'Primary key and dependent variables are required'}
          >
            {isYTableSelected === true ?
              <div className="d-flex flex-row justify-content-between"> <button
                className="btn btn-primary  "
                placeholder="Search"
                onClick={() => submitCreateProject()}
                disabled={validateForm() ? false : true}
              >Save</button>
              </div>
              :
              <div className="d-flex flex-row justify-content-between">
                <button
                  className="btn btn-primary "
                  placeholder="Search"
                  onClick={() => handleYTableSelection()}
                >Next</button>
              </div>
            }
          </div>
        </div>
        :
        <div className="d-flex flex-row justify-content-between align-items-center">
          <div className="d-flex dflex-row"></div>
          <div
            className="d-flex dlex-row justify-content-right mr-2 input-disabled"
            title={validateForm() ? '' : 'Primary key and dependent variables are required'}
          >
            <div className="d-flex flex-row justify-content-between"> <button
              className="btn btn-primary  "
              placeholder="Search"
              onClick={() => submitCreateProject()}
              disabled={validateForm() ? false : true}
            >Save</button></div>
          </div>
        </div>
      }
      <hr></hr>
      <div className="d-flex flex-row h-100">
        <div className="d-flex flex-column p-1 w-100 h-100">
          <div className="d-flex">
            <select id="map_file_select" className="flex-fill m-3">
              <option selected={false}>Existing Meta Files</option>
              <option value="file_1">Resume_Result_map</option>
            </select>
          </div>
          {isYTableSelected ? <YFileValidationTable /> :

            <DataMapperTable
              primaryKey={primaryKey}
              setPrimaryKey={setPrimaryKey}
              dependentVariable={dependentVariable}
              setDependentVariable={setDependentVariable}

              projectType={businessTopics.newProject.projectType}
            >
            </DataMapperTable>
          }
        </div>

      </div>
    </>
  );
};

function mapState(state: any) {
  const { businessTopics, auth } = state;
  return { businessTopics, auth };
}
export default connect(mapState)(DataMapperPage);

