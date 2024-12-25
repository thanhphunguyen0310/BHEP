import { useSelector } from "react-redux";
import { get, ref, onValue } from "firebase/database";
import { database } from "../../configs/firebase/firebaseConfig";
import { useEffect, useState } from "react";
import "../../styles/HealthTracking.scss";
import { Col, Image, Row, Spin, Typography } from "antd";
import HeartBeatCard from "../../components/Customer/HeartBeatCard";
import SpO2Card from "../../components/Customer/SpO2Card";
import BodyTemperatureCard from "../../components/Customer/BodyTemperatureCard";
import LOGO from "../../assets/img/LOGO.png";

const UserHealthTracking = () => {
  const [userHealth, setUserHealth] = useState();
  const [isUpdating, setIsUpdating] = useState(false);
  const userId = useSelector((state) => state.auth?.user?.data?.user?.id);

  useEffect(() => {
    const userHealthRef = ref(database, "Device1");
    const unsubscribe = onValue(userHealthRef, (snapshot) => {
      if (snapshot.exists()) {
        setIsUpdating(true);
        const newData = snapshot.val();
        setUserHealth(newData);
      } else {
        console.log("No data available");
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (userHealth && isUpdating) {
      // Sau 3 giây, tắt animation và hiển thị lại dòng chữ
      const timeout = setTimeout(() => {
        setIsUpdating(false);
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [userHealth, isUpdating]);
  return (
    <div className="health-tracking-container">
      <div className="health-tracking-content">
        <Row className="health-tracking-title">
          <Typography.Title level={3}>THÔNG TIN VỀ SỨC KHỎE</Typography.Title>
        </Row>
        {userHealth ? (
          <Row className="health-tracking-card" gutter={[16, 16]}>
            <Col span={8}>
              <HeartBeatCard data={userHealth?.HeartBeat} />
            </Col>
            <Col span={8}>
              <SpO2Card data={userHealth?.SpO2} />
            </Col>
            <Col span={8}>
              <BodyTemperatureCard data={userHealth?.Temperature} />
            </Col>
          </Row>
        ) : (
          <Spin />
        )}
        <div className="update-data">
          <Row className="mascot">
            <Image preview={false} src={LOGO}  className={isUpdating ? "mascot-updating" : ""} />
          </Row>
          {!isUpdating && (
            <Row className="text-footer">
              <Typography.Text>
                Giữ tay của bạn vào vị trí kiểm tra
              </Typography.Text>
            </Row>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserHealthTracking;

