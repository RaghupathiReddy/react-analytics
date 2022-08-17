import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import clsx from 'clsx'
import {Link, useParams} from 'react-router-dom'
import {useFormik} from 'formik'
import {updatePassword} from '../redux/AuthCRUD'
import {PasswordMeterComponent} from '../../../../_metronic/assets/ts/components'

const initialValues = {
  password: '',
  changepassword: '',
}

const resetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Password is required'),
  changepassword: Yup.string()
    .required('Password confirmation is required')
    .when('password', {
      is: (val: string) => (val && val.length > 0 ? true : false),
      then: Yup.string().oneOf([Yup.ref('password')], "Password and Confirm Password didn't match"),
    }),
})

export function ResetPassword() {
  const [loading, setLoading] = useState(false)
  const [hasErrors, setHasErrors] = useState<boolean | undefined>(undefined)
  const {userId, token} = useParams()

  const formik = useFormik({
    initialValues,
    validationSchema: resetPasswordSchema,
    onSubmit: (values, {setStatus, setSubmitting}) => {
      setLoading(true)
      setHasErrors(undefined)
      setTimeout(() => {
        updatePassword(values.password, userId, token)
          .then(({data}) => {
            setHasErrors(false)
            setLoading(false)
          })
          .catch(() => {
            setHasErrors(true)
            setLoading(false)
            setSubmitting(false)
            setStatus('Something is wrong try again later!')
          })
      }, 1000)
    },
  })

  useEffect(() => {
    PasswordMeterComponent.bootstrap()
  }, [])

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
          <h1 className='text-dark mb-3'>Reset Password</h1>
          {/* end::Title */}

          {/* begin::Link */}
          <div className='text-gray-400 fw-bold fs-4'>Enter your new password.</div>
          {/* end::Link */}
        </div>

        {/* begin::Title */}
        {hasErrors === true && (
          <div className='mb-lg-10 alert alert-danger'>
            <div className='alert-text font-weight-bold'>
              Sorry, looks like there are some errors detected, please try again.
            </div>
          </div>
        )}

        {hasErrors === false && (
          <div className='mb-10 bg-light-info p-8 rounded'>
            <div className='text-info'>Password reset successfully!</div>
          </div>
        )}
        {/* end::Title */}

        {/* begin::Form group Password */}
        <div className='mb-10 fv-row' data-kt-password-meter='true'>
          <div className='mb-1'>
            <label className='form-label fw-bolder text-dark fs-6'>Password</label>
            <div className='position-relative mb-3'>
              <input
                type='password'
                placeholder='Password'
                autoComplete='off'
                {...formik.getFieldProps('password')}
                className={clsx('form-control form-control-lg form-control-solid', {
                  'is-invalid': formik.touched.password && formik.errors.password,
                })}
              />
              {formik.touched.password && formik.errors.password && (
                <div className='fv-plugins-message-container'>
                  <div className='fv-help-block'>
                    <span role='alert'>{formik.errors.password}</span>
                  </div>
                </div>
              )}
            </div>
            {/* begin::Meter */}
            <div
              className='d-flex align-items-center mb-3'
              data-kt-password-meter-control='highlight'
            >
              <div className='flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2'></div>
              <div className='flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2'></div>
              <div className='flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2'></div>
              <div className='flex-grow-1 bg-secondary bg-active-success rounded h-5px'></div>
            </div>
            {/* end::Meter */}
          </div>
          <div className='text-muted'>
            Use 8 or more characters with a mix of letters, numbers & symbols.
          </div>
        </div>
        {/* end::Form group */}

        {/* begin::Form group Confirm password */}
        <div className='fv-row mb-5'>
          <label className='form-label fw-bolder text-dark fs-6'>Confirm Password</label>
          <input
            type='password'
            placeholder='Password confirmation'
            autoComplete='off'
            {...formik.getFieldProps('changepassword')}
            className={clsx('form-control form-control-lg form-control-solid', {
              'is-invalid': formik.touched.changepassword && formik.errors.changepassword,
            })}
          />
          {formik.touched.changepassword && formik.errors.changepassword && (
            <div className='fv-plugins-message-container'>
              <div className='fv-help-block'>
                <span role='alert'>{formik.errors.changepassword}</span>
              </div>
            </div>
          )}
        </div>
        {/* end::Form group */}
        {/* end::Form group */}

        {/* begin::Form group */}
        <div className='d-flex flex-wrap justify-content-center pb-lg-0'>
          <button
            type='submit'
            id='kt_password_reset_submit'
            className='btn btn-lg btn-primary fw-bolder me-4'
            disabled={formik.isSubmitting || !formik.isValid}
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
              className='btn btn-lg btn-light-primary fw-bolder'
              disabled={formik.isSubmitting || !formik.isValid}
            >
              Cancel
            </button>
          </Link>{' '}
        </div>
        {/* end::Form group */}
      </form>
    </>
  )
}
