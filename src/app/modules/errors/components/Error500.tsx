import {FC} from 'react'

const Error500: FC = () => {
  return (
    <>
      <h1 className='fw-bolder fs-4x text-danger mb-10'>System Error</h1>

      <div className='fw-bold fs-3 text-gray-400 mb-15'>
        Sorry, that didn't work. Please try again or come back later. 
      </div>
    </>
  )
}

export {Error500}
