import "../styles/Header.scss";
import {
  Menu,
  Button,
  Typography,
  Avatar,
  message,
  Dropdown,
  Badge,
  List,
} from "antd";
import { CaretDownOutlined } from "@ant-design/icons";
import LOGO from "../assets/img/LOGO.png";
import ALT_AVATAR from "../assets/img/alt-avatar.png";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import LoginForm from "../models/LoginForm";
import RegistForm from "../models/RegisterForm";
import Profile from "./Profile";
import { IoIosNotifications } from "react-icons/io";
import { db } from '../configs/firebase/firebaseConfig'; // Make sure to import your firebase config
import { collection, query, where, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { getAppointmentById } from "../configs/api/appointmentApi";

const NavBar = () => {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showRegistForm, setShowRegistForm] = useState(false);
  const [openNoti, setOpenNoti] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadNoti, setUnreadNoti] = useState([]);
  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const openLoginForm = () => {
    setShowLoginForm(true);
    setShowRegistForm(false);
  };

  const openRegistForm = () => {
    setShowLoginForm(false);
    setShowRegistForm(true);
  };

  const closeForm = () => {
    setShowLoginForm(false);
    setShowRegistForm(false);
  };
  const handleNotificationClick = async (appointmentId, notificationId) => {
    await updateNotificationReadStatus(notificationId);
    setOpenNoti(false);
    navigate('/list-appointment', { state: { appointmentId } });
  };
  const updateNotificationReadStatus = async (notificationId) => {
    const notificationRef = doc(db, 'notification', notificationId);
    await updateDoc(notificationRef, {
      isRead: true,
    });
  };
  const handleMessage = () => {
    message.loading(
      "Tính năng đang được BHEP phát triển. Bạn quay lại sau nhé!",
      [2]
    );
  };
  useEffect(() => {
    if (auth.user?.data?.user?.roleId === 3) {
      const q = query(
        collection(db, 'notification'), 
        where('toUserId', '==', auth?.user?.data?.user?.id));
        // where('isRead', '==', false));
      const unsubscribe = onSnapshot(q, async (querySnapshot) => {
        const notifications = [];
        for (const doc of querySnapshot.docs) {
          const notification = doc.data();
          const appointment = await getAppointmentById(notification.appointmentId);
          notifications.push({
            id: doc.id,
            ...notification,
            avatar: appointment?.data?.customer?.avatar,
            userName: appointment?.data?.customer?.fullName,
            status: appointment?.data?.status
          });
          notifications.sort((a, b) => {
            if (a.isRead && !b.isRead) return 1;
            if (!a.isRead && b.isRead) return -1;
            return 0;
          });
          setNotifications(notifications);
        }
        const unreadNotifications = notifications.filter((noti) => !noti.isRead);
        setUnreadNoti(unreadNotifications);
      });
      return () => unsubscribe();
    }
  }, [auth.user]);
  const notificationMenu = (
    <Menu className="menu-notification">
      <List
        itemLayout="vertical"
        dataSource={notifications}
        renderItem={({id, appointmentId,  avatar, userName, content, createdAt, isRead })=> (
          <List.Item 
          key={id} 
          onClick={() => handleNotificationClick(appointmentId, id)}
            className={isRead ? 'read-notification' : 'unread-notification'}>
            <List.Item.Meta
              avatar={<Avatar src={avatar} />}
              title={userName}
              description={content}
            />
            <p>{new Date(createdAt).toLocaleString()}</p>
          </List.Item>
        )}
      />
    </Menu>
  );
  return (
    <div className="header-container">
      <div className="header-content">
        <Link className="logo" to="/">
          <img src={LOGO} alt="logo" />
          <Typography.Title>BHEP</Typography.Title>
        </Link>

        <Menu className="menu-items" mode="horizontal">
          <Menu.Item className="item" onClick={handleMessage}>
            Chuyên mục <CaretDownOutlined />
          </Menu.Item>
          <Menu.Item className="item" onClick={handleMessage}>
            Công cụ <CaretDownOutlined />
          </Menu.Item>
          <Menu.Item className="item">
            <Link to="/store">
              Cửa hàng <CaretDownOutlined />
            </Link>
          </Menu.Item>
          <Menu.Item className="item" onClick={handleMessage}>
            Cộng đồng <CaretDownOutlined />
          </Menu.Item>
          <Menu.Item>
            <Link to="/doctor">
              Tìm bác sĩ <CaretDownOutlined />
            </Link>
          </Menu.Item>
        </Menu>
        <div className="button">
          {auth.user?.isSuccess ? (
            <div className="user-loggedin">
              <div style={{marginRight:"12px"}}>
              <Dropdown 
              arrow 
              overlay={notificationMenu} 
              placement="bottomRight" 
              trigger={['click']}
              open={openNoti}
              onOpenChange={(open)=>setOpenNoti(open)}
              >
              <Badge count={unreadNoti.length} overflowCount={99}>
                <IoIosNotifications className="notification-icon" />
              </Badge>
              </Dropdown>
              </div>
              <Dropdown overlay={<Profile />} placement="bottomRight">
                <Avatar
                  className="avatar"
                  src={auth?.user?.data?.user?.avatar || ALT_AVATAR}
                  alt="User Avatar"
                  onError={(e) => { e.target.onerror = null; e.target.src = ALT_AVATAR; }}
                  style={{ cursor: "pointer" }}
                />
              </Dropdown>
            </div>
          ) : (
            <>
              <Button
                onClick={openLoginForm}
                className="login-button"
                type="primary"
                size="large"
              >
                Đăng nhập
              </Button>
              <Button
                onClick={openRegistForm}
                className="regist-button"
                type="primary"
                size="large"
              >
                Đăng ký
              </Button>
            </>
          )}
        </div>
        {showLoginForm && (
          <LoginForm
            closeForm={closeForm}
            openRegistForm={openRegistForm}
            showLoginForm={showLoginForm}
          />
        )}
        {showRegistForm && (
          <RegistForm closeForm={closeForm} openLoginForm={openLoginForm} />
        )}
      </div>
    </div>
  );
};

export default NavBar;
