import clsx from "clsx";
import { useState } from "react";
import { KTSVG } from "../../../../_metronic/helpers";
import { NodeDatum, SelectedNode } from "../../../Models/TreeGraphModels";

const SelectedNodeList: React.FC<{nodeList: SelectedNode[],removeSelectedNode:(nodeID:string)=>void}> = ({nodeList,removeSelectedNode}) => {
  const [isMinimized,setIsMinimized] = useState(false);
  return (
      <>
      <div className="d-flex justify-content-center align-items-center mt-2 mx-2">
        <span
          onClick={() => { setIsMinimized(!isMinimized) }}
          data-kt-button="true"
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          className={'z-index-1 p-0 opacity-75 position-relative'}
          style={{ 'top': '-10px', 'left': '-18px' }}
          title={isMinimized ? "Expand" : "Collapse"}>
          {isMinimized ?
            (<KTSVG path="\media\icons\turing\expand.svg" className="svg-icon-2x "></KTSVG>) :
            (<KTSVG path="\media\icons\turing\collapse.svg" className="svg-icon-2x "></KTSVG>)}
        </span>
        <h5>Selected Nodes</h5>
      </div>
      <div className={clsx('w-100',{
        'hide': isMinimized,
      })}>
        {nodeList.map((node) => {
          return <>
          <ul className="d-flex justify-content-center align-items-center p-0">
          <button className="btn btn-primary btn-sm p-2 mb-2 w-100"><p className="m-0">{node.nodeName}</p></button >
            <span
              data-kt-button="true"
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              title={"remove"}
              className={"position-relative svg-icon-warning"}
              onClick={()=>{removeSelectedNode(node.nodeName)}}
              style={{ 'top': '-9px', 'left': '-33px' }}>
              <KTSVG path="\media\icons\turing\rejectedCross.svg" className="svg-icon-2x  ms-3"></KTSVG>
            </span>
            </ul>
          </>
        })
        }
      </div>
    </>
  )
}

export default (SelectedNodeList);