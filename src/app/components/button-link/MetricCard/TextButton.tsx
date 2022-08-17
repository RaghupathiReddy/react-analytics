import "./style.css";


const TextButton = (props: ButtonProps) => {
    return <button onClick={props.onClick}
                 className='link-text' > {props.children} </button> 
}

export default TextButton;
 
interface ButtonProps {
    children: React.ReactNode;
    onClick: () => void;
} 
 