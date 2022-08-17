import {FC} from 'react'
import { IErrorsPage } from '../ErrorsPage'

const Error404: FC<IErrorsPage> = (props) => {
  return (
    <>
      <h1 className='fw-bolder fs-4x text-danger mb-10'>{props.message}</h1>

      <div className='fw-bold fs-3 text-gray-400 mb-15'>
      Sorry, but the page you are looking for does not exist or is temporarily unavailable.
      </div>
    </>
  )
}

export {Error404}
