import { Menu, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";
import { Link, useNavigate } from "react-router-dom";

const Profile = () => {
  const dispatch = useDispatch();
  const userRole = useSelector((state) => state.auth?.user?.data?.user?.roleId);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate(`/`);
    dispatch(logout());
  };

  const handleMessage = () => {
    message.loading(
      "Tính năng đang được BHEP phát triển. Bạn quay lại sau nhé!"
    );
  };

  return (
    <Menu>
      {userRole === 3 && (
        <Menu.Item key="workspace">
          <Link to="/workspace">Bàn làm việc</Link>
        </Menu.Item>
      )}
      {userRole === 1 && (
        <Menu.Item key="manage">
          <Link to="/manage">Quản lí</Link>
        </Menu.Item>
      )}
      <Menu.Item key="profile">
        <Link to="/profile">Thông tin cá nhân</Link>
        {/* Hồ sơ  */}
      </Menu.Item>
      {userRole === 2 && (
        <Menu.Item key="manage">
          <Link to="/list-appointment">Lịch hẹn</Link>
        </Menu.Item>
      )}
      {(userRole === 1 || userRole === 2 || userRole === 3) && (
        <Menu.Item key="health-tracking">
          <Link to="/health-tracking">
          Hồ sơ sức khỏe
          </Link>
        </Menu.Item>
      )}
      {(userRole === 2 || userRole === 3) && (
        <Menu.Item key="add-coin">
          <Link to="/add-coin">Nạp xu</Link>
        </Menu.Item>
      )}
      <Menu.Item key="setting" onClick={handleMessage}>
        {/* <Link to="/settings">Cài đặt</Link> */}
        Cài đặt
      </Menu.Item>
      <Menu.Item onClick={handleLogout} key="logout">
        Đăng xuất
      </Menu.Item>
    </Menu>
  );
};

export default Profile;
