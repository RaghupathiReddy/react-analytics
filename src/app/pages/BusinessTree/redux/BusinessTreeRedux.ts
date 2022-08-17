import {Action} from '@reduxjs/toolkit'
import { BinaryTreeData, NodeDatum, SelectedNode } from '../../../Models/TreeGraphModels'

export interface ActionWithPayload<T> extends Action {
  payload: T
}

export const actionTypes = {
  UpdateTreeData: '[UpdateTreeData] Action',
  UpdateSelectedNode: '[UpdateSelectedNode] Action',
  DeleteSelectedTree: '[DeleteSelectedTree] Action',
  UpdateSelectedTreeIndex: '[UpdateSelectedTreeIndex] Action'
}

interface BinaryTreeCollection {
  binaryTreeDataList: BinaryTreeData[],
  selectedNodes : SelectedNode[],
  selectedTreeIndex?:number,
  currentTreeIndex:number
}

export const initialTreeState: BinaryTreeCollection = {
  binaryTreeDataList: [],
  selectedNodes: [],
  currentTreeIndex:0
};

export const BusinessTreeReducer = (state: BinaryTreeCollection = initialTreeState, action: ActionWithPayload<BinaryTreeCollection>)=>{
  switch (action.type) {
    case actionTypes.UpdateTreeData: {
      if(state.binaryTreeDataList === initialTreeState.binaryTreeDataList)
        return {...state,binaryTreeDataList: [action.payload.binaryTreeDataList]}
      else
        return {...state,binaryTreeDataList: [...state.binaryTreeDataList, action.payload.binaryTreeDataList]};
    }
    case actionTypes.UpdateSelectedNode: {
      if (action.payload.selectedNodes.length == 0)
        return { ...state, selectedNodes: [] }
      if (state.selectedNodes === initialTreeState.selectedNodes)
        return { ...state, selectedNodes: [action.payload.selectedNodes] }
      else
        return { ...state, selectedNodes: [...state.selectedNodes, action.payload.selectedNodes] };
    }
    case actionTypes.DeleteSelectedTree: {
      if(state.binaryTreeDataList.length > 0 && action.payload.selectedTreeIndex){
        let currentTreeList = [...state.binaryTreeDataList];
        let updatedTreeList = currentTreeList.slice(0,action.payload.selectedTreeIndex).concat(currentTreeList.slice(action.payload.selectedTreeIndex+1,currentTreeList.length))
        return {...state,binaryTreeDataList:updatedTreeList }
      }
      return {...state}
    }
    case actionTypes.UpdateSelectedTreeIndex: {
      return {...state,currentTreeIndex:action.payload.currentTreeIndex}
    }
    default:
      return state
  }
}


export const actions = {
  updateTreeData: (binaryTreeDataList: BinaryTreeData) => ({type: actionTypes.UpdateTreeData, payload: {binaryTreeDataList}}),
  updateSelectedNodes: (selectedNodes: SelectedNode[]) => ({type: actionTypes.UpdateSelectedNode, payload: {selectedNodes}}),
  deleteSelectedTree: (selectedTreeIndex: number) => ({type: actionTypes.DeleteSelectedTree, payload: {selectedTreeIndex}}),
  UpdateSelectedTreeIndex: (currentTreeIndex: number) => ({type: actionTypes.UpdateSelectedTreeIndex,payload:{currentTreeIndex}})
}
