import { useState } from 'react';
import { PageTitle } from '../../../_metronic/layout/core';
import Header from '../../components/header';
import ExplainMyModelForm from './ExplainMyModelForm';

const ExplainMyModel: React.FC<{}> = ({}) => {

    const [pageHeading, setPageHeading] = useState<string>('Create New Project - Explain my model');
  
    return (
        <>
            <PageTitle element={<Header title={pageHeading} > 
            </Header>} />
            <ExplainMyModelForm></ExplainMyModelForm>
        </>
    )
};

export default ExplainMyModel;
