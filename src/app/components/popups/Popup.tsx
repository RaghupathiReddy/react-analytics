import { KTSVG } from '../../../_metronic/helpers';
import './style.css';

const Popup = (props: any) => {
    return (
        <div className='popup-backdrop'>
            <div className='popup'>

                    <div className='modal-header'>
                        <h2>Terms And Conditions</h2>

                        <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={props.closePopup}>
                        <KTSVG path='/media/icons/duotune/arrows/arr061.svg' className='svg-icon-1' />
                        </div>
                    </div>      
                    <div className='modal-body py-lg-10 px-lg-10'>
                        <p>{props.message}</p>
                    </div>
            </div>
        </div>
    );

}  
export default Popup;