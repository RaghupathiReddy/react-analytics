/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC, useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { KTSVG, toAbsoluteUrl } from "../../../helpers";
import { getAllNotifications } from "./NotificationCRUD";
import NotificationItem from "./NotificationItem";
import { NotificationModel } from "../../../../app/Models/NotificationModel";
import * as notification from "./NotificationStore/NotificationRedux";

const HeaderNotificationsMenu: FC = (props: any) => {
  const dispatch = useDispatch();

  const userId = props.user._id;
  const [notificationCount, setNotificationCount] = useState<number | null>(
    props.notificationsList.length
  );

  useEffect(() => {
    if (userId) {
      loadNotificationItems();
    }
  }, [userId]);

  const loadNotificationItems = () => {
    getAllNotifications(userId).then((res) => {
      const notifications = res.data;

      dispatch(notification.actions.setNotifications(notifications));

      setNotificationCount(notifications.length);
    });
  };

  const refreshNotifications = () => {
    loadNotificationItems();
  };

  return (
    <div
      className="menu menu-sub menu-sub-dropdown menu-column w-350px w-lg-375px"
      data-kt-menu="true"
    >
      <div
        className="d-flex flex-column bgi-no-repeat rounded-top"
        style={{
          backgroundImage: `url('${toAbsoluteUrl(
            "/media/misc/pattern-1.jpg"
          )}')`,
        }}
      >
        <h3 className="text-white fw-bold px-9 mt-10 mb-6">
          Notifications
          {notificationCount && (
            <span className="fs-8 opacity-75 ps-3">
              {notificationCount} reports
            </span>
          )}
        </h3>
      </div>

      <div className="tab-content">
        <div className="tab-pane fade show active" role="tabpanel">
          <div className="scroll-y mh-325px my-5 px-8">
            {props.notificationsList &&
              props.notificationsList.map((notification: NotificationModel) => (
                <NotificationItem
                  refresh={refreshNotifications}
                  key={notification.notificationId}
                  {...notification}
                ></NotificationItem>
              ))}
          </div>

          <div className="py-3 text-center border-top">
            <Link
              to="/crafted/pages/profile"
              className="btn btn-color-gray-600 btn-active-color-primary"
            >
              View All{" "}
              <KTSVG
                path="/media/icons/duotune/arrows/arr064.svg"
                className="svg-icon-5"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

function mapState(state: any) {
  const { auth, notification } = state;
  const { user } = auth;
  const notificationsList = notification.allNotifications;
  return { user, notificationsList };
}

const actionCreators = {};

const ConnectedComponent = connect(
  mapState,
  actionCreators
)(HeaderNotificationsMenu);

export { ConnectedComponent as HeaderNotificationsMenu };
