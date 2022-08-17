import React, { useState, useEffect } from "react";
import { useDispatch, connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PageTitle } from "../../../_metronic/layout/core";
import Header from "../../components/header";
import { IAuthState } from "../../modules/auth";
import { getAllProjects } from "./redux/ProjectCrud";
import * as project from "./redux/ProjectRedux";
import * as notifications from "../../../_metronic/partials/layout/header-menus/NotificationStore/NotificationRedux";
import { IProjectState } from "./redux/ProjectRedux";
import { IProject } from "./models/ProjectModel";
import ProjectCard from "./ProjectCard";
import { routePath } from "../../routing/route-paths";
import { checkForNewNotifications } from "../../../_metronic/partials/layout/header-menus/NotificationCRUD";
import { NOTIFICATION_REFRESH_TIME } from "../../../../src/config";
import { toast } from "react-toastify";
import { NotificationModel } from "../../Models/NotificationModel";
import Modal from 'react-bootstrap/Modal';
import ExplainMyModelForm from "../CreateProject/ExplainMyModelForm";

const Project: React.FC<{ auth: IAuthState; projects: IProjectState,setProjectId :any}> = ({
  auth,
  projects,
  setProjectId
}) => {
  const [loading, setLoading] = useState(true);
  const [shouldShowPopup, setShouldShowPopup] = useState(false)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = auth.user;

  useEffect(() => {
    if (user._id) {
      getAllProjects(user._id)
        .then(({ data }) => {
          dispatch(project.actions.getAllProjects(data));
          setLoading(false);
        })
        .catch((err) => {
          alert("No projects to display!");
        });
    }
  }, [user._id, dispatch]);

  // Poll notification api for any new updates and notify the user via bell count and toast message
  let oldNotifications: Array<any> = [];
  useEffect(() => {
    const listenNotifications = setInterval(() => {
      checkForNewNotifications(user._id)
        .then(({ data }) => {
          // Filter out duplicate notifications
          let newNotifications = data.filter(
            (notification: any) =>
              oldNotifications.indexOf(notification.notificationId) === -1
          );
          // console.log("oldNotifications: " + oldNotifications);
          // console.log("new notifications: ", newNotifications);
          if (newNotifications.length > 0) {
            dispatch(notifications.actions.addNotifications(newNotifications));

            newNotifications.forEach((notification: NotificationModel) => {
              toast(notification.message); //show a toast message
              oldNotifications.push(notification.notificationId); //keep track of old notifications
              dispatch(project.actions.setProjectRunStatus(notification));
            });
          }
        })
        .catch((err) => {
          console.log("Error fetching notifications: " + err);
        });
    }, NOTIFICATION_REFRESH_TIME);

    return () => clearInterval(listenNotifications);
  }, [user._id, dispatch]);

  const navigateToCreateProject = () => {
    navigate(routePath.createProject);
  };

  const handlePopupOpen = () => {
    setShouldShowPopup(true);
  }

  const handlePopupClose = () => {
    setShouldShowPopup(false);
  }

  return (
    <>
      <PageTitle element={<Header title="TuringXai" />} />
      <div className="card  d-flex flex-row flex-row-fluid h-250px ">
        <div className="card-body m-2">
          <div className="h-50px m-2 mx-auto">
            <h1>
              Welcome{" "}
              <span className="text-capitalize">{auth.user.firstName}</span>
            </h1>
          </div>
          <div>
            <h5 className="h-60px text-muted">
              This is your home to all your projects and key notifications
            </h5>
          </div>
          <div className="h-40px">
            <button
              className="btn btn-lg btn-primary m-2"
              onClick={() => navigateToCreateProject()}
            >
              Get Started. Create a new project(Explain my data)
            </button>
            <button
              className="btn btn-lg btn-primary m-2"
              onClick={handlePopupOpen}
            >
              Explain my model
            </button>
            <div className="container w-500px p-5 rounded-3 bg-white mt-2">
              <Modal show={shouldShowPopup} onHide={handlePopupClose}>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                  <ExplainMyModelForm />
                </Modal.Body>
              </Modal>
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex flex-row flex-wrap">
        {projects &&
          projects.allProjects.map((project: IProject) => {
            return (
              <div className="me-2 mt-2">
                <ProjectCard
                  key={project.projectId}
                  id={project.projectId}
                  projectName={project.projectName}
                  isRunComplete={project.isRunComplete}
                  projectStatus={project.projectStatus}
                  projectDescription={project.projectDescription}
                  projectCreatedDate={project.projectCreatedDate}
                  user={auth.user.firstName}
                  setProjectId={setProjectId}
                ></ProjectCard>
              </div>
            );
          })}
      </div>

    </>
  );
};

function mapState(state: any) {
  const { projects, auth } = state;
  return { projects, auth };
}

const actionCreators = {
  //   getAllTopics: apiActions.getAllTopics,
  //   selectTopic: apiActions.selectTopic
};

export default connect(mapState, actionCreators)(Project);
