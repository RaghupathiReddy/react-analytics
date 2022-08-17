import React from 'react'

type Props = {}

const responseFromDecisionTree = 
   
    {
        "nodeName": "root_2_2_1",
        "filter": [
            {
                "filterKey": "Month of Joining",
                "filterCondition": "==",
                "filterCriteria": "1"
            },
            {
                "filterKey": "Salary",
                "filterCondition": "!=",
                "filterCriteria": "0"
            },
            {
                "filterKey": "Gender",
                "filterCondition": "!=",
                "filterCriteria": "F"
            }
        ]
    }


const CategoryFilters = (props: any) => {
  return (
    <>
    <div className='text-center m-2'>
        <h3>CategoryFilters</h3>
    </div>
    <div>
        {
           props.filter && props.filter.map((obj:any,index:any)=>{
              return (
                <div className='d-flex justify-content-between m-2 p-2' key={index}>
                    <div className='col w-100px'>
                        <p>{obj.filterKey}</p>
                    </div>
                    <div className='col w-20px'>
                        <select className=' cursor-pointer w-50px'>
                            <option>{obj.filterCondition}</option>
                        </select>
                    </div>
                    <div className='col'>
                        <input
                            className='w-50px'
                            id=''
                            type="text"
                            defaultValue={obj.filterCriteria}
                        ></input>
                    </div>
                </div>
			);
            })
        }
    </div>
    <div className='d-flex justify-content-center'>
        <button className='btn btn-primary'>Apply Filters</button>
    </div>
    </>
  )
}

export default CategoryFilters