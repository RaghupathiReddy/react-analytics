/* eslint-disable jsx-a11y/anchor-is-valid */
import {Route, Link, Routes, Outlet} from 'react-router-dom'
import {Error500} from './components/Error500'
import {Error404} from './components/Error404'

const PANGEA_WEBSITE_URL = process.env.REACT_APP_PANGEA_WEBSITE_URL

const ErrorsLayout = () => {
  return (
    <div className='d-flex flex-column flex-root'>
      <div
        className='d-flex flex-column flex-column-fluid'>
        <div className='d-flex flex-column flex-column-fluid text-center p-10 py-lg-20'>
          <div className='pt-lg-10 mb-10'>
            <Outlet />
            <div>
              <Link to='/' className='btn btn-lg btn-primary fw-bolder'>
                Go to homepage
              </Link>
            </div>
          </div>
        </div>

        <div className='d-flex flex-center flex-column-auto p-10'>
          <div className='d-flex align-items-center fw-bold fs-6'>
            <a href={PANGEA_WEBSITE_URL} className='text-muted text-hover-primary px-2'>
              About
            </a>
            <a href={PANGEA_WEBSITE_URL} className='text-muted text-hover-primary px-2'>
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export type IErrorsPage = {
  message ?: string
}

const ErrorsPage = (props:IErrorsPage) => (
  <Routes>
    <Route element={<ErrorsLayout />}>
      <Route path='404' element={<Error404 message={props.message}/>} />
      <Route path='500' element={<Error500 />} />
      <Route index element={<Error404 message={props.message}/>} />
    </Route>
  </Routes>
)

export {ErrorsPage}

ErrorsPage.defaultProps = {
  message:"Page Not Found"
}