import { Action } from "@reduxjs/toolkit";

export interface ActionWithPayload<Type> extends Action {
  payload: Type;
}
export const actionTypes = {
  GetStepperName: "[GetStepperName] Action",
};

const initialFEState: IStepperState = {
  stepperName: "ProjectStepper",
};

export interface IStepperState {
  stepperName: string;
}

export const StepperReducer = (
  state: IStepperState = initialFEState,
  action: ActionWithPayload<IStepperState>
) => {
  switch (action.type) {
    case actionTypes.GetStepperName: {
      const stepperName = action.payload.stepperName;

      return {
        ...state,
        stepperName: stepperName,
      };
    }
    default:
      return state;
  }
};

export const actions = {
  GetStepperName: (stepper: string | undefined) => ({
    type: actionTypes.GetStepperName,
    payload: {
      stepperName: stepper,
    },
  }),
};
