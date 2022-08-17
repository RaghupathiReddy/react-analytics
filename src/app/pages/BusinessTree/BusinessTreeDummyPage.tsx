import React, { useEffect, useRef, useState } from "react";
import {useDispatch, connect} from 'react-redux'
import { useNavigate, useParams } from "react-router-dom";
import { PageTitle } from "../../../_metronic/layout/core";
import BusinessTreeGraph from "../../components/graphs/BusinessTreeGraph/BusinessTreeGraph";
import SelectedNodeList from "../../components/graphs/BusinessTreeGraph/SelectedNodeList";
import TreeList from "../../components/graphs/BusinessTreeGraph/TreeList";
import Header from "../../components/header";
import PageLoader from "../../components/loaders/PageLoader";
import {Filter, NodeDatum, BinaryTreeData,SelectedNode} from "../../Models/TreeGraphModels"
import { ErrorsPage } from "../../modules/errors/ErrorsPage";
import { getBuisnessTree, updateBuisnessTree } from "./BusinessTreeCRUD";
import { actions,initialTreeState } from './redux/BusinessTreeRedux'

const BusinessTreeDummyPage: React.FC<{binaryTreeDataList: BinaryTreeData[],currentTreeIndex:number}> = ({binaryTreeDataList,currentTreeIndex}) => {
  const { projectId } = useParams<string>();
  const [ selectedTree, setSelectedTree] = useState<BinaryTreeData>();
  const [ isLoaded, setIsLoaded] = useState(false);
  const [selectedNodes,setSelectedNodes] = useState<SelectedNode[]>()
  const businessTreeRef = useRef<(nodeID:string)=>void>(null);
  const dispatch = useDispatch()
  const createNewBusinessTreeVersion = (newBusinessTreeVersion:NodeDatum)=>{
  }
  let navigate = useNavigate();

  const navigateToLocal = () => {
    navigate(`/localExplainer/${projectId}`);
  }

  const updateBusinessTree = (newBusinessTreeData: NodeDatum, shouldNavigate: boolean) => {
    if (projectId) {
      updateBuisnessTree(projectId, newBusinessTreeData).then((response) => {
        let api_response = response.data;
        dispatch(actions.updateTreeData(api_response.data))
        if (selectedNodes)
          dispatch(actions.updateSelectedNodes(selectedNodes))
      })
      dispatch(actions.UpdateSelectedTreeIndex(binaryTreeDataList.length))
      if (shouldNavigate)
        navigateToLocal()
    }
  }
  
  const removeSelectedTree = (index:number)=>{
    dispatch(actions.deleteSelectedTree(index))
  }
  const updateSelectedTree = (index: number) => {
    setSelectedTree(binaryTreeDataList[index]);
    setSelectedNodes([])
    dispatch(actions.UpdateSelectedTreeIndex(index))
  }
  const updateSelectedNodes = (selectedNodes:SelectedNode[]) => {
    setSelectedNodes(selectedNodes)
  }
  useEffect(() => {
    if(projectId)
    {
      const isDataAvailable =
      binaryTreeDataList !== initialTreeState.binaryTreeDataList;
      if (!isDataAvailable) {
        getBuisnessTree(projectId)
          .then((response) => {
            let api_response = response.data;
            dispatch(actions.updateTreeData(api_response.data));
            dispatch(actions.updateSelectedNodes([]));
            setSelectedTree(api_response.data);
            setIsLoaded(true)
          })
          .catch((error) => {
            console.log(error);
            setIsLoaded(true)
          });
      } else {
        setSelectedTree(binaryTreeDataList[currentTreeIndex]);
        setIsLoaded(true)
      }
    }
  }, [projectId]);

  if (!isLoaded) {
    return <PageLoader />;
  }

  const removeSelectedNode=(nodeID:string)=>{
    businessTreeRef.current?.(nodeID)
  }

  return (
    <>
      <PageTitle
        element={
          <Header title="Binary Tree">
          </Header>
        }
      />
      { selectedTree && selectedTree.treeGraphData ?
        <>
          <div className="position-absolute ps-3 pt-3">
            <div className='card mh-250px z-index-3 m-2 p-2 scroll' style={{'backgroundColor':'white','boxShadow':'1px 3px 17px rgb(208 110 110 / 20%)'}}>
              <TreeList currentTreeIndex={currentTreeIndex} treeList={binaryTreeDataList} updateSelectedTree={updateSelectedTree} removeSelectedTree={removeSelectedTree}></TreeList>
            </div>
            {selectedNodes && selectedNodes.length > 0 && <div className='card mh-250px z-index-3 m-2 p-2 scroll top-50' style={{'backgroundColor':'white','boxShadow':'1px 3px 17px rgb(208 110 110 / 20%)'}}>
              <SelectedNodeList nodeList={selectedNodes} removeSelectedNode={removeSelectedNode}></SelectedNodeList>
            </div>
            }
          </div>
          
          <BusinessTreeGraph ref={businessTreeRef} treedata={selectedTree.treeGraphData} dataset={selectedTree.dataset} treeFilter={selectedTree.filter} updateBusinessTree={updateBusinessTree} updateSelectedNodes = {updateSelectedNodes}/>
        </>
        :
        <ErrorsPage message={'Business Tree records not found!'}></ErrorsPage>
      }
  </>
  )
}

function mapState(state: any){
  const { binaryTreeDataList,currentTreeIndex } = state.businessTree
  return { binaryTreeDataList,currentTreeIndex}
}
export default connect(mapState)(BusinessTreeDummyPage);