import { Row, Tabs, Typography } from "antd";
import "../styles/ListAppointment.scss";
import UpcomingAppointments from "../components/Appointment/UpcomingAppointment";
import CompletedAppointments from "../components/Appointment/CompletedAppointments";
import CancelledAppointments from "../components/Appointment/CancelledAppointment";
import { useState } from "react";


const ListAppointment = () => {
  const [cancelledAppointments, setCancelledAppointments] = useState([]);

  const handleRefuseAppointment = (cancelledAppointment) => {
    // Update cancelled appointments in ListAppointment
    setCancelledAppointments([...cancelledAppointments, cancelledAppointment]);
  };
  const items = [
    {
      key: "1",
      label: "Lịch sắp đến",
      children: (
        <UpcomingAppointments onRefuseAppointment={handleRefuseAppointment} />
      ),
    },
    {
      key: "2",
      label: "Hoàn thành",
      children: <CompletedAppointments />,
    },
    {
      key: "3",
      label: "Đã hủy",
      children: (
        <CancelledAppointments cancelledAppointments={cancelledAppointments} />
      ),
    },
  ];

  return (
    <div className="appointment-container">
      <div className="appointment-content">
        <Row className="content">
          <Typography.Title level={2}>Danh sách lịch hẹn</Typography.Title>
          <Tabs size="large" defaultActiveKey="1" items={items} />
        </Row>
      </div>
    </div>
  );
};

export default ListAppointment;
