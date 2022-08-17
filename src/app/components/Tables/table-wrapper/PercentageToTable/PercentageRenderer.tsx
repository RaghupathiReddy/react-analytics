export const PercentageRenderer = (props:any) => {
   const impactWithoutPercentage = props.value;
   let color=""
    if (impactWithoutPercentage<=-0.10 || impactWithoutPercentage >= 0.10 ) {
      color = "text-danger";
    } else {
      color = "text-dark";
    }

    let impactWithPercentage = impactWithoutPercentage +" %"
    return (
       
      
      <div className={`position-absolute ${color} font-weight-bolder`}>
        {impactWithPercentage}
      </div>
    );
}
