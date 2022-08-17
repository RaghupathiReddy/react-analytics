
import './style.scss'
import { MatrixRow } from '../../../Models/MatrixModels'

export interface ConfusionMatrixProps {
  dataRows: MatrixRow[]
}


const ConfusionMatrix: React.FC<ConfusionMatrixProps> = (props: ConfusionMatrixProps) => {
  const { dataRows } = props;  

  return (
    <div className='card p-3 '>


      <div className="mx-10 p-2">
        {
          dataRows && <table className="table table-row-dashed table-bordered table-rounded border gy-7 gs-7">

            <thead>
              <tr className="fw-bolder fs-6  text-gray-800">
                <th colSpan={2} rowSpan={2} className=" bg-light-primary align-top">Confusion Matrix</th>
                <th colSpan={2} className="text-center">Actual</th>
              </tr>

              <tr className="fw-bolder fs-6 text-gray-800">

                <th>{dataRows[0].cells[0].columnHeading}</th>
                <th>{dataRows[0].cells[1].columnHeading}</th>
              </tr>
            </thead>
            <tbody>

              <tr>
                <td rowSpan={2} colSpan={1} className="fw-bolder  fs-6 align-middle text-gray-800" >Predicted</td>

                <td className='fw-bolder fs-6 text-gray-800' >{dataRows[0].heading}</td>
                <td className='bg-light-success'>{dataRows[0].cells[0].value}</td>
                <td className='bg-light-danger'>{dataRows[0].cells[1].value}</td>

              </tr>
              <tr>
                <td className='fw-bolder px-3 fs-6 text-gray-800' >{dataRows[1].heading}</td>
                <td className='bg-light-danger'>{dataRows[1].cells[0].value}</td>
                <td className='bg-light-success'>{dataRows[1].cells[1].value}</td>

              </tr>
            </tbody>
          </table>
        }

      </div>

    </div>
  )
}

export default ConfusionMatrix


//const confusionMatrixData = [
//  {
//    name: 'Predicted Class 1',
//    values: [
//      {
//        name: 'Actual Class 1',
//        value: 30,
//      },
//      {
//        name: 'Actual Class 2',
//        value: 40,
//      },
//    ],
//  },
//  {
//    name: 'Predicted Class 2',
//    values: [
//      {
//        name: 'Actual Class 1',
//        value: 10,
//      },
//      {
//        name: 'Actual Class 2',
//        value: 20,
//      },
//    ],
//  },
//]
