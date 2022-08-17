import { ICellRendererParams } from "ag-grid-community";

export default function ProgressBarRenderer(props: ICellRendererParams) {
  const progress = parseFloat(props.value)
  let barWidth = Math.abs(progress) * 100;
  let roundedValue = progress.toFixed(2);;
  let color = "";
  let negativeColor = "#D6A96B"; //Crayola
  let positiveColor = "#6E8FAA"; // Shadow Blue
  if (progress < 0) {
    color = negativeColor;
  } else {
    color = positiveColor;
  }
  return (
    <div>
      <div
        className="bar-direction"
        style={{
          width: barWidth + "%",
          height: "100%",
          position: "absolute",
          backgroundColor: ` ${color}`,
        }}
      />
      <div className="position-absolute font-weight-bolder text-dark">
        {roundedValue}
      </div>
    </div>
  );
}
