/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {FC, useState} from 'react'
import {Link} from 'react-router-dom'
import clsx from 'clsx'
import {useLayout} from '../../core'
import {KTSVG, toAbsoluteUrl} from '../../../helpers'
import {AsideMenu} from './AsideMenu'
import { ImagePath } from '../../../../config'
import { routePath } from '../../../../app/routing/route-paths'
import Highcharts from 'highcharts'

const AsideDefault: FC = () => {
  const {config, classes} = useLayout()
  const [isMinimized, setIsMinimized] = useState(true)
  const {aside} = config

  const responsivelyResizeGraph = () => {
    Highcharts.charts.forEach(function(chart) {
      if(chart)
        setTimeout( () => chart.reflow(),200);
    })
  }
 
  const handleSideBarChange = () => {
    setIsMinimized(!isMinimized)
    responsivelyResizeGraph()
  }

  return (
    <div
      id='kt_aside'
      className={clsx('aside', classes.aside.join(' '))}
      data-kt-drawer='true'
      data-kt-drawer-name='aside'
      data-kt-drawer-activate='{default: true, lg: false}'
      data-kt-drawer-overlay='true'
      data-kt-drawer-width="{default:'200px', '300px': '250px'}"
      data-kt-drawer-direction='start'
      data-kt-drawer-toggle='#kt_aside_mobile_toggle'
    >
      {/* begin::Brand */}
      <div className='aside-logo flex-column-auto' id='kt_aside_logo'>
        {/* begin::Logo */}
        {aside.theme === 'dark' && (
          <Link to={routePath.homePage}>
            <img alt='Logo' className='w-80px pt-1 logo' src={toAbsoluteUrl(ImagePath.logo)} />
          </Link>
        )}
        {aside.theme === 'light' && (
          <Link to={routePath.homePage}>
            <img alt='Logo' className='w-80px pt-1 logo' src={toAbsoluteUrl(ImagePath.logo)} />
          </Link>
        )}
        {/* end::Logo */}

        {/* begin::Aside toggler */}
        {aside.minimize && (
          <button
            id='kt_aside_toggle'
            type="button"
            className='btn btn-icon w-auto px-0 btn-active-color-primary aside-toggle'
            data-kt-toggle='true'
            data-kt-toggle-state='active'
            data-kt-toggle-target='body'
            data-kt-toggle-name='aside-minimize'
            onClick={handleSideBarChange}
            data-toggle="tooltip" 
            data-placement="right" 
            title={isMinimized ? 'Lock Sidebar Open' : 'Close Sidebar'}
          >
            {isMinimized ? 
              <KTSVG
                path={'/media/icons/turing/sidebarOpen.svg'}
                className={'svg-icon-2x'}
              /> : 
              <KTSVG
                path={'/media/icons/turing/sidebarClose.svg'}
                className={'svg-icon-2x'}
              />
            }

          </button>
        )}
        {/* end::Aside toggler */}
      </div>
      {/* end::Brand */}

      {/* begin::Aside menu */}
      <div className='aside-menu flex-column-fluid'>
        <AsideMenu asideMenuCSSClasses={classes.asideMenu} />
      </div>
      {/* end::Aside menu */}

      {/* begin::Footer */}
      {/* <div className='aside-footer flex-column-auto pt-5 pb-7 px-5' id='kt_aside_footer'>
        <a
          target='_blank'
          className='btn btn-custom btn-primary w-100'
          href={process.env.REACT_APP_PREVIEW_DOCS_URL}
          data-bs-toggle='tooltip'
          data-bs-trigger='hover'
          data-bs-dismiss-='click'
          title='Check out the complete documentation with over 100 components'
        >
          <span className='btn-label'>Docs & Components</span>
          <span className='svg-icon btn-icon svg-icon-2'>
            <KTSVG path='/media/icons/duotune/general/gen005.svg' />
          </span>
        </a>
      </div> */}
      {/* end::Footer */}
    </div>
  )
}

export {AsideDefault}