import React, { useEffect, useState } from 'react'
import {useDispatch, connect} from 'react-redux'
import { useParams } from 'react-router-dom';
import { PageTitle } from '../../../_metronic/layout/core';
import { getProjectById } from './redux/ProjectCrud';
import * as project from './redux/ProjectRedux';

const ProjectDetails: React.FC = (props: any) => {
    const [loading,setLoading] = useState(true)
    const dispatch = useDispatch()
    const { projectId } = useParams()
    var pageTitle = 'Loading...'
    // const isFocused = useIsFocused();

    
    useEffect(() => {
        getProjectById(projectId)
        .then(({data}) => {
            dispatch(project.actions.setSelectedProject(data))
            setLoading(false)
        })
        .catch(() => {
            alert('no projects');
        })
    }, [dispatch,projectId])
    if(!loading) pageTitle = `Project Name : ${props.projects.selectedProject.projectDetails.project_name}`
    return (
      <>
        <PageTitle>{pageTitle}</PageTitle>
        {!loading && props.projects.selectedProject.projectDetails && props.projects.selectedProject.projectDetails.project_name}
      </>
    )
};

function mapState(state: any) {
  const { projects, auth } = state;
  return { projects, auth };
}

const actionCreators = {

}

export default connect(mapState, actionCreators)(ProjectDetails);