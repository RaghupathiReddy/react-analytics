import { useDispatch, connect } from "react-redux";
import { IColumnsState } from './Models/Project';
import * as Topics from './Redux/ProjectRedux';


type Props = {
  yFileColumns: Array<IColumnsState>
}

const YFileValidationTable: React.FC<Props> = ({ yFileColumns }) => {
  const dispatch = useDispatch();

  const setColumnLabel = (columnName: string, label?: string) => {
    const updatedColumns = yFileColumns.map((key: any) => {
      if (key.name === columnName)
        key.label = label
      return key
    })
    dispatch(Topics.actions.setYFileColumnsInfo(updatedColumns));
  }

  const setColumnComment = (columnName: string, comment?: string) => {
    const updatedColumns = yFileColumns.map((key: any) => {
      if (key.name === columnName)
        key.comment = comment
      return key
    })
    dispatch(Topics.actions.setYFileColumnsInfo(updatedColumns));
  }

  return (
    <>
      <div className="d-flex flex-fill flex-column p-2">
        <div className='table-responsive bg-white m-2 pe-4'>
          {/* begin::Table */}
          <table className='table table-row-bordered align-middle gs-0 mb-0'>
            {/* begin::Table head */}
            <thead className="">
              <tr className='fw-bolder bg-dark text-light'>
                <th className='ps-4 min-w-125px rounded-start text-md-center'> Column Name</th>
                <th className='min-w-125px text-md-center' >Label</th>
              </tr>
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}

            <tbody>
              {yFileColumns.map((column) => {
                return (
                  <tr>
                    <td className='min-w-125px text-md-center'>
                      <p>{column.name}</p>
                    </td>
                    <td className='min-w-125px text-md-center'>
                      <div className="pe-4">
                        <input
                          className="form-control form-control-sm form-control-solid"
                          type="text"
                          name="label"
                          placeholder={column.name}
                          value={column.label}
                          onChange={(e) => setColumnLabel(column.name, e.target.value)}
                        />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
            {/* end::Table body */}
          </table>
          {/* end::Table */}
        </div>
        <div className='table-responsive bg-white m-2 pe-4'>
          {/* begin::Table */}
          <table className='table table-row-bordered align-middle gs-0 mb-0'>
            {/* begin::Table head */}
            <thead className="">
              <tr className='fw-bolder bg-dark text-light'>
                <th className='min-w-100px text-md-center'>Definition</th>
                <th className='min-w-100px text-md-center'>description</th>
              </tr>
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}
            <tbody>
              {yFileColumns.map((column) => {
                return (
                  <tr>
                    <td className='min-w-125px text-md-center'>
                      <div className="pe-4">
                        <p>{column.name === "claim_no" ? "definition of 0" : "definition of 1"}</p>
                      </div>
                    </td>
                    <td className='min-w-125px text-md-center'>
                      <div className="pe-4">
                        <input
                          className="form-control form-control-sm form-control-solid"
                          type="text"
                          name="comment"
                          value={column.comment}
                          onChange={(e) => setColumnComment(column.name, e.target.value)}
                        />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
            {/* end::Table body */}
          </table>
          {/* end::Table */}
        </div>
      </div>
    </>
  )
}


function mapState(state: any) {
  const { yFileColumns } = state.businessTopics.newProject;
  return { yFileColumns };
}
export default connect(mapState)(YFileValidationTable);