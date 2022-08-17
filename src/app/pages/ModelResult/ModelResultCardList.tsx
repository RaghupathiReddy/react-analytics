import React from "react";
import { RemovedBiasTableColumn } from "../../Models/ModelResultModel";
import { ModelResultCard } from "../../components/cards/ModelResultCard/ModelResultCard";

type ModelResultCardListProps = {
  claimBiasDataCards: RemovedBiasTableColumn[];
  setCardValue:(value: string) => void;
};

export const ModelResultCardList: React.FC<ModelResultCardListProps> = (props) => {
  const { claimBiasDataCards,setCardValue } = props;
  const iconList = [
    "/media/icons/duotune/technology/teh003.svg",
    "/media/icons/duotune/general/gen005.svg",
    "/media/icons/turing/auc.svg",
    "/media/icons/turing/precision.svg",
    "/media/icons/duotune/technology/teh003.svg",
    "/media/icons/duotune/general/gen005.svg"
  ]

  const iconSize = 3;
  return (
    <div className="row ">
      {
        claimBiasDataCards?((claimBiasDataCards).map((el,i)=>
        <div className="col-md py-1 " onClick={()=>setCardValue(el.KPI)}>
          <ModelResultCard
            themeColor="primary"
            size={iconSize}
            iconPath={iconList[i]}
            title={el.KPI}
            value={`${el.values}`}
          />
          </div>
       )):("")
        }
       
    </div>
  );
};
