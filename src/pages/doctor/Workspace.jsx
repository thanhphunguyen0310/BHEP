import { useState } from "react";
import { useSelector } from "react-redux";
import { Button, Card, Col, Row, Typography } from "antd";
import Calendar from "../../assets/icon/calendar.svg";
import Clock from "../../assets/icon/clock.svg";
import History from "../../assets/icon/history.svg";
import Chat from "../../assets/icon/chat.svg";
import Question from "../../assets/icon/question.svg";
import DoctorSchedule from "../../components/Doctor/DoctorSchedule";
import "../../styles/Workspace.scss";
import { useNavigate } from "react-router-dom";

const Workspace = () => {
  const navigate = useNavigate();
  const doctorName = useSelector(
    (state) => state.auth?.user?.data?.user?.fullName
  );
  const currentDate = new Date();
  const day = String(currentDate.getDate()).padStart(2, "0");
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const year = currentDate.getFullYear();
  const formattedDate = `${day}-${month}-${year}`;

  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <div className="workspace-container">
        {/* workspace-header */}
        <Row
          align={"middle"}
          justify={"center"}
          className="workspace-header-container"
        >
          <Row className="workspace-header-content">
            <span
              style={{
                display: "flex",
                alignItems: "end",
                gap: "0px 8px",
                justifyContent: "flex-start",
              }}
            >
              <p>BHEP, Xin chào </p>
              <Typography.Title className="header-doctorname">
                {doctorName}
              </Typography.Title>
            </span>
            <Typography.Text className="header-time">
              {formattedDate}
            </Typography.Text>
          </Row>
        </Row>
        {/* main content */}
        <Row className="workspace-main-container" gutter={[16, 16]}>
          <Row className="workspace-main-content">
            <Col xs={24} sm={12} md={8} lg={6}>
              <Card className="workspace-card" hoverable>
                <div className="card-content">
                  <img src={Calendar} alt="Calendar Icon" />
                  <Typography.Title level={4}>Lịch làm việc</Typography.Title>
                  <Button type="primary" onClick={showModal}>
                    Tạo lịch làm việc
                  </Button>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Card className="workspace-card" hoverable>
                <div className="card-content">
                  <img src={Clock} alt="Clock Icon" />
                  <Typography.Title level={4}>
                    Lịch hẹn với bệnh nhân
                  </Typography.Title>
                  <Button type="primary" onClick={() => {navigate(`/list-appointment`)}}>Xem lịch hẹn</Button>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Card className="workspace-card" hoverable>
                <div className="card-content">
                  <img src={History} alt="History Icon" />
                  <Typography.Title level={4}>
                    Lịch sử khám bệnh
                  </Typography.Title>
                  <Button type="primary">Xem lịch sử khám bệnh</Button>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Card className="workspace-card" hoverable>
                <div className="card-content">
                  <img src={Chat} alt="Chat Icon" />
                  <Typography.Title level={4}>
                    Tin nhắn từ bệnh nhân
                  </Typography.Title>
                  <Button type="primary">Xem tin nhắn</Button>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Card className="workspace-card" hoverable>
                <div className="card-content">
                  <img src={Question} alt="Question Icon" />
                  <Typography.Title level={4}>
                    Câu hỏi từ bệnh nhân
                  </Typography.Title>
                  <Button type="primary">Xem câu hỏi</Button>
                </div>
              </Card>
            </Col>
          </Row>
        </Row>
      </div>
      <DoctorSchedule
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      />
    </>
  );
};

export default Workspace;
