import React, { FC, useEffect, useState } from 'react'
import { connect, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { JsxElement } from 'typescript';
import { FeatureValues, IFilter } from '../../Models/LocalExplainerModels';
import { getFeatureRankings, getLocalExplainerData } from './redux/LocalExplainerCRUD'
import * as LocalExplainerRedux from "./redux/LocalExplainerRedux";

// ************DUMMY DATA TO BE REMOVED LATER*******************

const responseFromDecisionTree = [
    {
        "nodeName": "root",
        "filter": []
    },
    {
        "nodeName": "root_2_2_1",
        "filter": [
            {
                "filterKey": "ageofvehicle",
                "filterCondition": ">=",
                "isCategoricalData" : false,
                "filterCriteria": 0.2
            },
            {
                "filterKey": "ageofdriver",
                "filterCondition": "<=",
                "isCategoricalData" : false,
                "filterCriteria": 0.5
            }
        ]
    },
    {
        "nodeName": "root_2_2_2",
        "filter": [
            {
                "filterKey": "claimestpayout",
                "filterCondition": "==",
                "isCategoricalData" : true,
                "filterCriteria": "1"
            },
            {
                "filterKey": "annualincome",
                "filterCondition": "!=",
                "isCategoricalData" : false,
                "filterCriteria": "0"
            },
            {
                "filterKey": "Gender",
                "filterCondition": "!=",
                "isCategoricalData" : true,
                "filterCriteria": "F"
            }
        ]
    }
]

//**************DUMMY DATA ENDS HERE************************
type INodeFilters = {
    featureRanking : FeatureValues[]
    filter : IFilter[]
}

const NodeFilters:React.FC<INodeFilters> = ({featureRanking, filter}) => {
    var filters:IFilter[] 
 
    const dispatch = useDispatch()
    const {projectId} = useParams()



    function generateFiltersFromColSeq(colSequence:FeatureValues[]){
        let filtersArray : IFilter[] = []
        colSequence.forEach((data:FeatureValues)=>{
            let filter = {
                "filterKey": data.feature,
                "filterCondition": "==",
                "isCategoricalData" : false,
                "filterCriteria": "0"
            }
            filtersArray.push(filter)
        })
        return filtersArray
    }



    function handleNodeSelection(key:string){
        var nodeFiltersKey : string[] = []
        var nodeFilters :any

        filters = generateFiltersFromColSeq(featureRanking)
        dispatch(LocalExplainerRedux.actions.setFilter(filters))

       responseFromDecisionTree.forEach((data)=>{
            if (data.nodeName === key) {
                nodeFilters = data.filter
                nodeFilters.forEach((nodeFilter:any)=>{
                    nodeFiltersKey.push(nodeFilter.filterKey)
                })
            }
        })

        filters.forEach((filter:IFilter,index:number)=>{
            if(nodeFiltersKey.includes(filter.filterKey)){
                let id = nodeFiltersKey.indexOf(filter.filterKey)
                filters[index] = nodeFilters[id]
                dispatch(LocalExplainerRedux.actions.setFilter(filters))
            }
        })
        generateQueryString(filters)         
    }




    function generateQueryString(filter:IFilter[]){
        let queryString = ``
        filter.map((filter:IFilter)=>{
            queryString += `${Math.random().toString(36).substr(2,2)}=`
            //Above line of code generates random variables for generating query params

            Object.values(filter).map((data,index)=>{
                if(data==='true' || data === 'false') 
                    return true
                if(index === 0) {
                    queryString+=`data.${data},`;
                    return true
                }
                queryString += `${data},`
                return true
            })
            queryString += '&'
            return true
        })
        if(projectId)
            getLocalExplainerData(projectId,queryString)

    }

    useEffect(()=>{
       if(projectId && !featureRanking) 
            getFeatureRankings(projectId)
                .then(({data})=>{
                    const {featureRanking : response} = data
                    dispatch(LocalExplainerRedux.actions.setFeatureRankings(response[0].values))
                    dispatch(LocalExplainerRedux.actions.setFilter(generateFiltersFromColSeq(response[0].values))) 
        })
    },[projectId, featureRanking,filter])

  return (
    <>
    <div>
    <div className='text-center'>
        <h3>Choose node</h3>
    </div>
    <div className='d-flex flex-column pt-3 '>
        {responseFromDecisionTree.map((node,index)=>{
            return <input className='btn btn-warning  m-2 p-2'  
            value={node.nodeName}
            onClick={(e:any)=>{
                handleNodeSelection(e.target.value)
            }}
            readOnly
            key={index}
            ></input>
        })}
    </div>
    </div>
    <div>
       {filter && <CategoryFilters filters={filter} applyFilters={generateQueryString}></CategoryFilters>}
    </div>
    </>
  )
}

const CategoryFilters : FC<any> = (props) => {

    const {filters,applyFilters} = props
    const categoricalVariableComparators = ['==', '!==']
    const nonCategoricalVariableComparators = ['==', '!==','>=','<=','>','<']
    const [rows,setRows] = useState<JsxElement[] | undefined>()
    const [filteredRows , setFilteredRows] = useState<JsxElement[]>()
    var userEditedFilters = filters
   

    useEffect(()=>{
        if(filters){
            let rows = generateFilterRows()
            setRows(rows)
            setFilteredRows(rows)
        }
    },[filters])

    function generateFilterRows(){
        let rows = filters.map((filter: IFilter, index: string) => {
            return (
                <div
                    className="d-flex row justify-content-between m-2 p-2"
                    key={filter.filterKey}
                >
                    <div className="col-6 w-80px">
                        <p>{filter.filterKey}</p>
                    </div>
                    <div className="col-2 ">
                        <select
                            className=" cursor-pointer w-50px"
                            onChange={(e) =>
                                handleUserInput(e, index, "filterCondition")
                            }
                        >
                            {filter.isCategoricalData? 
                                categoricalVariableComparators.map((comparator) => {
                                        return <option>{comparator}</option>;
                                    })
                                : nonCategoricalVariableComparators.map(
                                        (comparator) => {
                                            if (comparator === filter.filterCondition)
                                                return <option selected>{comparator}</option>;
                                            return <option>{comparator}</option>;
                                        }
                                    )}
                        </select>
                    </div>
                    <div className="col-2">
                        <input
                            className="w-50px"
                            type="text"
                            defaultValue={filter.filterCriteria}
                            key={filter.filterCriteria}
                            onChange={(e) =>
                                handleUserInput(e, index, "filterCriteria")
                            }
                        ></input>
                    </div>
                </div>
            );
        })
        return rows
    }

    const handleUserInput = 
    (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement> , key: string, index: string) => {
        // insert value, using key, and save it to REDUX

        userEditedFilters = filters
        const valueChangedByUser = e.currentTarget.value;
        const filterSelectedByUser: any = filters[key];
        filterSelectedByUser[index] = valueChangedByUser;
        userEditedFilters[key] = filterSelectedByUser
    }

    function searchFilters(e: React.ChangeEvent<HTMLInputElement>){
        if(!rows)
            return
        let searchResult = rows.filter((row: any)=>{
            return row.key.toString().toLowerCase().includes(e.target.value.toLowerCase())
        })
        setFilteredRows(searchResult)
    }

    return (
        <>
            <div className="text-center m-2 pt-10 pb-5">
                <h3>Filter for claims</h3>
            </div>
            <div>
                <input
                    className="form-control form-control-sm w-250px m-2 "
                    type="text"
                    placeholder='Search filters...'
                    onChange={(e)=>searchFilters(e)}
                >
                </input>
            </div>
            <div className='scroll mh-700px mb-2'>
                {filteredRows}
            </div>
            <div className="d-flex justify-content-center">
                <button
                    className="btn btn-primary"
                    onClick={() => applyFilters(userEditedFilters)}
                >
                    Apply Filters
                </button>
            </div>
        </>
		);
  }

function mapState(state:any){
    const {featureRanking, filter} = state.localExplainer
    return {featureRanking, filter}
}

export default connect(mapState)( NodeFilters)