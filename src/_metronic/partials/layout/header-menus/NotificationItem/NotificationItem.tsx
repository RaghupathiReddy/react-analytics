import { CSSProperties } from "react";
import { setNotificationRead } from "../NotificationCRUD";
import { NotificationModel } from "../../../../../app/Models/NotificationModel";



function NotificationItem(props: NotificationItemProps) {
    const unreadColorStyle: CSSProperties = {
      fontWeight: 600,
      cursor: 'pointer',
    }

    const handleRead = () => {
      setNotificationRead(props.notificationId)
        .then(res => {
          props.refresh()
        })
    }
    
    const { isRead, message } = props;

    return (
        <div onClick={handleRead} style={ isRead ? undefined: unreadColorStyle} className='d-flex flex-stack py-4'>
        <div className='d-flex align-items-center'>

          <div className='mb-0 me-2'>
            <div className={ isRead ? 'text-gray-400 fs-7': 'fs-7'}  >{message}</div>
          </div>
        </div>

      </div>
    );
}

export default NotificationItem;

interface NotificationItemProps extends NotificationModel {
  refresh: () => void;
}