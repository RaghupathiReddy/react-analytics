import { Link } from "react-router-dom";
import "../Tables/single-line.scss";
import "./style.scss";

const Header: React.FC<HeaderProps> = ({
    title,
    children,
    backURL
}) => (
    <>
        <hr />
        <div className="line-parent container">
            {
                backURL && 
                    <Link to={backURL} >
                        <img
                            src={'/media/icons/duotune/arrows/arr063.svg'}
                            alt="back-arrow-icon"
                            className="back-icon"
                        />
                    </Link>
            }


            <div className="line-child page-title">{title}</div>
            <div className="line-child float-right">
                {children}
            </div>
        </div>
        <hr />

    </>
);

export default Header;

type HeaderProps = {
    title: string,
    backURL?: string,
};