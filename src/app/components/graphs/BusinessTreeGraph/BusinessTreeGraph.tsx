import clsx from 'clsx';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Accordion } from 'react-bootstrap';
import Tree from 'react-d3-tree';

import { Col, Container, Row } from 'reactstrap';
import { KTSVG } from '../../../../_metronic/helpers';
import { Filter, NodeDatum, FilterCriteria, SelectedNode } from '../../../Models/TreeGraphModels';
import TreeList from './TreeList';

interface NetworkGraphProps {
  dataset: any;
  treeFilter: Filter[]; 
  treedata: NodeDatum[];
  updateBusinessTree : (newBusinessTreeData: NodeDatum, shouldNavigate : boolean)=>void;
  updateSelectedNodes : (selectedNodes:SelectedNode[])=>void;
}
const BusinessTreeGraph = forwardRef((props:NetworkGraphProps,ref) => {
  //useState nodeName
  const [nodeName, setNodeName] = useState<null | string>(null);
  const [nodeAttributes, setNodeAttributes] = useState<any>(null);
  const [treeStructureData, setTreeStructureData] = useState<NodeDatum[]>(JSON.parse(JSON.stringify(props.treedata))); 
  const [showFilter,setShowFilter] = useState(false);
  const defaulNodeColor = "white";
  const selectedNodeColor = "#2c3088";

  useImperativeHandle(ref,()=>(
    (nodeID: string) => {
      const updatedTreeStructure = getWithSelectedNodeColor(treeStructureData[0],nodeID)
      setTreeStructureData([updatedTreeStructure])
  }))

  const filterNodeDataset = (node: NodeDatum, filterCriteria: FilterCriteria) => {
    let filteredValues: Array<object> = [];
    let filteredOutValues: Array<object> = [];
    node.nodeData?.filter((data) => {
      if (!isNaN(parseFloat(filterCriteria.filterCriteria))) {
        if (eval(data[filterCriteria.filterKey] + filterCriteria.filterCondition + filterCriteria.filterCriteria)) {
          filteredValues.push(data)
        } else {
          filteredOutValues.push(data)
        }
      } else {
        if (filterCriteria.filterCondition === "==" && data[filterCriteria.filterKey] === filterCriteria.filterCriteria) {
          filteredValues.push(data)
        } else if (filterCriteria.filterCondition === "!=" && data[filterCriteria.filterKey] !== filterCriteria.filterCriteria) {
          filteredValues.push(data)
        } else {
          filteredOutValues.push(data)
        }
      }
    })
    return { filteredValues, filteredOutValues }
  }
  const getNode = (nodeName : string,filterName:string,dataset:Array<object>,nodeResult:boolean):NodeDatum => {
    let node: NodeDatum = {
      name: nodeName,
      attributes: {
        name: filterName,
        resultOfCondition: nodeResult,
        isSelected: false
      },
      nodeData: dataset,
      nodeDisplayData: {
        "bias": "10",
        "prob": 0.001
      }
    }
    return node;
  }
  const getNodeWithFilter = (node:NodeDatum,filter : FilterCriteria) => {
    if(node.attributes){
      node.attributes.filterKey = filter.filterKey;
      node.attributes.filterCondition = filter.filterCondition;
      node.attributes.filterCriteria = filter.filterCriteria;
    }
    return node;
  }
  const constructBinaryTree = (treeStructure:NodeDatum) : NodeDatum=>{
    if(treeStructure.name==="root"){
      treeStructure.nodeData = props.dataset;
      if(treeStructure.attributes)
        treeStructure.attributes.isSelected = false
    }
    if(treeStructure.children && treeStructure.nodeData && 
      treeStructure.attributes && treeStructure.attributes.filterKey && 
      treeStructure.attributes.filterCriteria && treeStructure.attributes.filterCondition){

      const selectedCriteria: FilterCriteria = {
        filterKey: treeStructure.attributes.filterKey.toString(),
        filterCondition: treeStructure.attributes.filterCondition.toString(),
        filterCriteria: treeStructure.attributes.filterCriteria.toString()
      }
      const {filteredValues,filteredOutValues} = filterNodeDataset(treeStructure,selectedCriteria)
      let leftNode:NodeDatum = getNode(treeStructure.children[0].name,selectedCriteria.filterKey,filteredValues,true)
      let rightNode:NodeDatum= getNode(treeStructure.children[1].name,"non-"+selectedCriteria.filterKey,filteredOutValues,false)
      
      if(treeStructure.children[0].children){
        leftNode.children = JSON.parse(JSON.stringify(treeStructure.children[0].children))
      }
      if(treeStructure.children[1].children){
        rightNode.children = JSON.parse(JSON.stringify(treeStructure.children[1].children))
      }
      if (leftNode.attributes && treeStructure.children[0].attributes && 
        treeStructure.children[0].attributes.filterKey && treeStructure.children[0].attributes.filterCriteria && 
        treeStructure.children[0].attributes.filterCondition) {

        const leftNodeCriteria: FilterCriteria = {
          filterKey: treeStructure.children[0].attributes.filterKey.toString(),
          filterCondition: treeStructure.children[0].attributes.filterCondition.toString(),
          filterCriteria: treeStructure.children[0].attributes.filterCriteria.toString()
        }
        leftNode = getNodeWithFilter(leftNode, leftNodeCriteria)
        leftNode = constructBinaryTree(leftNode)
      }
      if (rightNode.attributes && treeStructure.children[1].attributes &&
        treeStructure.children[1].attributes.filterKey && treeStructure.children[1].attributes.filterCriteria &&
        treeStructure.children[1].attributes.filterCondition) {

        const rightNodeCriteria: FilterCriteria = {
          filterKey: treeStructure.children[1].attributes.filterKey.toString(),
          filterCondition: treeStructure.children[1].attributes.filterCondition.toString(),
          filterCriteria: treeStructure.children[1].attributes.filterCriteria.toString()
        }
        rightNode = getNodeWithFilter(rightNode, rightNodeCriteria)
        rightNode = constructBinaryTree(rightNode)
      }
      treeStructure.children = [leftNode, rightNode];
    }
    return treeStructure;
  }
  
  useEffect(()=>{
    let treeStructure = JSON.parse(JSON.stringify(props.treedata))[0]
    setTreeStructureData([constructBinaryTree(treeStructure)]);
  }, [props.treedata])

  function handleFilter(selectedNodeName:string, filterCriteria: FilterCriteria) {
    let newBinaryTreeData = treeStructureData;
    newBinaryTreeData[0] = getTreeWithChildren(treeStructureData[0], selectedNodeName,filterCriteria);
    setTreeStructureData([newBinaryTreeData[0]]);
    updateselectedNodes();
  }

  function getTreeWithChildren(node: NodeDatum, selectedNodeName: string,filterCriteria: FilterCriteria): NodeDatum {
    if (node.name === selectedNodeName) {
      node = getNodeWithChildren(node, filterCriteria);
      return node;
    }
    else {
      if (node.children) {
        const newChildren: NodeDatum[] = [];
        node.children.forEach(child => {
          let newChild = getTreeWithChildren(child, selectedNodeName,filterCriteria);
          newChildren.push(newChild);
        });
        node.children = newChildren;
      }
      return node;
    };
  }
  let allNodeAppliedFilters: { nodeName: string; filter: FilterCriteria }[] = [];
  let selectedNodes : string[]=[];
  const getAppliedFiltersAndSelectedNodes = (node:NodeDatum)=>{
    if(node.name=='root'){
      allNodeAppliedFilters = [];
    }
    if (node.attributes && node.attributes.isSelected)
      selectedNodes.push(node.name)
    if (node.attributes && node.attributes.filterKey && node.attributes.filterCondition && node.attributes.filterCriteria) {
      allNodeAppliedFilters.push({
        nodeName: node.name,
        filter: {
          filterKey: node.attributes.filterKey.toString(),
          filterCondition: node.attributes.filterCondition.toString(),
          filterCriteria: node.attributes.filterCriteria.toString()
        }
      })
    }
    if(node.children && node.children.length > 0){
      getAppliedFiltersAndSelectedNodes(node.children[0])
      getAppliedFiltersAndSelectedNodes(node.children[1])
    }
  }
  const reverseComparator = (comparator:string) => {
    switch (comparator) {
      case "==":
        return "!=";
      case "!=":
        return "==";
      case ">=":
        return "<=";
      case "<=":
        return ">=";
      case ">":
        return "<";
      case "<":
        return ">";
      default:
        return comparator;
    }
  }
  const getfilerofnodeAttributes = (nodeName:string,nodeResultOnFilter:boolean)=>{
    let nodeFilter: FilterCriteria|null = null
    allNodeAppliedFilters.forEach((node)=>{
      if(node.nodeName == nodeName){
        nodeFilter = JSON.parse(JSON.stringify(node.filter));
        if(!nodeResultOnFilter && nodeFilter && nodeFilter.filterCondition){
          nodeFilter.filterCondition=reverseComparator(nodeFilter.filterCondition)
        }
      }
    })  
    return nodeFilter;
  }
  const getAllFiltersForNode = (nodeName: string) => {
    let name = nodeName;
    let nodeFilters: any[] = []
    let parentnode = nodeName.split('_').slice(0, nodeName.split('_').length - 1).toString().replaceAll(',','_')
    while (parentnode.length > 3) {
      const nodeResultOnFilter = name[name.length-1] == "1"
      nodeFilters = [...nodeFilters, getfilerofnodeAttributes(parentnode,nodeResultOnFilter)]
      name = name.split('_').slice(0, name.split('_').length - 1).toString().replaceAll(',', '_')
      parentnode = parentnode.split('_').slice(0, parentnode.split('_').length - 1).toString().replaceAll(',', '_')
    }
    return nodeFilters;
  }

  const saveCurrentTreeStructure =(shouldNavigate:boolean)=>{
    const currentTreeStructure =JSON.parse(JSON.stringify(treeStructureData[0]))
    const finalTreeStructure = removeNodeDataset(currentTreeStructure);
    props.updateBusinessTree(finalTreeStructure,shouldNavigate)
  }

  const removeNodeDataset = (tree: NodeDatum): NodeDatum => {
    if (tree.nodeData) {
      delete tree.nodeData
    }
    if (tree.children && tree.children.length>0) {
      const leftNode: NodeDatum = removeNodeDataset(tree.children[0])
      const rightNode: NodeDatum = removeNodeDataset(tree.children[1])
      tree.children = [ leftNode,rightNode];
    }
    return tree;
  }

  const getNodeWithChildren = (parentNode: NodeDatum, filterCriteria: FilterCriteria): NodeDatum => {
    const {filteredValues,filteredOutValues}=filterNodeDataset(parentNode,filterCriteria)
    const leftNode:NodeDatum = getNode(parentNode.name+"_1",filterCriteria.filterKey,filteredValues,true)
    const rightNode:NodeDatum= getNode(parentNode.name+"_2","non-"+filterCriteria.filterKey,filteredOutValues,false)
      
    if (parentNode.attributes) {
      parentNode.attributes.filterKey = filterCriteria.filterKey
      parentNode.attributes.filterCondition = filterCriteria.filterCondition
      parentNode.attributes.filterCriteria = filterCriteria.filterCriteria
    }
    parentNode.children = [leftNode, rightNode];
    return parentNode;
  }
  const hideFilter = () =>{
    setShowFilter(false)
  }
  const updateselectedNodes = () => {
    getAppliedFiltersAndSelectedNodes(JSON.parse(JSON.stringify(treeStructureData[0])))
      let selectedNodeFilters: SelectedNode[] = [];
      selectedNodes.forEach((nodename) => {
        const nodeFilters = getAllFiltersForNode(nodename)
        let node: SelectedNode = { nodeName: nodename, filters: nodeFilters };
        selectedNodeFilters.push(node)
      })
      props.updateSelectedNodes(selectedNodeFilters)
  }

  const getWithSelectedNodeColor = (node:NodeDatum,nodeID:string) => {
    if (node.name === nodeID) {
      if (node.attributes && !node.attributes.isSelected) {
        node.attributes.isSelected = true
      } else if (node.attributes) {
        node.attributes.isSelected = false
      }
      updateselectedNodes();
      return node;
    } else {
      if (node.children) {
        const newChildren: NodeDatum[] = [];
        node.children.forEach(child => {
          let newChild = getWithSelectedNodeColor(child, nodeID);
          newChildren.push(newChild);
        });
        node.children = newChildren;
      }
      return node;
    }
  }

  const handleNodeClick = (nodeData:NodeDatum)=>{
    setNodeName(nodeData.name);
    setShowFilter(true);
    setNodeAttributes(nodeData.attributes)
    setTreeStructureData([getWithSelectedNodeColor(treeStructureData[0],nodeData.name)])
  }

  const getNodeColor = (nodeData:NodeDatum)=>{
    if(nodeData.attributes && nodeData.attributes.isSelected){
      return selectedNodeColor;
    } else if(nodeData.attributes ){
      return defaulNodeColor;
    }
  }
  const nodeSize = { x: 200, y: 120 };
  const foreignObjectProps = { width: nodeSize.x, height: nodeSize.y, x: -100  ,y:-50};
  const conditionForeignObjectProps = { width: nodeSize.x, height: nodeSize.y, x: -100  ,y:80};
  const resultForeignObjectProps = { width: 50, height: 30, x: 50  ,y:-90};
  const resultForeignObjectProps2 = { width: 50, height: 30, x: -80 ,y:-90};
  const renderForeignObjectNode = ({
    nodeDatum,
  }:any) => (
    
    <g>
      <circle r={8}></circle>
      <foreignObject {...foreignObjectProps} onClick={()=>{handleNodeClick(nodeDatum);}} style={{zIndex:1000}}>
        <div style={{ border: "2px solid #2c94e0", backgroundColor: getNodeColor(nodeDatum), width:"100%",height:"100%",borderRadius:"15px" }} >
          <h4 style={{ textAlign: "center" }} className={clsx(
            'mb-2 mt-2',
            { 'text-inverse-primary': getNodeColor(nodeDatum) == selectedNodeColor }
          )}>{nodeDatum.attributes.name}</h4>
            <h4 style={{ textAlign: "center" }} className={clsx(
              'mb-2 mt-2',
              { 'text-inverse-primary': getNodeColor(nodeDatum) == selectedNodeColor }
            )}>{nodeDatum.nodeData ? nodeDatum.nodeData.length : 10}</h4>
          <hr className='m-0' style={{ "color": "white" }}></hr>
          {Object.keys(nodeDatum.nodeDisplayData).map((comparisonSymbol: string) => {
            return <h4 style={{ textAlign: "center" }} className={clsx(
              'mb-2 mt-2',
              { 'text-inverse-primary': getNodeColor(nodeDatum) == selectedNodeColor }
            )}>{comparisonSymbol} : {nodeDatum.nodeDisplayData[comparisonSymbol]}</h4>
          })}
        </div>
      </foreignObject>
      {nodeDatum.name &&
        <foreignObject {...conditionForeignObjectProps} >
          <div>
            <p style={{ textAlign: "center", fontSize:15}}>{nodeDatum.attributes.filterKey}{nodeDatum.attributes.filterCondition}{nodeDatum.attributes.filterCriteria}</p>
          </div>
        </foreignObject>
      }
      {nodeDatum.attributes.resultOfCondition && nodeDatum.name !== "root" &&
        <foreignObject {...resultForeignObjectProps} >
          <div>
            <p style={{ textAlign: "center", fontSize: 15 }}>Yes</p>
          </div>
        </foreignObject>
      }
      {!nodeDatum.attributes.resultOfCondition && nodeDatum.name !== "root" &&
        <foreignObject {...resultForeignObjectProps2} >
          <div>
            <p style={{ textAlign: "center", fontSize: 15 }}>No</p>
          </div>
        </foreignObject>
      }
    </g>
  );
  return (
    <Container>
      <Row>
        <Col>
          <div className="card">
            <div id="treeWrapper" style={{ height: '45em' }}>
              <Tree 
                separation = {{ siblings : 3,nonSiblings:3}}
                pathFunc="diagonal" 
                orientation='vertical' 
                data={treeStructureData} 
                renderCustomNodeElement={(rd3tProps) =>
                  renderForeignObjectNode({ ...rd3tProps })
                }
                zoom={0.55}
                translate={{x: window.innerWidth *0.4,y: window.innerHeight *0.2}} />
            </div>
          </div>

        </Col>
        {showFilter &&
          <Col xs={2} className='px-0 position-absolute end-0 me-8 mt-5'>
            <FilterSelection runFilterOnNode={handleFilter} nodeName={nodeName} hideFilter={hideFilter} nodeAttributes={nodeAttributes} filters={props.treeFilter} saveCurrentTreeStructure={saveCurrentTreeStructure}/>
          </Col>
        }
      </Row>
    </Container>
  );
})
const SelectFilter = (props:any) => {
  const {filterName,optionArray,selectedOption,setSelectedFilterValue,setIsFilterChangd}=props
  return (<>
    
    <div className='mb-3'>
      <label className="m-1"><span>{filterName} :</span></label>
      <select
        className='form-select form-select-sm form-select-solid d-inline bg-gray-200'
        value={selectedOption}
        style={{'width':'fit-content'}}
        onChange={(e) => { setSelectedFilterValue(e.target.value); setIsFilterChangd(true) }}
      >
        {optionArray.map((feature: string) => {
          return <option key={feature} value={feature} selected={feature === selectedOption}>{feature}</option>
        })}
      </select>
    </div>
  </>)
}

const FilterSelection = (props: any) => {
  const { nodeName , nodeAttributes , saveCurrentTreeStructure , filters } = props;
  let featureNames:Array<string> = [];
  filters.map((filter:Filter)=>{
    featureNames.push(filter.filterName)
  })
  const [selectedFeature, setSelectedFeature] = useState<string>(nodeAttributes.filterKey);
  const [selectedComparator, setSelectedComparator] = useState<string>(nodeAttributes.filterCondition);
  const [selectedValue, setSelectedValue] = useState<string|number>(nodeAttributes.filterCriteria);
  const [selectValuesFilter,setSelectValuesFilter] = useState<Array<string|number>>([])
  const [selectComparatorFilter,setselectComparatorFilter] = useState<Array<string>>([])
  const [isFilterChanged,setIsFilterChangd] = useState(false);
  const [isMinimized,setIsMinimized] = useState(false);

  const selectedQuery =  selectedFeature + " "  + selectedComparator + " " + selectedValue;
  const updateComparisionAndValueFilter = ()=>{
    filters.forEach((filter:Filter)=>{
      if (filter.filterName === selectedFeature) {
        let comparatorsArray = ["==","!="];
        if (!filter.isCategoricalData) {
          comparatorsArray = ["==", "!=", ">", "<", ">=", "<="]
        }
        setselectComparatorFilter(comparatorsArray)
        setSelectValuesFilter(filter.isCategoricalData ? filter.filterValues : [])
        if (!isFilterChanged) {
          if (nodeAttributes.filterKey !== undefined) {//parent nodes condition
            setSelectedComparator(nodeAttributes.filterCondition)
            setSelectedValue(nodeAttributes.filterCriteria)
          } else {//leaf nodes condition
            setSelectedComparator(comparatorsArray[0])
            setSelectedValue(filter.isCategoricalData ? filter.filterValues[0] : 0)
          }
        }else{
          setSelectedComparator(comparatorsArray[0])
          setSelectedValue(filter.isCategoricalData ? filter.filterValues[0] : 0)
        }
      }
    })
  }
  useEffect(()=>{
    if(nodeAttributes.filterKey === undefined){
      setSelectedFeature(featureNames[0])
    }else{
      setSelectedFeature(nodeAttributes.filterKey)
    }
    setIsFilterChangd(false)
  },[nodeName])
  useEffect(()=>{
    updateComparisionAndValueFilter()
  },[selectedFeature,nodeName])//given nodeName - same feature can be with 2 nodes may not have same value
  const runFilter = () => {
    const selectedCriteria : FilterCriteria = {
      filterKey:selectedFeature,
      filterCondition:selectedComparator,
      filterCriteria:selectedValue.toString()
    }
    props.runFilterOnNode(nodeName, selectedCriteria);
  }


  return (
      <div className={"card pb-5 p-2"} style={{'backgroundColor':'white','boxShadow':'1px 3px 17px rgb(208 110 110 / 20%)'}}>
        {
          nodeAttributes && <div className='d-flex justify-content-center align-items-center mt-2 mx-2'>
            <span
            onClick={() => { setIsMinimized(!isMinimized) }}
            data-kt-button="true"
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            className={'z-index-1 p-0 opacity-75 position-relative'}
            style={{'top':'-10px','left':'-18px'}}
            title={isMinimized ? "Expand":"Collapse"}>
            {isMinimized ? (<KTSVG path="\media\icons\turing\expand.svg" className="svg-icon-2x "></KTSVG>):(<KTSVG path="\media\icons\turing\collapse.svg" className="svg-icon-2x "></KTSVG>)}
          </span>
            <span>
              Name of the node: {nodeAttributes.name}
            </span>
          </div>
        }
        <div className={clsx( {
          'hide':isMinimized,
        })}>
        <div className='px-2 mt-2'>
          <SelectFilter filterName={"Feature"} optionArray={featureNames} selectedOption={selectedFeature} setSelectedFilterValue={setSelectedFeature} setIsFilterChangd={setIsFilterChangd} />

          <SelectFilter filterName={"Comparison"} optionArray={selectComparatorFilter} selectedOption={selectedComparator} setSelectedFilterValue={setSelectedComparator} setIsFilterChangd={setIsFilterChangd} />
          
          {selectValuesFilter.length > 0 &&
            <SelectFilter filterName={"Value"} optionArray={selectValuesFilter} selectedOption={selectedValue} setSelectedFilterValue={setSelectedValue} setIsFilterChangd={setIsFilterChangd} />
          }
          {selectValuesFilter.length === 0 &&
            <div className='mb-3'>
              <label className="m-1"><span>Value :</span></label>
              <input type="text" className='form-control form-control-sm d-inline bg-gray-200' style={{'width':'fit-content'}} value={selectedValue} onChange={(e) => { setSelectedValue(e.target.value); setIsFilterChangd(true) }} />
            </div>
          }
        </div>
        <div className='px-2 mt-2'>
          <span> The filter is : {selectedQuery}</span>
        </div>
        <button className="btn btn-primary btn-sm mt-2 mx-2" onClick={runFilter} >
          Apply Filter
        </button>
        <hr></hr>
        <div className='mx-1'>
          <button className="btn btn-primary btn-sm ms-1" onClick={()=>{saveCurrentTreeStructure(false)}} >
            Save
          </button>
          <button className="btn btn-secondary btn-sm ms-1 float-end" onClick={()=>{saveCurrentTreeStructure(true)}} >
            Save and Continue
          </button>
        </div>
        </div>
      </div>
  )
}

export default BusinessTreeGraph;