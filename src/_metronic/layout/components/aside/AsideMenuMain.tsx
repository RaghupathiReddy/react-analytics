/* eslint-disable react/jsx-no-target-blank */
// import React from 'react'
// import {useIntl} from 'react-intl'
// import {KTSVG} from '../../../helpers'
import { AsideMenuItemWithSub } from './AsideMenuItemWithSub'
import { AsideMenuItem } from './AsideMenuItem'
import { routePath } from '../../../../app/routing/route-paths'

export function AsideMenuMain() {
  // const intl = useIntl()

  return (
    <>
      <AsideMenuItem
        to={routePath.homePage}
        icon='/media/icons/turing/home.svg'
        title='Home'
        fontIcon='bi-app-indicator'
      />

      <AsideMenuItem
        to={routePath.viewProject}
        icon='/media/icons/duotune/art/art009.svg'
        title='View Projects'
        fontIcon='bi-app-indicator'
      />

      <AsideMenuItem
        to={routePath.placeholder}
        icon='/media/icons/duotune/art/art007.svg'
        title='PlaceHoder'
        fontIcon='bi-app-indicator'
      />


      {/*COMMENTING THE BELOW CODE AS WE ARE NOT SURE ABOUT HOW THE FLOW SHOULD WORK FOR NOW*/}


      {/*


      <AsideMenuItem
        to={routePath.createProject}
        icon='/media/icons/duotune/art/art005.svg'
        title='Create Project'
        fontIcon='bi-app-indicator'
      ></AsideMenuItem>

      <AsideMenuItem
        to="/results/62863b043f0d7d1c5443a354"
        title='Data Summary'
        icon='/media/icons/duotune/art/art003.svg'
        fontIcon='bi-app-indicator'
      ></AsideMenuItem>

      <AsideMenuItem
        to='/model_details/622719cf784e019fe3a98083'
        icon='/media/icons/duotune/art/art001.svg'
        title='Model Details'
        fontIcon='bi-app-indicator'
      ></AsideMenuItem>

      <AsideMenuItem
        icon='/media/icons/turing/magnifyingGlass.svg'
        to='eda/62863b043f0d7d1c5443a354'
        title='EDA Model'
        fontIcon='bi-app-indicator'
      ></AsideMenuItem>

      <AsideMenuItem
        icon='/media/icons/duotune/art/art006.svg'
        to='model_comparison/62863b043f0d7d1c5443a354'
        title='Model Comparison'
        fontIcon='bi-app-indicator'
      ></AsideMenuItem>
*/}

      {/*
      <AsideMenuItemWithSub
        to='#'
        title='Explainability'
        fontIcon='bi-archive'
        icon='/media/icons/duotune/general/gen022.svg'
      >
        <AsideMenuItem
          to='/feature-explainability/62a31b74d469688069d7e705'
          title='Feature Explainability'
          hasBullet={true}
        ></AsideMenuItem>

         <AsideMenuItem
          to='/bias-identification/62863b043f0d7d1c5443a354'
          title='Bias Identification'
          hasBullet={true}
        ></AsideMenuItem>



        <AsideMenuItem
          to='/model-results/62863b043f0d7d1c5443a354'
          title='Model Results'
          hasBullet={true}
        ></AsideMenuItem>


      </AsideMenuItemWithSub>

      <AsideMenuItemWithSub
        to='#'
        title='Phase 2'
        fontIcon='bi-archive'
        icon='/media/icons/duotune/general/gen022.svg'
      >
       Note : biasIdentification is a dummy Page which is not yet implemented.


        <AsideMenuItem
          to='global-expainability-old/622f7b8ecb4e5b3a35a5a31e'
          title='Global Explainability'
          hasBullet={true}
        ></AsideMenuItem>

        <AsideMenuItem
          to='local_explainability/622719cf784e019fe3a98083'
          title='Local Explainability'
          hasBullet={true}
        ></AsideMenuItem>

        {/* Note : modifyBiasParameters is a dummy Page which is not yet implemented. */}
      {/*
        <AsideMenuItem
          to={routePath.modifyBiasParameters}
          hasBullet={true}
          title='Modify Bias Parameters'
        ></AsideMenuItem>

        {/* Note : modelOutput is a dummy Page which is not yet implemented.
        <AsideMenuItem
          to={routePath.modelOutput}
          hasBullet={true}
          title='Model Result based on Selected Bias'
        ></AsideMenuItem>
      </AsideMenuItemWithSub>
       */}


    </>
  )
}