import { useEffect, useState } from "react";
import {
  getAppointmentByUserId,
  getAppointmentById,
  updateAppointment,
} from "../../configs/api/appointmentApi";
import { useSelector } from "react-redux";
import "../../styles/UpcomingAppointment.scss";
import { Avatar, Button, Col, Modal, Row, Typography, message } from "antd";
import { RiCalendarScheduleFill } from "react-icons/ri";
import { FaClock, FaStickyNote } from "react-icons/fa";
import { useLocation } from "react-router-dom";
const { Text } = Typography;

const UpcomingAppointment = ({ onRefuseAppointment }) => {
  const [appointments, setAppointments] = useState([]);
  const [appointmentReceive, setAppointmentReceive] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [appointmentDetail, setAppointmentDetail] = useState(null);
  const location = useLocation();
  const userId = useSelector((state) => state.auth?.user?.data?.user?.id);
  const userRole = useSelector((state) => state.auth?.user?.data?.user?.roleId);

  const fetchAppointments = async () => {
    const res = await getAppointmentByUserId(userId);
    const sortedAppointments = res.data?.appointments.sort((a, b) => {
      if (a.status !== b.status) {
        return a.status === 1 ? -1 : 1;
      }
      const dateA = new Date(a.date.split("-").reverse().join("-"));
      const dateB = new Date(b.date.split("-").reverse().join("-"));
      return dateA - dateB;
    });
    const sortedAppointmentReceive = res.data?.appointmentsReceived.sort((a, b) => {
      if (a.status !== b.status) {
        return a.status === 1 ? -1 : 1;
      }
      const dateA = new Date(a.date.split("-").reverse().join("-"));
      const dateB = new Date(b.date.split("-").reverse().join("-"));
      return dateA - dateB;
    });
    const cancelledAppointments = res.data?.appointmentsReceived.filter(
      (appointment) => appointment.status === 3
    );
    
    // Trigger onRefuseAppointment for each cancelled appointment
    cancelledAppointments.forEach((appointment) => {
      onRefuseAppointment(appointment);
    });
    setAppointments(sortedAppointments);
    setAppointmentReceive(sortedAppointmentReceive);
  };

  useEffect(() => {
    if (userId) {
      fetchAppointments();
    }
  }, [userId]);
  useEffect(() => {
    if (location.state?.appointmentId) {
      handleAppointmentClick(location.state.appointmentId);
    }
  }, [location.state]);
  const getStatusAppointment = (status) => {
    switch (status) {
      case -1:
        return (
          <>
            <Text type="danger">Hủy</Text>
          </>
        );
      case 0:
        return (
          <>
            <Text type="warning">Đang xử lí</Text>
          </>
        );
      case 1:
        return (
          <>
            <Text style={{ color: "rgb(72, 196, 237)" }}>Chấp nhận</Text>
          </>
        );
      case 2:
        return (
          <>
            <Text type="success">Hoàn thành</Text>
          </>
        );
      case 3:
        return (
          <>
            <Text type="danger">Từ chối</Text>
          </>
        );
      default:
        return "Unknown";
    }
  };
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };
  // user cancel appointment
  const handleCancelAppointment = async () => {
    Modal.confirm({
      title: "Xác nhận hủy lịch",
      content: `Bạn xác nhận hủy lịch hẹn này?`,
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          if (appointmentDetail) {
            const updatedAppointment = {
              id: appointmentDetail.id,
              customerId: appointmentDetail?.customer?.id,
              employeeId: appointmentDetail?.employee?.id,
              status: -1, //Update status to "Hủy"
            };
            message.success("Đã hủy");
            await updateAppointment(updatedAppointment);
            onRefuseAppointment(updatedAppointment);
            fetchAppointments();
            setOpenModal(false);
          }
        } catch (error) {
          message.error(
            "Có lỗi xảy ra khi xóa lịch làm việc: " + error.message
          );
        }
      },
    });
  };
  // get Appointment Detail
  const handleAppointmentClick = async (appointmentId) => {
    try {
      const appointmentDetail = await getAppointmentById(appointmentId);
      setAppointmentDetail(appointmentDetail.data);
      setSelectedAppointment(appointmentDetail.data);
      setOpenModal(true);
    } catch (error) {
      console.log(error);
    }
  };
  // doctor confirm appointment
  const handleConfirmAppointment = async () => {
    Modal.confirm({
      title: "Xác nhận lịch hẹn",
      content: `Bạn xác nhận lịch hẹn này?`,
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          if (appointmentDetail) {
            const updatedAppointment = {
              id: appointmentDetail.id,
              customerId: appointmentDetail?.customer?.id,
              employeeId: appointmentDetail?.employee?.id,
              status: 1, //Update status to "Xác nhận"
            };
            console.log(updatedAppointment)
            message.success("Chấp nhận lịch hẹn");
            await updateAppointment(updatedAppointment);
            // onRefuseAppointment(updatedAppointment);
            fetchAppointments();
            setOpenModal(false);
          }
        } catch (error) {
          message.error(
            "Có lỗi xảy ra khi xác nhận lịch làm việc: " + error.message
          );
        }
      },
    });
  }
  // docter refuse appointment
  const handleRefuseAppointment = async () => {
    Modal.confirm({
      title: "Xác nhận từ chối",
      content: `Bạn xác nhận từ chối lịch hẹn này?`,
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          if (appointmentDetail) {
            const updatedAppointment = {
              id: appointmentDetail.id,
              customerId: appointmentDetail?.customer?.id,
              employeeId: appointmentDetail?.employee?.id,
              status: 3, //Update status to "Từ chối"
            };
            message.success("Đã từ chối");
            await updateAppointment(updatedAppointment);
            onRefuseAppointment(updatedAppointment);
            fetchAppointments();
            setOpenModal(false);
          }
        } catch (error) {
          message.error(
            "Có lỗi xảy ra khi xóa lịch làm việc: " + error.message
          );
        }
      },
    });
  };
  const handleModalClose = () => {
    setOpenModal(false);
  };

  const renderAppointmentList = (appointmentList) => {
    return appointmentList.map((appointment) => (
      <Row
        key={appointment.id}
        className="appointment-container"
        align={"middle"}
      >
        <div className="appointment">
          <Col className="image">
            <Avatar
              onClick={() => handleAppointmentClick(appointment.id)}
              shape="square"
              src={
                userRole === 3
                  ? appointment.customerAvatar
                  : appointment.employeeAvatar
              }
              style={{ cursor: "pointer" }}
            />
            <div className="status">
              {getStatusAppointment(appointment.status)}
            </div>
          </Col>
          <Col className="appointment-info">
            {userRole === 3 ? (
              <div className="info">
                <h3>Khách hàng: {appointment.customerName}</h3>
                <p>
                  <RiCalendarScheduleFill
                    fontSize={"18px"}
                    color="rgb(12, 156, 50)"
                  />{" "}
                  {appointment.date}
                </p>
                <p>
                  <FaClock fontSize={"18px"} color="rgb(47, 134, 228)" />{" "}
                  {appointment.time}
                </p>
                <p>
                  <FaStickyNote fontSize={"18px"} color="rgb(185, 224, 14)" />
                  <span>{appointment.note || ""}</span>
                </p>
              </div>
            ) : (
              <div className="info">
                <h3>Bác sĩ: {appointment.employeeName}</h3>
                <p>
                  <RiCalendarScheduleFill
                    fontSize={"18px"}
                    color="rgb(12, 156, 50)"
                  />{" "}
                  {appointment.date}
                </p>
                <p>
                  <FaClock fontSize={"18px"} color="rgb(47, 134, 228)" />{" "}
                  {appointment.time}
                </p>
                <p>
                  <FaStickyNote fontSize={"18px"} color="rgb(185, 224, 14)" />
                  <span>{appointment.note || ""}</span>
                </p>
              </div>
            )}
          </Col>
        </div>
      </Row>
    ));
  };
  return (
    <div className="appointment-list">
      {userRole === 3
        ? renderAppointmentList(appointmentReceive)
        : renderAppointmentList(appointments)}

      <Modal
        title="Chi tiết lịch hẹn"
        open={openModal}
        onCancel={handleModalClose}
        footer={[
          userRole === 3 && appointmentDetail?.status === 0 && (
            <>
              <Button 
                key="confirm" 
                type="primary"
                onClick={() => handleConfirmAppointment(appointmentDetail)}
                >
                Xác nhận
              </Button>
              <Button
                onClick={() => handleRefuseAppointment(appointmentDetail)}
                key="reject"
                type="default"
                danger
              >
                Từ chối
              </Button>
            </>
          ),
          userRole !== 3 && appointmentDetail?.status === 0 && (
            <Button
              key="cancel"
              type="primary"
              danger
              onClick={() => handleCancelAppointment(appointmentDetail)}
            >
              Hủy Lịch
            </Button>
          ),
        ]}
      >
        {appointmentDetail && (
          <Row className="modal-content">
            <Row>
              <Col className="status" span={6}>
                <Avatar
                  shape="square"
                  size={100}
                  src={
                    userRole === 3
                      ? appointmentDetail.customer.avatar
                      : appointmentDetail.employee.avatar
                  }
                />
                <div>{getStatusAppointment(appointmentDetail.status)}</div>
              </Col>
              <Col span={10}>
                <h3>
                  {userRole === 3
                    ? `Khách hàng: ${appointmentDetail.customer.fullName}`
                    : `Bác sĩ: ${appointmentDetail.employee.fullName}`}
                </h3>
                <p>
                  <strong>Email:</strong>{" "}
                  {userRole === 3
                    ? appointmentDetail.customer.email
                    : appointmentDetail.employee.email}
                </p>
                <p>
                  <strong>Số điện thoại:</strong>{" "}
                  {userRole === 3
                    ? appointmentDetail.customer.phoneNumber
                    : appointmentDetail.employee.phoneNumber}
                </p>
                <p>
                  <strong>Ngày hẹn:</strong> {appointmentDetail.date}
                </p>
                <p>
                  <strong>Thời gian hẹn:</strong> {appointmentDetail.time}
                </p>
              </Col>
              <Col span={8}>
                <p>
                  <strong>Triệu chứng:</strong>{" "}
                  {appointmentDetail.symptoms
                    ? appointmentDetail.symptoms
                        .map((symptom) => symptom.name)
                        .join(", ")
                    : "Không có thông tin"}
                </p>
                <p>
                  <strong>Ghi chú:</strong>{" "}
                  {appointmentDetail.note || "Không có"}
                </p>
                <p>
                  <strong>Giá tiền:</strong>{" "}
                  {formatPrice(appointmentDetail.price)}
                </p>
              </Col>
            </Row>
          </Row>
        )}
      </Modal>
    </div>
  );
};

export default UpcomingAppointment;
