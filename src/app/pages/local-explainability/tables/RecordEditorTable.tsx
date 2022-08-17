import {useCallback} from 'react';
import { connect, useDispatch } from 'react-redux';
import * as localExpData from '../redux/LocalExplainabilityRedux'

// STORES EDITED DATA AND MAKES IT AVAILABLE TO MAKE A POST REQUEST AFTER CLICKING PREDICT BUTTON IN INFER TABLE

const RecordEditorTable:React.FC<{showCounterfactualValues : boolean, pointEditedByUser : localExpData.dataObject}> = ({showCounterfactualValues,pointEditedByUser}) => {
    const dispatch = useDispatch()
  

    const onChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>, key: any) => {
            // insert value, using key, and save it to REDUX
            const valueChangedByUser = e.currentTarget.value;
            let pointSelectedByUser: any = pointEditedByUser;
            pointSelectedByUser[key] = valueChangedByUser;
            dispatch(localExpData.actions.setPointEditedByUser(pointSelectedByUser))
        },
        [pointEditedByUser,dispatch]
    );

    return (
        <div>
            <table className='table table-responsive  table-row-gray-300 align-middle text-center'>
                <thead>
                    <tr className='fw-bolder'>
                        <th>Feature</th>
                        <th>Value(s)</th>
                        {showCounterfactualValues && <th>Counterfactual Value(s)</th>}
                    </tr>
                </thead>
                {pointEditedByUser === null ? (
                    <tbody>
                        <tr>
                            <td  className='text-center'>Select a point to view data</td>
                        </tr>
                    </tbody>
                ) : (
                    <tbody>
                        {Object.entries(pointEditedByUser).map(([key , val]:any, index: number) => {
                            return (
                                <tr key={index}>
                                    <td>{key}</td>
                                    <td className='max-w-100px g-2'>
                                        <input
                                            className="data-input mw-100px text-center"
                                            placeholder={val}
                                            onChange={(e) => onChange(e, key)}
                                        />
                                    </td>
                                    {showCounterfactualValues && <td></td>}
                                </tr>
                            );
                        })}
                    </tbody>
                )}
            </table>
        </div>
    );
};

function  mapState(state:any){
    const {showCounterfactualValues, pointEditedByUser } = state.localExplainability
    return {showCounterfactualValues, pointEditedByUser }
}
export default connect(mapState)(RecordEditorTable);