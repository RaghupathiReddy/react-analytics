/* eslint-disable jsx-a11y/anchor-is-valid */
import clsx from 'clsx'
import React, {FC} from 'react'
// import {KTSVG} from '../../../helpers'
import {useLayout} from '../../core'
import {DefaultTitle} from '../header/page-title/DefaultTitle'

const Toolbar1: FC = () => {
  const {classes} = useLayout()

  return (
    <div className='toolbar toolbar-page-header' >
      {/* begin::Container */}
      <div
      >
        <DefaultTitle />

        {/* begin::Actions */}
        <div className='d-flex align-items-center py-1'>
          {/* begin::Wrapper */}
          <div className='me-4'>
            {/* begin::Menu */}
            {/* <a
              href='#'
              className='btn btn-sm btn-flex btn-light btn-active-primary fw-bolder'
              data-kt-menu-trigger='click'
              data-kt-menu-placement='bottom-end'
              data-kt-menu-flip='top-end'
            >
              <KTSVG
                path='/media/icons/duotune/general/gen031.svg'
                className='svg-icon-5 svg-icon-gray-500 me-1'
              />
              Filter
            </a> */}

            {/* end::Menu */}
          </div>
          {/* end::Wrapper */}

          {/* begin::Button */}

          {/* <a
            href='#'
            className='btn btn-sm btn-primary'
            data-bs-toggle='modal'
            data-bs-target='#kt_modal_create_app'
            id='kt_toolbar_primary_button'
          >
            Create
          </a> */}
          {/* end::Button */}
        </div>
        {/* end::Actions */}
      </div>
      {/* end::Container */}
    </div>
  )
}

export {Toolbar1}
