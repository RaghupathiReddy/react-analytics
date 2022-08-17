import { routePath } from "../../routing/route-paths";

export const UATIDs = {
  modelDetailId: "622719cf784e019fe3a98083",
  featureExplainabilityId: "62a31b74d469688069d7e705",
  localGlobalId: "62cd4cb531896d4909e2b2df"
};
export const stepperConfigs = [
  {
    path: routePath.results,
    title: "Data Summary",
    stepperName: "modelStepper",
    key: "/results",
    iconPath: "/media/icons/duotune/technology/teh001.svg",
  },
  {
    path: routePath.modelDetails,
    title: "Model Detail",
    key: "/model_details",
    stepperName: "modelStepper",
    iconPath: "/media/icons/duotune/technology/teh002.svg",
  },
  {
    path: routePath.eda,
    title: "EDA",
    key: "/eda",
    iconPath: "/media/icons/duotune/technology/teh003.svg",
    stepperName: "modelStepper",
  },
  {
    path: routePath.modelComparison,
    title: "Model Comparison",
    key: "/model_comparison",
    iconPath: "/media/icons/duotune/technology/teh004.svg",
    stepperName: "modelStepper",
  },
  {
    path: routePath.featureExplainability,
    title: "Feature Explainability",
    key: "/feature-explainability",
    iconPath: "/media/icons/duotune/technology/teh005.svg",
    stepperName: "modelStepper",
  },
  {
    path: "#",
    title: "Explainability",
    key: '/global_expainability',
    iconPath: "/media/icons/duotune/technology/teh006.svg",
    stepperName: "modelStepper",
  },
 
  
  {
    path: routePath.createProject,
    title: "Create Project",
    key: routePath.createProject,
    iconPath: "/media/icons/duotune/technology/teh007.svg",
    stepperName: "ProjectStepper",
  },
  {
    path: routePath.dataMapper,
    title: "Data Mapper",
    key: "#",
    iconPath: "/media/icons/duotune/technology/teh008.svg",
    stepperName: "ProjectStepper",
  },
  {
    path: routePath.explainMyModel,
    title: "Create Project",
    key: routePath.explainMyModel,
    iconPath: "/media/icons/duotune/technology/teh009.svg",
    stepperName: "ExplainMyModelStepper",
  },
  {
    path: routePath.placeholder,
    title: "Placeholder",
    key: routePath.placeholder,
    iconPath: "/media/icons/duotune/technology/teh010.svg",
    stepperName: "ExplainMyModelStepper",
  },
  {
    path: routePath.homePage,
    title: "Projects",
  },

  {
    path: routePath.projectDetails,
    title: "Project Details",
  },
  {
    path: routePath.modifyBiasParameters,
    title: "Modify Bias",
  },
  {
    path: routePath.modelOutput,
    title: "Model Output",
  },
  {
    path: routePath.globalExplainability,
    title: "Global Explainability Old",
  },
  {
    key: '/global_expainability',
    iconPath: "/media/icons/duotune/technology/teh002.svg",
    path: routePath.globalExplainer,
    title: "Global Explainability",
    stepperName: "ExplainabilityStepper"
  },
  {
    path: routePath.businessTree,
    title: "Business Tree",
    key: "/business_tree",
    iconPath: "/media/icons/duotune/technology/teh009.svg",
    stepperName: "ExplainabilityStepper",
  },
  {
    path: routePath.localExplainer,
    key: "/localExplainer",
    title: "Local Explainability",
    iconPath: "/media/icons/duotune/technology/teh007.svg",
    stepperName: "ExplainabilityStepper",
  },
  {
    path: "#",
    title: "Results",
    key: "/bias-identification",
    iconPath: "/media/icons/duotune/technology/teh006.svg",
    stepperName: "ExplainabilityStepper",
  },
  {
    path: routePath.biasIdentification,
    title: "Bias Identification",
    key: "/bias-identification",
    iconPath: "/media/icons/duotune/technology/teh006.svg",
    stepperName: "ResultStepper",
  },
  {
    path: routePath.modelResult,
    title: "Model Result",
    key: "/model-results",
    iconPath: "/media/icons/duotune/technology/teh007.svg",
    stepperName: "ResultStepper",
  },


];
