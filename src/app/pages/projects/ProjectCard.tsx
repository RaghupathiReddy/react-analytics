import { FC, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Moment from "moment";
import { getProjectRunStatusById } from "./redux/ProjectCrud";
import { connect, useDispatch } from "react-redux";
import * as project from "./redux/ProjectRedux";
import {
  stepperConfigs,
  UATIDs,
} from "../../components/Steppers/stepperConfigs";

type Props = {
  projectName: string;
  projectDescription: string;
  projectCreatedDate: Date;
  user: string;
  isRunComplete: boolean;
  projectStatus?: string;
  id: string;
  projects: project.IProjectState;
  setProjectId: any
  
};

const ProjectCard: FC<Props> = ({
  projectName,
  projectDescription,
  projectCreatedDate,
  isRunComplete,
  id,
  user,
  projects,
  projectStatus,
  setProjectId
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();



  const runModelResults = (id: string) => {
    navigate(`${"/global_expainability/" + id}`);
    //UATIDs.localGlobalId will be replaced by the project id after we click on the project card
    // this is the example for the future code ===>
    // navigate(`${'/global_expainability/' + id}`)
    // ^ the above code is tested and works
  };

  const handleIdStorage = (id: string) => {
    setProjectId(id)
    localStorage.setItem("projectId", id);
  }
  return (
    <>
      <div
        className={`card border border-2 h-100 position-relative border-gray-300 border-hover ${
          isRunComplete ? "pe-auto" : "pe-none"
        }`}
        onClick={() => handleIdStorage(id)}
      >
        <Link
          to={`${isRunComplete ? `/results/` + id : "#"}`}
          className={` h-100 ${isRunComplete ? "pe-auto" : "pe-none"}`}
        >
          <div className="card-header border-0 min-h-50px d-flex justify-content-between align-items-center align-self-between align-content-center">
            <div className="card-title m-0 ">
              <div className="fs-3 fw-bolder text-dark">{projectName}</div>
            </div>
            <div className="card-title m-0 ">
              <div className="fs-3 fw-bolder text-dark">
                {isRunComplete ? null : (
                  <div className="d-flex justify-content-between align-items-center align-self-between align-content-center">
                    {/*@todo add icon here based on projectStatus */}

                    <span
                      className=" btn btn-sm alert-primary "
                      data-kt-indicator="on"
                    >
                      Processing...
                      <span className="indicator-progress">
                        <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                      </span>
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div
            className="h-4px w-100 bg-light mb-5"
            data-bs-toggle="tooltip"
            title="This project completed"
          ></div>

          <div className="card-body">
            <div className="d-flex mb-5">
              <div className="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-7 mb-3 w-50">
                <div className="fs-6 text-gray-800">JD/Profile</div>
                <div className="text-gray-400">All profiles</div>
              </div>

              <div className="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 mb-3 w-50">
                <div className="fs-6 text-gray-800">Features</div>
                <div className="text-gray-400">1021</div>
              </div>
            </div>

            <div className="d-flex">
              <div className="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-7 mb-3 w-50">
                <div className="fs-6 text-gray-800"># of Bias removed</div>
                <div className="text-gray-400">80</div>
              </div>

              <div className="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 mb-3 w-50">
                <div className="fs-6 text-gray-800">Resume with Change</div>
                <div className="text-gray-400">22</div>
              </div>
            </div>
          </div>
          <div
            className="h-4px w-100 bg-light"
            data-bs-toggle="tooltip"
            title="This project completed"
          ></div>
          <div className="d-flex flex-row m-5">
            <div className="d-flex flex-column w-50">
              <div className="fs-8 text-dark">Created on:</div>
              <div className="text-dark fs-8">
                {Moment(projectCreatedDate).format("DD-MM-YYYY hh:mm:ss")}
              </div>
            </div>
            <div className="d-flex flex-column align-items-end w-50">
              <div className="fs-8 text-dark">Created by:</div>
              <div className="text-dark fs-8">{user}</div>
            </div>
          </div>
        </Link>
        <div className="d-flex justify-content-between align-items-center align-self-between align-content-center m-2">
          <button
            className={`btn m-1 fs-8 mt-0 ${
              isRunComplete ? "btn-primary" : "btn-secondary"
            }`}
            disabled={!isRunComplete}
          >
            Production run
          </button>
          <button
            onClick={() => runModelResults(id)}
            className={`btn m-1 fs-8 mt-0 ${
              isRunComplete ? "btn-primary" : "btn-secondary"
            }`}
            disabled={!isRunComplete}
          >
            View model results
          </button>
          <button
            className={`btn m-1 fs-8 mt-0 ${
              isRunComplete ? "btn-primary" : "btn-secondary"
            }`}
            disabled={!isRunComplete}
          >
            Placeholder
          </button>
        </div>
      </div>
    </>
  );
};

function mapState(state: any) {
  const { projects } = state;
  return { projects };
}

export default connect(mapState)(ProjectCard);
