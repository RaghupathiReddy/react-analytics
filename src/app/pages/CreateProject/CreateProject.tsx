import { useEffect, useState } from 'react';
import {useDispatch, connect} from 'react-redux'
import {Accordion} from 'react-bootstrap'
import { getAllBusinessTopics } from './Actions/ProjectCRUD';
import * as Topics from './Redux/ProjectRedux';
import NewProject from './NewProject';
import { PageTitle } from '../../../_metronic/layout/core';
import Header from '../../components/header';

const CreateProject: React.FC<{businessTopics: Topics.ITopicsState}> = ({businessTopics}) => {
    const dispatch = useDispatch()

    const [pageHeading, setPageHeading] = useState<string>('Create New Project');

    useEffect(() => {
      getAllBusinessTopics().then(({data}) => {
        dispatch(Topics.actions.getAllTopics(data))
      })
      .catch(() => {
        alert('no projects');
      })
    }, [dispatch]);

    const selectTopic = (subtopic: Topics.IChildTopicState) => {
      setPageHeading('Upload Data')
      dispatch(Topics.actions.setSelectedTopic(subtopic))
    }
  
    return (
      <>
            <PageTitle element={<Header title={pageHeading} > 
      </Header>} />
        <div className="d-flex flex-row">
          <div className="flex-fill">
            <Accordion className="w-100">
              {businessTopics && businessTopics.topics.map((topic, index) => 
                <Accordion.Item className='scroll mh-300px' eventKey={index.toString()} key={index}>
                  <Accordion.Header><span className="text-uppercase">{topic.title}</span> - <span className="text-truncate">{topic.description}</span></Accordion.Header>
                  {topic.children && topic.children.map((subtopic, index) =>
                    <Accordion.Body> 
                      <div className="card use_case_body" onClick={() => selectTopic(subtopic)}>
                        {subtopic.name}
                      </div>
                    </Accordion.Body>
                  )}
                </Accordion.Item>
              )}
            </Accordion>
          </div>
          {businessTopics.selectedTopic && businessTopics.selectedTopic.name != '' && 
            <div className="d-flex flex-column create-new-model-block">
              <NewProject></NewProject>
            </div>
          }
        </div>
      </>
    )
};

function mapState(state: any) {
  const { businessTopics } = state;
  return { businessTopics }
};

export default connect(mapState)(CreateProject)
