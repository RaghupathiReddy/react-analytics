import { FC, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { AsideDefault } from "./components/aside/AsideDefault";
import { Footer } from "./components/Footer";
import { HeaderWrapper } from "./components/header/HeaderWrapper";
import { Toolbar } from "./components/toolbar/Toolbar";
// import {RightToolbar} from '../partials/layout/RightToolbar'
import { ScrollTop } from "./components/ScrollTop";
import { Content } from "./components/Content";
import { PageDataProvider } from "./core";
import { useLocation } from "react-router-dom";
import { MenuComponent } from "../assets/ts/components";
import { connect } from "react-redux";
import ProgressIndicator, {
  ProgressIndicatorProps,
} from "./components/toolbar/ProgressIndicator";
import ToastMessages from "../../app/components/toastMessages";
import clsx from "clsx";
import { KTSVG  } from "../helpers";

const MasterLayout: FC<ProgressIndicatorProps> = ({
  horizontalStepper,
  tabTitle,
  projectId,
}) => {

  const [isHeaderShown,setIsHeaderShown] = useState(true)

  const location = useLocation();
  useEffect(() => {
    setTimeout(() => {
      MenuComponent.reinitialization();
    }, 500);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      MenuComponent.reinitialization();
    }, 500);
  }, [location.key]);

  const StepperName = horizontalStepper.stepperName;

  return (
    <PageDataProvider>
      <div className="page d-flex flex-row flex-column-fluid">
        <AsideDefault />
        <div
          className={clsx(
            'wrapper d-flex flex-column flex-row-fluid',
            {'pt-5': !isHeaderShown}
          )}
          id="kt_wrapper"
        >
          <span
            onClick={() => { setIsHeaderShown(!isHeaderShown) }}
            data-kt-button="true"
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            className={'z-index-1 position-fixed end-0 p-0 opacity-75 btn btn-outline btn-outline-dashed'}
            title={isHeaderShown ? "Close" : "Expand"}>
            {isHeaderShown ? (<KTSVG path="\media\icons\turing\collapse.svg" className="svg-icon-3x m-0"></KTSVG>):(<KTSVG path="\media\icons\turing\expand.svg" className="svg-icon-3x m-0"></KTSVG>)}
          </span>
          {isHeaderShown && <>
            <HeaderWrapper />
            {StepperName ? <ProgressIndicator projectId={projectId} tabTitle={tabTitle} /> : <Toolbar />}
          </>}
          <div
            id="kt_content"
            className="content d-flex flex-column flex-column-fluid"
          >
            <div className="post d-flex flex-column-fluid" id="kt_post">
              <Content>
                <ToastMessages />
                <Outlet />
              </Content>
            </div>
          </div>
          <Footer />
        </div>
      </div>

      <ScrollTop />
    </PageDataProvider>
  );
};

function mapState(state: any) {
  const { horizontalStepper } = state;
  return { horizontalStepper };
}

export default connect(mapState)(MasterLayout);
