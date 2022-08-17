import { ClipLoader } from 'react-spinners'

const PageLoader = (props: LoaderProps) => {
    const { color, isLoading, message } = props;
    
    return (
        <div>
            <div className="d-flex flex-center h-200">
                <ClipLoader color={color} loading={isLoading} size={100} />
            </div>
            {message &&
                <div className='d-flex flex-center'>
                    <h3> {message} </h3>
                </div>
            }
        </div>
    );
}

PageLoader.defaultProps = {
    color: '#009ef7',
    isLoading: true
}

export default PageLoader;

interface LoaderProps {
    color: string
    isLoading: boolean
    message?: string
}
