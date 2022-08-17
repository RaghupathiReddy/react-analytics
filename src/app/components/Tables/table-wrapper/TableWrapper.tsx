import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import './style.scss';

// this wrapper add the table theme to ag-grid table

const TableWrapper: React.FC<WrapperProps> = ({
    height,
    children,
    width,
    heading
}) =>{

 return (
        <div className="ag-theme-balham" style={{ height: height, width: width }}>
            {heading && <p>{heading}</p>}
            {children}
        </div>
     );
    }


export default TableWrapper;

// use the below default values of height & weight to keep the table responsive
TableWrapper.defaultProps = {
    height: '100%',
    width: '100%',
}

interface WrapperProps{
    height?: number | string;
    width?: number | string;
    heading?: string;
}