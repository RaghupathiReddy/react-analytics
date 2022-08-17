export const routePath = {
  homePage: '/projects',
  createProject: '/create-project-form',
  globalExplainability: '/global-expainability-old/:recordId',
  localExplainability: '/local_explainability/:modelId',
  modelDetails: '/model_details/:modelId',
  projectDetails: '/project/:projectId',
  featureExplainability: '/feature-explainability/:projectId',
  modelComparison: '/model_comparison/:projectId',
  results: '/results/:projectId',
  menuTest: '/menu-test',
  dataMapper: '/data-mapper',
  biasIdentification: '/bias-identification/:projectId',
  modelResult: '/model-results/:projectId',
  modifyBiasParameters: '/modify-bias-parameter',
  modelOutput: '/model-output',
  eda : '/eda/:projectId',
  localExplainer : '/localExplainer/:projectId',
  businessTree : '/business_tree/:projectId',
  explainMyModel: '/explain-my-model',
  globalExplainer: '/global_expainability/:projectId',
  placeholder: "/place-holder",
  viewProject: '/view-projects',
  yFileValidationTable: '/y-file-validation',
}

export const pageNames = [
  {
    path: routePath.homePage,
    title: 'Projects',
  },
  {
    path: routePath.createProject,
    title: 'Create Project',
  },
  {
    path: routePath.explainMyModel,
    title: 'Explain Model',
  },
  {
    path: routePath.placeholder,
    title: 'Placeholder',
  },
  {
    path: routePath.yFileValidationTable,
    title: 'Y File Table',
  },
  {
    path: routePath.globalExplainability,
    title: 'Global Explainability',
  },
  {
    path: routePath.localExplainer,
    title: 'Local Explainability',
  },
  {
    path: routePath.modelDetails,
    title: 'Model Detail',
  },
  {
    path: routePath.featureExplainability,
    title: 'Feature Explainability',
  },
  {
    path: routePath.projectDetails,
    title: 'Project Details',
  },
  {
    path: routePath.eda,
    title: 'EDA',
  },
  {
    path: routePath.modelComparison,
    title: 'Model Comparison',
  },
  {
    path: routePath.results,
    title: 'Data Summary',
  },
  {
    path: routePath.biasIdentification,
    title: 'Bias Identification',
  },
  {
    path: routePath.modelResult,
    title: 'Model Result',
  },
  {
    path: routePath.modifyBiasParameters,
    title: 'Modify Bias',
  },
  {
    path: routePath.modelOutput,
    title: 'Model Output',
  },
  {
    path: routePath.globalExplainer,
    title: 'Global Explainability',
  },
  {
    path: routePath.businessTree,
    title: "Business Tree",
  }
 
]