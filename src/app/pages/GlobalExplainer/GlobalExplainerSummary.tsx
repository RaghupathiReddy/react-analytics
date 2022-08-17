import React from "react";
import { ModelResultCard } from "../../components/cards/ModelResultCard/ModelResultCard";
import { GlobalExplainerTiles } from "./GlobalExplainerModel";


type ModelResultCardListProps = {
  cardData: GlobalExplainerTiles[];
};

export const GlobalExplainerCardList: React.FC<ModelResultCardListProps> = (props) => {
  const { cardData } = props;

  const iconSize = 3;
  return (
    <div className="row pe-none">
      {cardData.length > 0
        ? cardData.map((el) => (
          <div className="col-md">
            <ModelResultCard
              themeColor="primary"
              size={iconSize}
              iconPath={`/media/icons/turing/${el.property}.svg`}
              title={el.property === "auc" ? "AUC" : el.property === "f1" ? "F1 Score" : el.property}
              value={`${typeof (el.value) != "number" ? el.value : el.value.toFixed(2)}`}
            />
          </div>

        ))
        : <div className="col-md-6 ">
          <ModelResultCard
            themeColor="primary"
            size={iconSize}
            iconPath={`/media/icons/turing/auc.svg`}
            value=" "
            title=" "
          />
        </div>}
    </div>
  );
};