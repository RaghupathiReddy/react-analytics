import { FC } from "react";
import { connect } from "react-redux";
import { HorizontalStepper } from "../../../../app/components/Steppers/HorizontalStepper";

export type ProgressIndicatorProps = {
  horizontalStepper: {
    stepperName: string;
  };
  tabTitle:string
  projectId?: string
};

export type Stepper = {
  path: string;
  title: string;
  stepperName?: string;
  key?: string;
  iconPath?: string;
};
const ProgressIndicator: FC<ProgressIndicatorProps> = ({
  horizontalStepper, tabTitle, projectId
}) => {
  
  const { stepperName } = horizontalStepper;
  if (stepperName) {
    return (
      <div className="toolbar toolbar-page-header h-auto">
        <HorizontalStepper projectId={projectId} tabTitle={tabTitle} stepper={stepperName} />
      </div>
    );
  } else {
    return (
      <div className="toolbar p-3 toolbar-page-header h-auto">
        <h1>{tabTitle}</h1>
      </div>
    );
  }
};

function mapState(state: any) {
  const { horizontalStepper } = state;
  return { horizontalStepper };
}

export default connect(mapState)(ProgressIndicator);
