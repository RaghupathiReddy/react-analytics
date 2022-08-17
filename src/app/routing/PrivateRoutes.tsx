import {lazy, FC, Suspense, useState, useEffect} from 'react'
import {Route, Routes, Navigate} from 'react-router-dom'
import MasterLayout from '../../_metronic/layout/MasterLayout'
import TopBarProgress from 'react-topbar-progress-indicator'
import {MenuTestPage} from '../pages/MenuTestPage'
import {getCSSVariableValue} from '../../_metronic/assets/ts/_utils'
import Project from '../pages/projects/Projects'
import FeatureExplainability from '../pages/FeatureExplainability/FeatureExplainability'
import ProjectDetails from '../pages/projects/ProjectDetails'
import CreateProject from '../pages/CreateProject/CreateProject'
import ModelDetails from '../pages/model-details/ModelDetails'
import LocalExplainability from '../pages/local-explainability/LocalExplainability'
import GlobalExplainability from '../pages/GlobalExplainability/GlobalExplainability'
import ModelComparison from '../pages/model-comparison/ModelComparison'
import DataMapperPage from '../pages/CreateProject/DataMapperPage'
import { routePath} from './route-paths'
import BiasIdentification from '../pages/BiasIdentification/BiasIdentification'
import ModelResult from '../pages/ModelResult/ModelResult'
import ModifyBiasParameters from '../pages/ModifyBiasParameters/ModifyBiasParameters'
import ModelOutput from '../pages/ModelOutput/ModelOutput'
import {useLocation} from 'react-router-dom'
import EDA from '../pages/EDA/EDA'
import * as Steppers from "../../app/components/Steppers/redux/HorizontalStepperRedux";
import { stepperConfigs } from "../components/Steppers/stepperConfigs";
import { useDispatch } from 'react-redux'
import DataSummary from '../pages/DataSummary/DataSummary'
import LocalExplainer from '../pages/localExplainer/localExplainer'
import BusinessTreeDummyPage from '../pages/BusinessTree/BusinessTreeDummyPage'
import ExplainMyModel from '../pages/CreateProject/ExplainMyModel'
import GlobalExplainabilityNew from '../pages/GlobalExplainer/GlobalExplainability'
import Placeholder from '../pages/Placeholder/Placeholder'
import YFileValidationTable from '../pages/CreateProject/YFileValidationTable'


const PrivateRoutes = () => {
  const [tabTitle, setTabTitle] = useState<string>('')
  const [projectId, setProjectId] = useState<string>('')

  const AccountPage = lazy(() => import('../modules/accounts/AccountPage'))
  const location = useLocation()
  const dispatch = useDispatch();

  useEffect(() => {
    const currentPage = stepperConfigs.find((item: any) => {
      //item.path.split is removing the params form the link eg /model-details/:modelId so the split will remove :modelId and will have /model-details/
      //location.pathname.includes will check if /model-details/ exist in the pathname
      return location.pathname.includes(item.path.split(':')[0])
    })

    dispatch(Steppers.actions.GetStepperName(currentPage?.stepperName));

    if (currentPage && currentPage.title) {
      setTabTitle(currentPage.title)

      document.title = tabTitle + ' | TuringXai'
    }

    return () => {}
  }, [tabTitle, location])
  return (
    <Routes>
      <Route element={<MasterLayout projectId={projectId} tabTitle={tabTitle} />}>
        {/* Redirect to Dashboard after success login/registartion */}
        <Route path='auth/*' element={<Navigate to='/projects' />} />

        {/* Pages */}
        <Route path={routePath.homePage} element={<Project setProjectId={setProjectId} />} />
        <Route path={routePath.menuTest} element={<MenuTestPage />} />
        <Route path={routePath.projectDetails} element={<ProjectDetails />} />
        <Route path={routePath.createProject} element={<CreateProject />} />
        <Route path={routePath.explainMyModel} element={<ExplainMyModel />} />
        <Route path={routePath.modelDetails} element={<ModelDetails />} />
        <Route path={routePath.localExplainability} element={<LocalExplainability />} />
        <Route path={routePath.featureExplainability} element={<FeatureExplainability />} />
        <Route path={routePath.globalExplainability} element={<GlobalExplainability />} />
        <Route path={routePath.dataMapper} element={<DataMapperPage />} />
        <Route path={routePath.eda} element={<EDA/>} />
        <Route path={routePath.modelComparison} element={<ModelComparison />} />
        <Route path={routePath.results} element={<DataSummary />} />
        <Route path={routePath.localExplainer} element={<LocalExplainer />}/>
        <Route path={routePath.businessTree} element={<BusinessTreeDummyPage/>} />
        <Route path={routePath.yFileValidationTable} element={<YFileValidationTable />} />

        {/* Note : bias Identification is a dummy Page which is not yet implemented. */}

        <Route path={routePath.biasIdentification} element={<BiasIdentification />} />

        {/* Note : Model Result is a dummy Page which is not yet implemented. */}

        <Route path={routePath.modelResult} element={<ModelResult />} />

        {/* Note : modify Bias Parameters is a dummy Page which is not yet implemented. */}

        <Route path={routePath.modifyBiasParameters} element={<ModifyBiasParameters />} />

        {/* Note : model Output is a dummy Page which is not yet implemented. */}

        <Route path={routePath.modelOutput} element={<ModelOutput />} />

        <Route path={routePath.globalExplainer} element={<GlobalExplainabilityNew />} />

        {/*Placeholder Page is dummy */}


        <Route path='/place-holder' element={<Placeholder/>}/>
        <Route
          path='crafted/account/*'
          element={
            <SuspensedView>
              <AccountPage />
            </SuspensedView>
          }
        />

        <Route path={routePath.viewProject} element={<Project setProjectId={setProjectId} />} />
        {/* Page Not Found */}
        <Route path='*' element={<Navigate to='/error/404' />} />
      </Route>
    </Routes>
  )
}

const SuspensedView: FC = ({children}) => {
  const baseColor = getCSSVariableValue('--bs-primary')
  TopBarProgress.config({
    barColors: {
      '0': baseColor,
    },
    barThickness: 1,
    shadowBlur: 5,
  })
  return <Suspense fallback={<TopBarProgress />}>{children}</Suspense>
}

export {PrivateRoutes}