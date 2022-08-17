import {useEffect, useState} from 'react'
import {AgGridReact} from 'ag-grid-react'
import {getFormattedString, getPercentageString, getRoundedValue} from '../../helpers/utility'
import TableWrapper from '../../components/Tables/table-wrapper/TableWrapper'
import {ColDef} from 'ag-grid-community'
import MetricCard from '../../components/cards/MetricCard/MetricCard'
import {PageTitle} from '../../../_metronic/layout/core'
import Header from '../../components/header'
import { Link, useParams } from 'react-router-dom'
import {getDataSummaryResponse} from './redux/DataSummaryCRUD'
import { ErrorInfo } from '../../Models/DataSummaryModels'
import * as DataSummaryRedux from "./redux/DataSummaryRedux";
import { connect, useDispatch } from 'react-redux'
import PageLoader from '../../components/loaders/PageLoader'
import { IDataSummary } from './redux/DataSummaryRedux'
import { ErrorsPage } from '../../modules/errors/ErrorsPage'

type DataSummaryProps = {
  dataSummary: IDataSummary 
};

const DataSummary: React.FC<DataSummaryProps> = ({dataSummary}) => {
  const { projectId } = useParams();
  const [isLoaded, setIsLoaded] = useState<Boolean>(false);
  const dataSummaryValue= dataSummary.dataSummary;
  const [metrics, setMetrics] = useState<MetricInfo | null>(null);
  const [errors, setErrors] = useState<Error[]>([]);
  const dispatch = useDispatch();
  useEffect(() => {
    if (dataSummaryValue) {
      const { documentCount } = dataSummaryValue;

      const newMetricInfo = getMetricsData(dataSummaryValue);
      setMetrics(newMetricInfo);

      const newErrors = getErrors(dataSummaryValue.errorsInfo, documentCount);
      setErrors(newErrors);

      setIsLoaded(true);
    }
  }, [dataSummaryValue]);

  const getDataSummary = (projectId: any) => {
    const isDataAvailable =
    dataSummaryValue !== DataSummaryRedux.initialDataSummary.dataSummary;
    if ( !isDataAvailable) {
      getDataSummaryResponse(projectId)
        .then((response) => {
          let api_response = response.data.data;
          dispatch(DataSummaryRedux.actions.GetSummary(api_response));
          setIsLoaded(true);
        })
        .catch((error) => {
          console.log(error);
          setIsLoaded(true);
        });
    }
  };

  useEffect(() => {
    getDataSummary(projectId);
  }, [projectId]);

  if (!isLoaded) {
    return <PageLoader />;
  }

  function getErrors(
    errorInfoList: ErrorInfo[],
    documentCount: number
  ): Error[] {
    let errors: Error[] = [];
    errorInfoList.forEach((error) => {
      const { type, count } = error;
      const percentage = getErrorPercentage(count, documentCount);
      const newError: Error = {
        type,
        count,
        percentage: percentage,
      };

      errors.push(newError);
    });
    return errors;
  }

  function getErrorPercentage(
    errorCount: number,
    documentCount: number
  ): number {
    const accuratePercentage = (errorCount / documentCount) * 100;
    const roundedValue = getRoundedValue(accuratePercentage, 2);
    return roundedValue;
  }

  function getMetricsData(dataSummaryValue: any): MetricInfo {
    const { documentCount } = dataSummaryValue;

    const rateInfo = dataSummaryValue.rateInfo;
    const { acceptedRate, claimRate, errorRate, noClaimRate } = rateInfo;

    const newMetricInfo: MetricInfo = {
      documentCount: documentCount,
      acceptedRate: acceptedRate,
      errorRate: errorRate,
      claimRate: claimRate,
      noClaimRate: noClaimRate,
    };

    return newMetricInfo;
  }

  return (
    <>
      <PageTitle
        element={
          <Header title="Data Summary">
            <Link className="btn btn-primary me-5" to="/create-project-form">
              Re-Upload Files
            </Link>
            <Link
              className="btn btn-primary"
              to="/eda/62863b043f0d7d1c5443a354"
            >
              Proceed
            </Link>
          </Header>
        }
      />
      {metrics && errors ? <><MetricCards {...metrics} />
        <ErrorTable errors={errors} /></> : <ErrorsPage message={'Data Summary records not found!'}></ErrorsPage>
      }

    </>
  );
};


function mapState(state: any) {
  const { dataSummary } = state;
  return {dataSummary};
}

export default connect(mapState)(DataSummary);


const MetricCards = (props: MetricInfo) => {
  
  let {documentCount, acceptedRate, errorRate, claimRate, noClaimRate} = props

  let documentCountStr = getFormattedString(documentCount)

  let acceptedRateStr = getPercentageString(acceptedRate)
  let errorRateStr = getPercentageString(errorRate)
  let claimRateStr = getPercentageString(claimRate)
  let noClaimRateStr = getPercentageString(noClaimRate)
  const iconSize = 5
  return (
    <div className='row p-2'>
      <div className='col-lg p-2'>
        <MetricCard
          iconPath='/media/icons/duotune/general/gen005.svg'
          value='Insurances'
          title={documentCountStr}
          size={iconSize}
          themeColor='primary'
        />
      </div>
      <div className='col-lg p-2'>
        <MetricCard
          iconPath={'/media/icons/duotune/general/gen043.svg'}
          themeColor='success'
          size={iconSize}
          value='Accepted'
          title={acceptedRateStr}
        />
      </div>
      <div className='col-lg p-2'>
        <MetricCard
          iconPath={'/media/icons/duotune/general/gen044.svg'}
          themeColor='danger'
          size={iconSize}
          value='Error'
          title={errorRateStr}
        />
      </div>
      <div className='col-lg p-2'>
        <MetricCard
          iconPath={'/media/icons/duotune/files/fil025.svg'}
          themeColor='success'
          size={iconSize}
          value='Claims'
          title={claimRateStr}
        />
      </div>
      <div className='col-lg p-2'>
        <MetricCard
          iconPath={'/media/icons/duotune//files/fil007.svg'}
          themeColor='danger'
          size={iconSize}
          value='No Claims'
          title={noClaimRateStr}
        />
      </div>
    </div>
  )
}

interface MetricInfo {
  documentCount: number
  acceptedRate: number
  errorRate: number
  claimRate: number
  noClaimRate: number
}

const ErrorTable = (props: ErrorTableProps) => {
  const rows = getRowsFromErrors(props.errors)
  const [rowData] = useState(rows)

  function getRowsFromErrors(errors: Error[]) {
    let rows: any[] = []
    errors.forEach((error: Error) => {
      rows.push({
        'Error Type': error.type,
        '# Error': error.count,
        '% Error': error.percentage,
        cellStyle: {border: '10px solid black'},
      })
    })
    return rows
  }

  const [columnDefs] = useState<ColDef[]>([
    {field: 'Error Type', flex: 1},
    {field: '# Error', sortable: true, colId: '1', flex: 1},
    {field: '% Error', sortable: true, colId: '2', flex: 1},
  ])

  return (
    <div className='row'>
      <div className='col-xl-6'>
        <TableWrapper height={300} width={'100%'}>
          <AgGridReact rowData={rowData} columnDefs={columnDefs}></AgGridReact>
        </TableWrapper>
      </div>
    </div>
  )
}
interface ErrorTableProps {
  errors: Error[]
}

interface Error {
  type: string
  count: number
  percentage: number
}
