import { KTSVG } from "../../../../_metronic/helpers";
import { CardsProps } from "../../../Models/CardModels";

export const ModelResultCard: React.FC<CardsProps> = (props) => {
  const { themeColor, size, iconPath, title, value } = props;
 
 
  return (
    <div className="card-body card shadow-sm bg-white bg-hover-light-primary" role="button">
      <div className="d-flex align-items-center ">
        <div className="symbol symbol-50px me-3">
          <span className={`symbol-label bg-light-${themeColor}`}>
            <KTSVG
              path={iconPath}
              className={`svg-icon-${size}x svg-icon-${themeColor}`}
            />
          </span>
        </div>
        <div className="d-flex flex-column">
          <b>{value}</b>
          <span className="text-muted fw-bold">{title}</span>
        </div>
      </div>
    </div>
  );
};
