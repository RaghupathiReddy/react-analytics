import {all} from 'redux-saga/effects'
import {combineReducers} from 'redux'

import * as auth from '../../app/modules/auth'
import * as project from '../../app/pages/projects/redux/ProjectRedux'
import * as localExplainabilityRed from '../../app/pages/local-explainability/redux/LocalExplainabilityRedux'
import * as notification from '../../_metronic/partials/layout/header-menus/NotificationStore/NotificationRedux'
import * as ModelComparison from '../../app/pages/model-comparison/redux/ModelComparisonRedux'
import * as geData from '../../app/pages/GlobalExplainability/redux/GlobalExpRedux'
import * as BusinessTopics from '../../app/pages/CreateProject/Redux/ProjectRedux'
import * as  EDA  from '../../app/pages/EDA/redux/EDARedux'
import * as BiasFeature from "../../app/pages/BiasIdentification/redux/BiasFeatureRedux";
import * as modelResults from "../../app/pages/ModelResult/redux/ModelResultsRedux";
import * as feData from '../../app/pages/FeatureExplainability/redux/FeatureExplainabilityRedux'
import * as StepperType from "../../app/components/Steppers/redux/HorizontalStepperRedux";
import * as DataSummary from "../../app/pages/DataSummary/redux/DataSummaryRedux";
import * as LocalExplainer from '../../app/pages/localExplainer/redux/LocalExplainerRedux';
import * as BusinessTree from '../../app/pages/BusinessTree/redux/BusinessTreeRedux';

export const rootReducer = combineReducers({
  auth: auth.reducer,
  projects: project.ProjectReducer,
  globalExplainability: geData.GEReducer,
  businessTopics: BusinessTopics.BusinessTopicReducer,
  localExplainability: localExplainabilityRed.LocalExplainabilityReducer,
  notification: notification.NotificationReducer,
  eda: EDA.EDAReducer,
  modelResultData: modelResults.ModelResultReducer,
  modelComparison: ModelComparison.ModelComparisonReducer,
  featureExplainability: feData.FEReducer,
  biasFeatureData: BiasFeature.BiasFeatureReducer,
  horizontalStepper: StepperType.StepperReducer,
  dataSummary: DataSummary.DataSummaryReducer,
  localExplainer : LocalExplainer.LocalExplainerReducer,
  businessTree: BusinessTree.BusinessTreeReducer
});



export type RootState = ReturnType<typeof rootReducer>

export function* rootSaga() {
  yield all([auth.saga()])
}
