import React, {useState} from 'react'
import * as Yup from 'yup'
import clsx from 'clsx'
import {Link} from 'react-router-dom'
import {useFormik} from 'formik'
import {requestPassword} from '../redux/AuthCRUD'
import { LoginErrorMessage, LoginSuccessMessage } from '../../../messages/LoginMessages'

const initialValues = {
  email: '',
}

const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Wrong email format')
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Email is required'),
})

export function ForgotPassword() {
  const [loading, setLoading] = useState(false)
  const [hasErrors, setHasErrors] = useState<boolean | undefined>(undefined)
  const formik = useFormik({
    initialValues,
    validationSchema: forgotPasswordSchema,
    onSubmit: (values, {setStatus, setSubmitting}) => {
      setLoading(true)
      setHasErrors(undefined)
      setTimeout(() => {
        const resetPasswordEndPoint = 'auth/forgot-password'
        requestPassword(values.email, resetPasswordEndPoint)
          .then(({data}) => {
            setHasErrors(false)
            setLoading(false)
          })
          .catch(() => {
            setHasErrors(true)
            setLoading(false)
            setSubmitting(false)
            setStatus('The login detail is incorrect')
          })
      }, 1000)
    },
  })

  return (
    <>
      <form
        className='form w-100 fv-plugins-bootstrap5 fv-plugins-framework'
        noValidate
        id='kt_login_password_reset_form'
        onSubmit={formik.handleSubmit}
      >
        <div className='text-center mb-10'>
          {/* begin::Title */}
          <h1 className='text-dark mb-3'>Forgot Password?</h1>
          {/* end::Title */}

          {/* begin::Link */}
          <div className='text-gray-400 fw-bold fs-4'>Enter your registered email to reset password.</div>
          {/* end::Link */}
        </div>

        {/* begin::Title */}
        {hasErrors === true && (
          <div className='mb-lg-10 alert alert-danger'>
            <div className='alert-text font-weight-bold'>
              {LoginErrorMessage.invalidEmail}
            </div>
          </div>
        )}

        {hasErrors === false && (
          <div className='mb-10 bg-light-info p-8 rounded'>
            <div className='text-info'>{LoginSuccessMessage.resetPasswordSent}</div>
          </div>
        )}
        {/* end::Title */}

        {/* begin::Form group */}
        <div className='fv-row mb-10'>
          <label className='form-label fw-bolder text-gray-900 fs-6'>Email</label>
          <input
            type='email'
            placeholder='jdoe@xyz.com'
            autoComplete='off'
            {...formik.getFieldProps('email')}
            className={clsx(
              'form-control form-control-lg form-control-solid',
              {'is-invalid': formik.touched.email && formik.errors.email}
            )}
          />
          {formik.touched.email && formik.errors.email && (
            <div className='fv-plugins-message-container'>
              <div className='fv-help-block'>
                <span role='alert'>{formik.errors.email}</span>
              </div>
            </div>
          )}
        </div>
        {/* end::Form group */}

        {/* begin::Form group */}
        <div className='d-flex flex-wrap justify-content-center pb-lg-0'>
          <button
            type='submit'
            id='kt_password_reset_submit'
            disabled={!formik.dirty || !formik.isValid || !formik.isSubmitting }
            className={clsx(
              'btn btn-lg fw-bolder me-4', {
                'btn-primary':hasErrors===undefined && true,
                'btn-light-primary':hasErrors===false,
              }
            )}
          >
            {!loading && <span className='indicator-label'>Submit</span>}
            {loading && (
            <span className='indicator-progress d-block'>
              Please wait...
              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
          )}
          </button>
          <Link to='/auth/login'>
            <button
              type='button'
              id='kt_login_password_reset_form_cancel_button'
              className={clsx(
                'btn btn-lg  fw-bolder',{
                  'btn-primary':hasErrors===false,
                  'btn-light-primary':hasErrors===undefined && true,
                }
              )}
            >
              Return to Login 
            </button>
          </Link>{' '}
        </div>
        {/* end::Form group */}
      </form>
    </>
  )
}
