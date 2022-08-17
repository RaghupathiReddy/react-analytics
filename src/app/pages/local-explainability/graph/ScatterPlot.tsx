import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import {DropdownToggle, DropdownMenu, DropdownItem, Dropdown} from 'reactstrap'
import React, {useState} from 'react'
import {useDispatch} from 'react-redux'
import { IScatterGraph } from '../models/ScatterPlotModel';
import * as localExpData from '../redux/LocalExplainabilityRedux'

const ScatterGraph :React.FC<IScatterGraph> = (props) => { 
  const dropdownOptions = props.dropdownOptions
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [dropdownTwoOpen, setDropdownTwoOpen] = useState(false)
  const dispatch = useDispatch()
  var title = `Scatter Plot of ${props.xAxisLabel} and ${props.yAxisLabel}`

  var options = {
    chart: {
      type: 'scatter',
      zoomType: 'xy',
    },

    credits: {
      enabled: false,
    },
    title: {
      text: title,
      margin:50,
      align:'left',
      style:{
        fontFamily:'Poppins, Helvetica, "sans-serif"',
        fontWeight:'600',
      }
    },
    xAxis: {
      title: {
        enabled: true,
        text: props.xAxisLabel,
      },
      startOnTick: true,
      endOnTick: true,
      showLastLabel: true,
    },
    yAxis: {
      title: {
        text: props.yAxisLabel,
      },
    },
    legend: {
      layout: 'vertical',
      align: 'left',
      verticalAlign: 'top',
      x: 100,
      y: 70,
      floating: true,
      backgroundColor: 'beige',
      borderWidth: 1,
    },
    series: props.data,
    plotOptions: {
      series: {
        cursor: 'pointer',
        point: {
          events: {
            click: function (id: any) {
              const nameOfGraph = id.point.series.name
              const index = id.point.index
              const seriesOfSelectedPoint = props.pairSeriesNameWithData && props.pairSeriesNameWithData[nameOfGraph as keyof typeof props.pairSeriesNameWithData]
              const pointSelectedByUser = seriesOfSelectedPoint && seriesOfSelectedPoint[index as keyof typeof seriesOfSelectedPoint]
              pointSelectedByUser && dispatch(localExpData.actions.setPointEditedByUser(pointSelectedByUser))
            },
          },
        },
      },
    },
  }

  const getDropdown = () => {
    if (dropdownOptions && dropdownOptions.length > 1) {
      return (
// {/*TODO: Replace all logic will be removed from dropdowns after API optimization or after the response is available in standard format*/}
// Change the dropdowns to the ones provided by theme i.e Select2 , take it up during optimization       
       <div className='d-flex justify-content-between m-2'>
          <label>
            X-AXIS Variable
            <Dropdown isOpen={dropdownOpen} toggle={() => setDropdownOpen(!dropdownOpen)}>
              <DropdownToggle caret>{props.xAxisLabel.replaceAll('_', ' ')}</DropdownToggle>
              <DropdownMenu className='drop-down-menu scroll h-200px'>
                {dropdownOptions.map((option: any, index: any) => {
                  return (
                    <DropdownItem onClick={() => props.handleXAxisVariable?.(option)} key={index}>
                      {option.replaceAll('_', ' ')}   
                    </DropdownItem>
                  )
                })}
              </DropdownMenu>
            </Dropdown>
          </label>
          <label>
            Y-AXIS Variable
            <Dropdown isOpen={dropdownTwoOpen} toggle={() => setDropdownTwoOpen(!dropdownTwoOpen)}>
              <DropdownToggle caret>{props.yAxisLabel.replaceAll('_', ' ')}</DropdownToggle>
              <DropdownMenu className='drop-down-menu scroll h-200px'>
                {dropdownOptions.map((option: any, index: any) => {
                  return (
                    <DropdownItem onClick={() => props.handleYAxisVariable?.(option)} key={index}>
                      {option.replaceAll('_', ' ')}
                    </DropdownItem>
                  )
                })}
              </DropdownMenu>
            </Dropdown>
          </label>
        </div>
      )
    } else {
      return null
    }
  }

  return (
    <div>
      {getDropdown()}
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  )
}

export default ScatterGraph