import React, {useEffect, useState } from 'react'
import { connect, useDispatch } from 'react-redux';
import { getPredictionResult } from '../../../helpers/pollPredictionResult';
import { getRandomNumber } from '../../../helpers/utility';
import { IPredictionRequest } from '../../../Models/FeatureExplainabilityModels';
import { SelectedRowRecord, WaterfallGraphData } from '../../../Models/LocalExplainerModels';
import { postPredict } from '../redux/LocalExplainerCRUD';
import * as LocalExplainerRedux from "./../redux/LocalExplainerRedux";
import { useParams } from "react-router-dom";
import { getWaterfallChartData } from '../helperFunctions';
import { excludeProperties } from '../../../helpers/objectHelperFunctions';

type IRecordEditorTable = {
    selectedRow : SelectedRowRecord,
    filteredRowsLoadingStatus : boolean, 
    setSecondWaterFallGraph : (response:WaterfallGraphData[]) => void
}



const RecordEditorTable:React.FC<IRecordEditorTable> = (props) => {

    const {selectedRow, filteredRowsLoadingStatus, setSecondWaterFallGraph} = props;

    const excludedFields: string[] = ['_id', 'projectId','predictionId', 'claimno', 'actual' , 'predicted_fraud','probability', 'messageId']

    const [filteredRows, setFilteredRows] = useState<(JSX.Element|true)[]>()
    const [rows,setRows] = useState<(JSX.Element|true)[]>()
    const dispatch= useDispatch()
    const excludedRows = ['_id', 'projectId', 'claim no']
    const { projectId } = useParams()

    const getEditorTableRows = (selectedRow:SelectedRowRecord)=>{
       let rows = Object.entries(selectedRow).map(([key , val]:[string,number | string], index: number) => {
            if(!excludedRows.includes(key)) 
           { 
            return (
                <tr key={key}>
                    <td>{key}</td>
                    <td className='min-w-600px g-2'>
                        <input
                            className="data-input mw-100px text-center"
                            defaultValue={Number(val).toFixed(2)}
                            onChange={(e) => handleUserInput(e, key)}
                        />
                    </td>
                </tr>
            );
        }
        return true
        })
        return rows
    }


    useEffect(() => {
        var editorTableRows;
        if(selectedRow){
            editorTableRows = getEditorTableRows(selectedRow)
        setRows(editorTableRows)
        if(!filteredRows)
            setFilteredRows(editorTableRows)
        }
      
    }, [filteredRows, selectedRow])
    
   useEffect(()=>{
    if(filteredRowsLoadingStatus){
        setFilteredRows(rows)
        dispatch(LocalExplainerRedux.actions.updateFilteredRowsLoadingStatus(false))
    }
   },[rows,filteredRowsLoadingStatus,dispatch])

   const handleUserInput = 
    (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
        // insert value, using key, and save it to REDUX
        const valueChangedByUser = e.currentTarget.value;
        const rowSelectedByUser: any = selectedRow;
        rowSelectedByUser[key] = valueChangedByUser;
        dispatch(LocalExplainerRedux.actions.updateSelectedRowData(rowSelectedByUser))
    }

//Handles search bar input
const handleSearchBarInput = (e:React.ChangeEvent<HTMLInputElement>) =>{
    if(rows === undefined) 
        return
    let filteredRows = rows.filter((row:any)=>{
        if(!row) 
            return null
        return row.key?.toString().toLowerCase().includes(e.target.value.toLowerCase())
    })
    setFilteredRows(filteredRows)
}

function getPredictionsFromSelectedRow(selectedRow:any) { // type checking cannot be done on selectedRow because it is of type SelectedRowRecord                                                                   
    const predictionData = selectedRow;
    //This function is unnecessary.Confrim it later and delete it!!!
    const maritalStatusArray = selectedRow.maritalstatus_1;
    const witnessPresentIndArray = selectedRow.witnesspresentind_1;
    
    if(maritalStatusArray && maritalStatusArray.length > 0) {
        predictionData.maritalstatus_1 = maritalStatusArray[0];
    }
    if(witnessPresentIndArray && witnessPresentIndArray.length > 0){
        predictionData.witnesspresentind_1 = witnessPresentIndArray[0];
    }
    return predictionData;
}

function handlePredictClick() {
    const predictions = getPredictionsFromSelectedRow(selectedRow)  
    if(predictions && projectId){
        const messageId:string = getRandomNumber(10).toString();

        const predictionsWithRequiredFieldsOnly = excludeProperties(predictions, ["_id", "predicted_fraud", "projectId", "newPredicted", "actual"]);
        console.log("without uneeded properties: ", predictionsWithRequiredFieldsOnly);
        

        const predictionRequest: IPredictionRequest = {
            messageId: messageId,
            predictions: predictionsWithRequiredFieldsOnly,
            projectId:projectId,
        }
        
        postPredict(predictionRequest)

        const oneMinute = 60000;
        // const tenMinutes = 5 * oneMinute;

        setInterval(() => {  
            getPredictionResult(messageId)
                .then((predictions: any) => {
                    alert("message from python recieved!");
                    console.log("the prediction result is: ", predictions);
                    const graphData: WaterfallGraphData[] = getWaterfallChartData(predictions, excludedFields);
                    setSecondWaterFallGraph(graphData)

                })

        }, oneMinute/2);



        // const waterfallRows: WaterfallGraphData[] = [{
        //     "order": 1,
        //     "name": "Prediction",
        //     "y": 10
        // }]
        // props.setSecondWaterFallGraph(waterfallRows)

    }
}

  return (
    <div>
        <div className='p-3'>
            <h3>Change values for counterfactual</h3>
        </div>
        <div className='d-flex flex-row justify-content-between p-2 '>
            <div className='d-flex flex-row'>
                <input 
                className='form-control form-control-lg form-control-solid' 
                placeholder='Search features...' 
                type={'text'} 
                onChange={(e)=>handleSearchBarInput(e)}
                />
            </div>
            
        </div>
        <div className='scroll mh-250px mt-5'>
            <table>
                <tbody>
                    {filteredRows}
                </tbody>
            </table>
        </div>
        <div className='d-flex flex-row justify-content-center m-5'>
                <button onClick={handlePredictClick} className='btn btn-primary'>Predict</button>
            </div>
    </div>
  )
}

function mapState(state:any){
    const {selectedRow, filteredRowsLoadingStatus} = state.localExplainer
    return {selectedRow , filteredRowsLoadingStatus}
}
export default connect(mapState)(RecordEditorTable)