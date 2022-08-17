/* eslint-disable jsx-a11y/anchor-is-valid */
import {useEffect} from 'react'
import {Outlet, Route, Routes} from 'react-router-dom'
import {Registration} from './components/Registration'
import {ForgotPassword} from './components/ForgotPassword'
import {Login} from './components/Login'
import {ResetPassword} from './components/ResetPassword'

const PANGEA_WEBSITE_URL = process.env.REACT_APP_PANGEA_WEBSITE_URL

const AuthLayout = () => {
  useEffect(() => {
    document.body.classList.add('bg-white')
    return () => {
      document.body.classList.remove('bg-white')
    }
  }, [])
  return (
    <>
      <div className=''>
        <div className='d-flex mt-5'>
          <div>
            <img className="w-100px" src='/media/logos/turingxai-logo-01.png' alt='TuringXai logo'/>
          </div>
          {/* begin::Content */}
          <div className="turingxai-logo d-flex flex-center flex-grow-1 h-80px">
            <img className="h-80px" src='/media/logos/turingxai-logo-final.jpg' alt='TuringXai logo'/>
          </div>
        </div>
        <div className="d-flex flex-row-fluid">
          <div className='d-flex flex-center flex-column flex-column-fluid p-10 pt-0 pb-lg-20 w-50 mt-20'>
            <div className='text-center'>
              <p className='fw-bold ls-1'>  
                TuringXai is an end-to-end platform that provides explainability in AI decisions, 
                identifies and removes cognitive biases and enables transparent and accurate 
                decision-making in support of the company’s vision.
              </p>
            </div>
            <div className="mt-6 mw-900px">
              <img className="w-100 h-100" src='/media/logos/turingxai-login-image.jpg' alt='branding-content' />
            </div>
          </div>
          <div className='d-flex flex-center flex-column flex-column-fluid p-10 pt-10 pb-lg-20'>
            {/* begin::Wrapper */}
            <div className='w-lg-500px bg-white rounded shadow-sm p-10 p-lg-15 mx-auto'>
              <Outlet />
            </div>
            {/* end::Wrapper */}
          </div>
        </div>
        {/* end::Content */}
      </div>
      {/* begin::Footer */}
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
      {/* end::Footer */}
    </>
  )
}

const AuthLayoutCenter = () => {
  useEffect(() => {
    document.body.classList.add('bg-white')
    return () => {
      document.body.classList.remove('bg-white')
    }
  }, [])
  return (
    <div
      className='d-flex flex-column flex-column-fluid'>
      {/* begin::Content */}
      <div className='d-flex flex-center flex-column flex-column-fluid p-10 pb-lg-20'>
        {/* begin::Wrapper */}
        <div className='w-lg-500px bg-white rounded shadow-sm p-10 p-lg-15'>
          <Outlet />
        </div>
        {/* end::Wrapper */}
      </div>
      {/* end::Content */}
      {/* begin::Footer */}
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
      {/* end::Footer */}
    </div>
  )
}


const AuthPage = () => (
  <Routes>
    <Route element={<AuthLayoutCenter />}>
      <Route path='registration' element={<Registration />} />
      <Route path='forgot-password'>
        <Route path='' element={<ForgotPassword />} />
        <Route path=':userId/:token' element={<ResetPassword />} />
      </Route>
    </Route>
    <Route element={<AuthLayout />}>
      <Route path='login' element={<Login />} />
      <Route index element={<Login />} />
    </Route>
  </Routes>
)

export {AuthPage}
