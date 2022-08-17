import { useDispatch, connect } from "react-redux";
import { useState, useEffect } from "react";
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'
import * as Topics from './Redux/ProjectRedux';
import { IColumnsState } from './Models/Project'

type Props = {
  columns: Array<IColumnsState>
  primaryKey: string
  setPrimaryKey: Function
  dependentVariable: string
  setDependentVariable: Function

  projectType: string
  children: never[]
}

const DataMapperTable: React.FC<Props> = (
  {
    columns,
    primaryKey,
    setPrimaryKey,
    dependentVariable,
    setDependentVariable,
    projectType,
  }) => {

  const dispatch = useDispatch();
  const [tableDataMapper, setTableDataMapper] = useState([]);
  
  const setColumnComment = (columnName: string, comment: string) => {
    const updatedColumns = columns.map((key: any) => {
      if (key.name === columnName)
        key.comment = comment
      return key
    })
    dispatch(Topics.actions.setColumnsInfo(updatedColumns));
  }

  const setColumnType = (columnName: string, label: string) => {
    const updatedColumns = columns.map((key: any) => {
      if (key.name === columnName)
        key.label = label
      return key
    })
    dispatch(Topics.actions.setColumnsInfo(updatedColumns));
  }

  const setColumnBinning = (columnName: string, binning: boolean) => {
    const updatedColumns = columns.map((key: any) => {
      if (key.name === columnName)
        key.binning = binning
      return key
    })
    dispatch(Topics.actions.setColumnsInfo(updatedColumns));
  }

  const setColumnStandardization = (columnName: string, standardization: boolean) => {
    const updatedColumns = columns.map((key: any) => {
      if (key.name === columnName)
        key.standardization = standardization
      return key
    })

    dispatch(Topics.actions.setColumnsInfo(updatedColumns));
  }

  const setColumnOneNot = (columnName: string, oneNotEncoding: boolean) => {
    const updatedColumns = columns.map((key: any) => {
      if (key.name === columnName)
        key.oneNotEncoding = oneNotEncoding
      return key
    })
    dispatch(Topics.actions.setColumnsInfo(updatedColumns));
  }

  const setColumnLabelEncoding = (columnName: string, labelEncoding: boolean) => {
    const updatedColumns = columns.map((key: any) => {
      if (key.name === columnName)
        key.labelEncoding = labelEncoding
      return key
    })
    dispatch(Topics.actions.setColumnsInfo(updatedColumns));
  }

  useEffect(() => {
    let tableData: any = localStorage.getItem('dataMapperTableData');
    setTableDataMapper(JSON.parse(tableData));
  }, [])

  return (
    <>
      <div className='table-responsive bg-white'>
        {/* begin::Table */}
        <table className='table table-row-bordered align-middle gs-0 mb-0'>
          {/* begin::Table head */}
          <thead className="">
            <tr className='fw-bolder bg-dark text-light'>
              <th className='ps-4 min-w-125px rounded-start text-md-center'> Column Name</th>
              <th className='min-w-125px text-md-center' >Label</th>
              <th className='min-w-100px text-md-center'>Primary Key</th>
              {projectType === 'Type 1' ? (
                <>
                  <th className='min-w-100px text-md-center'>Dependent variable</th>
                  <th className='min-w-150px text-md-center'>Remarks</th>
                </>
              ) : (
                <>
                  <th className='min-w-100px text-md-center'>Standardization</th>
                  <th className='min-w-100px text-md-center'>One Not encoding</th>
                  <th className='min-w-100px text-md-center'>Label Encoding</th>
                  <th className='min-w-100px text-md-center'>Binning</th>
                  <th className='min-w-100px text-md-center'>column 1 (row 1 value)</th>
                  <th className='min-w-100px text-md-center'>column 1 (row 2 value)</th>
                  <th className='min-w-100px text-md-center'>column 1 (row 3 value)</th>
                </>
              )}
            </tr>
          </thead>
          {/* end::Table head */}
          {/* begin::Table body */}
          <tbody>
            {columns.map((column) => {
              return (
                <tr>
                  <td className='min-w-125px text-md-center'>
                    <p>{column.name}</p>
                  </td>
                  {projectType === 'Type 1' ? (
                    <>
                      <td className='min-w-125px text-md-center'>
                        <p>{column.type}</p>
                      </td>
                      <td className='min-w-125px text-md-center'>
                        <input
                          className={column.name === primaryKey ? 'form-check-input input-disabled' : 'form-check-input'}
                          type='radio'
                          name='dependedVariable'
                          checked={column.name === dependentVariable ? true : false}
                          value={dependentVariable}
                          disabled={column.name === primaryKey ? true : false}
                          onChange={() => setDependentVariable(column.name)}
                          title={column.name === primaryKey ? "Primary key cannot be dependent variable" : "check"}
                        />
                      </td>
                      <td className='min-w-125px text-md-center'>
                        <input
                          className={column.name === dependentVariable ? 'form-check-input input-disabled' : 'form-check-input'}
                          type="radio"
                          name="primaryKey"
                          value={primaryKey}
                          checked={column.name === primaryKey ? true : false}
                          disabled={column.name === dependentVariable ? true : false}
                          onChange={() => setPrimaryKey(column.name)}
                          title={column.name === dependentVariable ? "Dependent variable cannot be primary key" : "check"}
                        />
                      </td>
                      <td className='min-w-125px text-md-center'>
                        <div className="pe-4">
                          <input
                            className="form-control form-control-sm form-control-solid"
                            type="text"
                            name="dependedVariable"
                            value={column.comment}
                            onBlur={(e) => setColumnComment(column.name, e.target.value)}
                          />
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className='min-w-125px text-md-center'>
                        <div className="pe-4">
                          <input
                            className="form-control form-control-sm form-control-solid"
                            type="text"
                            name="label"
                            placeholder={column.name}
                            value={column.label}
                            onChange={(e) => setColumnType(column.name, e.target.value)}
                          />
                        </div>
                      </td>
                      <td className='min-w-125px text-md-center'>
                        <input
                          className={column.name === dependentVariable ? 'form-check-input input-disabled' : 'form-check-input'}
                          type="radio"
                          name="primaryKey"
                          value={primaryKey}
                          checked={column.name === primaryKey ? true : false}
                          disabled={column.name === dependentVariable ? true : false}
                          onChange={() => setPrimaryKey(column.name)}
                          title={column.name === dependentVariable ? "Dependent variable cannot be primary key" : "check"}
                        />
                      </td>
                      <td className='min-w-125px text-md-center'>
                        <input
                          className={column.name === "standardization" ? 'form-check-input input-disabled' : 'form-check-input'}
                          type='checkbox'
                          name='standardization'
                          checked={column.standardization === true ? true : false}
                          value={column.name}
                          disabled={column.oneNotEncoding === true || column.labelEncoding === true || column.binning === true ? true : false}
                          onChange={(e) => setColumnStandardization(column.name, e.target.checked)}
                        />
                      </td>
                      <td className='min-w-125px text-md-center'>
                        <input
                          className={column.name === 'oneNotEncoding' ? 'form-check-input input-disabled' : 'form-check-input'}
                          type='checkbox'
                          name='oneNotEncoding'
                          checked={column.oneNotEncoding === true ? true : false}
                          value={column.name}
                          disabled={column.standardization === true || column.labelEncoding === true ? true : false}
                          onChange={(e) => setColumnOneNot(column.name, e.target.checked)}
                        />
                      </td>
                      <td className='min-w-125px text-md-center'>
                        <input
                          className={column.name === 'labelEncoding' ? 'form-check-input input-disabled' : 'form-check-input'}
                          type='checkbox'
                          name='labelEncoding'
                          checked={column.labelEncoding === true ? true : false}
                          value={column.name}
                          disabled={column.standardization === true || column.oneNotEncoding === true ? true : false}
                          onChange={(e) => setColumnLabelEncoding(column.name, e.target.checked)}
                        />
                      </td>
                      <td className='min-w-125px text-md-center'>
                        <input
                          className={column.name === 'binning' ? 'form-check-input input-disabled' : 'form-check-input'}
                          type='checkbox'
                          name='binning'
                          checked={column.binning === true ? true : false}
                          value={column.name}
                          disabled={column.oneNotEncoding || column.labelEncoding ? false : true}
                          onChange={(e) => setColumnBinning(column.name, e.target.checked)}
                        />

                      </td>
                      <>
                        {tableDataMapper.length && tableDataMapper.map((row: any) =>
                        (
                          <td className='min-w-125px text-md-center'>
                            <p>{row[column.name]}</p>
                          </td>
                        )
                        )}
                      </>
                    </>
                  )}
                </tr>
              )
            })}
          </tbody>
          {/* end::Table body */}
        </table>
        {/* end::Table */}
      </div>
    </>
  );
};

function mapState(state: any) {
  const { columns } = state.businessTopics.newProject;
  return { columns };
}
export default connect(mapState)(DataMapperTable);