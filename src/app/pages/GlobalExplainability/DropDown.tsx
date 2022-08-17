import React from 'react'

type DropDownProps = {
  setChangeCategory: any
  categories: any[]
}

const DropDown: React.FC<DropDownProps> = ({setChangeCategory, categories}) => {
  const handleCategoryChange = (e: any) => {
    setChangeCategory(e.target.value)
  }
  return (
    <>
      <select className='form-select' onChange={handleCategoryChange}>
        {categories &&
          categories.map((val: string, index: number) => (
            <option key={index} value={val}>
              {val}
            </option>
          ))}
      </select>
    </>
  )
}

export default DropDown
