import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { KTSVG } from "../../../_metronic/helpers";
import { stepperConfigs } from "./stepperConfigs";

type HorizontalStepperProps = {
  tabTitle: string;
  stepper: string;
  projectId: string | undefined
};
export const HorizontalStepper: React.FC<HorizontalStepperProps> = ({ tabTitle, stepper, projectId }) => {
  const [projectIdFromStateOrLocal, setProjectIdFromStateOrLocal] = useState<string | null>("")
  const getStepperList = () => {
    if (stepper) {
      var stepperData = stepperConfigs.filter((el) => {
        return el.stepperName === stepper;
      });
      return stepperData;
    }
  };
  const stepperList = getStepperList();

  useEffect(() => {
    const localId = localStorage.getItem("id")
    console.log(localId)
    var newProjectId: string | null;
    if (projectId === null || projectId === undefined || projectId === "") {
      newProjectId = localStorage.getItem("projectId")
    }
    else {
      newProjectId = projectId
    }
    setProjectIdFromStateOrLocal(newProjectId)

  }, [projectId])

  return (
    <div className="stepper stepper-pills d-flex align-items-center align-self-center   flex-center  overflow-scroll ">
      <div className=" d-flex stepper-nav  ">
        {stepperList &&
          stepperList.map((page, i) => (
            <>
              {page.stepperName === stepper ? (
                <>
                  <Link key={i} to={`${page.key}/${projectIdFromStateOrLocal}`}>
                    <div
                      className={`stepper-item ${
                        tabTitle === page.title ? "current" : ""
                      } my-1 `}
                      key={i}
                      data-kt-stepper-element="nav"
                    >
                      {i === 0 ? null : (
                        <div className="stepper-line bg-primary w-30px h-1px"></div>
                      )}

                      <div className="d-flex align-items-center bg-hover-light-primary rounded px-3">
                        <div className="stepper-icon  w-40px h-40px">
                          <i className="stepper-check fas fa-check"></i>
                          <span className="stepper-number">
                            <KTSVG
                              path={page.iconPath}
                              className={`svg-icon-2x  ${
                              tabTitle === page.title
                                ? "svg-icon-primary"
                                : "svg-icon-muted"
                            }`}
                            />
                          </span>
                        </div>

                        <div className="stepper-label">
                          <h3
                            className={`stepper-title ${
                              tabTitle === page.title
                                ? "text-primary"
                                : "text-muted"
                            }  fs-6  `}
                          >
                            {page.title}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </Link>
                </>
              ) : null}
            </>
          ))}
      </div>
      
    </div>
  );
};
