import clsx from "clsx";
import React, { useState } from "react";
import { KTSVG } from "../../../../_metronic/helpers";
import { BinaryTreeData } from "../../../Models/TreeGraphModels";

const TreeList: React.FC<{
    treeList: BinaryTreeData[],
    currentTreeIndex:number
    updateSelectedTree: (index: number)=>void
    removeSelectedTree: (index: number)=> void}> = ({treeList,currentTreeIndex, updateSelectedTree,removeSelectedTree}) => {
  const [isMinimized,setIsMinimized] = useState(false);

  return (
    <>
      <div className="d-flex justify-content-center align-items-center mt-2 mx-0">
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
        <h5>Saved Trees</h5>
      </div>
      <div className={clsx('w-100', {
        'hide': isMinimized,
      })}>
        {treeList.map((treeData, index) => {
          return (<>
            <ul className="d-flex justify-content-center align-items-center p-0">
              {index == currentTreeIndex ?
                (<button className="btn btn-info btn-sm w-100 user-select-none" onClick={() => updateSelectedTree(index)} style={{'backgroundColor':'#5e4fea'}}><p className="d-inline m-5">Current Tree</p></button>) :
                (index == 0 ?
                  (<button className="btn btn-primary btn-sm w-100" onClick={() => updateSelectedTree(index)}><p className="d-inline m-5">Default Tree</p></button>) :
                  (<>
                    <button className="btn btn-primary btn-sm px-0 w-100" onClick={() => updateSelectedTree(index)}>
                      <p className="d-inline m-8">Tree - v{index}</p>
                    </button>
                    <span onClick={() => removeSelectedTree(index)} data-kt-button="true" data-bs-toggle="tooltip" data-bs-placement="top" title={"remove"} className={"position-relative svg-icon-primary"} style={{ 'top': '-9px', 'left': '-33px' }}>
                      <KTSVG path="\media\icons\turing\rejectedCross.svg" className="svg-icon-2x  ms-3"></KTSVG>
                    </span>
                  </>)
                )
              }
            </ul>
          </>)
        })}
      </div>
    </>
  )
}

export default (TreeList);