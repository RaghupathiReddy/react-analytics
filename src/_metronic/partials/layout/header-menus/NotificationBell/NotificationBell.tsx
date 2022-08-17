
import { useEffect, useState } from 'react';
import NotificationBadge from 'react-notification-badge';
import { connect } from 'react-redux';
import { KTSVG } from '../../../../helpers';
import { NotificationModel } from '../../../../../app/Models/NotificationModel';

function NotificationBell(props: NotificationBellProps) {
  const { notifications } = props;
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (notifications) {
      let unreadCount = getUnreadCount(notifications);
      setCount(unreadCount);
    }
  }, [notifications]);

  const getUnreadCount = (notifications: NotificationModel[]) => {
    const unreadCount = notifications.filter(notification => !notification.isRead).length;
    return unreadCount;
  };

    return (
      <span id="group" style={{cursor: 'pointer'}}>
        { count > 0 && <NotificationBadge style={{fontSize: 12}} count={count} /> } 
        <KTSVG path='/media/icons/turing/notificationBell.svg' className='svg-icon-3x svg-icon-primary'></KTSVG>
      </span>
    );
}

function mapState(state: any) {
  const { notification } = state;

  const userNotifications = notification?.allNotifications;

  return { notifications: userNotifications };
}

const actionCreators = {}

export default connect(mapState, actionCreators)(NotificationBell);

interface NotificationBellProps {
  notifications: NotificationModel[];
}
