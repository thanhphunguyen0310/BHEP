import {
  Avatar,
  Button,
  Col,
  Input,
  Modal,
  Radio,
  Row,
  Select,
  Typography,
} from "antd";
import { getSymptom } from "../../configs/api/appointmentApi";
import { useLocation } from "react-router-dom";
import {
  MdAttachMoney,
  MdLocationOn,
  MdOutlineAccessTimeFilled,
} from "react-icons/md";
import "../../styles/BookingInformation.scss";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { setAppointment } from "../../store/appointmentSlice"

const BookingInformation = ({ onNextStep, setConfirmationStatus }) => {
  const [symptom, setSymptom] = useState([]);
  const [selectedSymptom, setSelectedSymptom] = useState(null);
  const [note, setNote] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  const dispatch = useDispatch();
  const location = useLocation();
  const { doctor, schedule } = location.state || {};

  const userId = useSelector((state) => state.auth?.user?.data?.user?.id);
  const userAvt = useSelector((state) => state.auth?.user?.data?.user?.avatar);
  const phoneNumber = useSelector((state) => state.auth?.user?.data?.user?.phoneNumber);
  const email = useSelector((state) => state.auth?.user?.data?.user?.email);
  const fullName = useSelector((state) => state.auth?.user?.data?.user?.fullName);
  const gender = useSelector((state) => state.auth?.user?.data?.user?.gender);

  const handleConfirm = () => {
    setIsModalVisible(true);
  };
  const handleNoteChange = (e) => {
    setNote(e.target.value);
  };
  const handleOk = async () => {
    // save appointment to redux
    const appointmentData = {
      userId: userId,
      doctorId: parseInt(doctor.id),
      date: schedule.date,
      time: schedule.time,
      price: doctor.price,
      description: "Description",
      note: note,
      selectedSymptom: selectedSymptom,
    };
    dispatch(setAppointment(appointmentData));
        setIsModalVisible(false);
        setConfirmationStatus(true);
        onNextStep(); // Move to the next step
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const fetchSymptom = async () => {
    try {
      const symptomData = await getSymptom();
      setSymptom(symptomData.data);
    } catch (error) {
      console.error("Error fetching symptoms:", error);
    }
  };

  useEffect(() => {
    fetchSymptom();
  }, []);

  const handleSymptomChange = (value) => {
    setSelectedSymptom(value);
  };

  return (
    <>
      <div className="booking-information-container">
        <div className="booking-information">
          <Row className="user-information">
            <Typography.Paragraph style={{ margin: "0", fontWeight: "300" }}>
              Thông tin người hẹn
            </Typography.Paragraph>
            <Row className="information-content">
              <Col  span={4} className="content">
                <Avatar
                  src={userAvt}
                  style={{ width: "70px", height: "70px", padding: "3px 3px" }}
                />
              </Col>
              <Col className="content">
                <Typography.Title level={5} style={{ margin: "0" }}>
                  {fullName}
                </Typography.Title>
                <Typography.Text>
                  {gender === 1 ? "Nam" : gender === 2 ? "Nữ" : "Khác"}
                </Typography.Text>
              </Col>
              <Col className="content">
                <Typography.Text>
                  <strong>Email:</strong> {email}
                </Typography.Text>
                <Typography.Text>
                  <strong>Số điện thoại:</strong> {phoneNumber}
                </Typography.Text>
              </Col>
            </Row>
          </Row>
          <Row className="user-information">
            <Typography.Paragraph style={{ margin: "0", fontWeight: "350" }}>
              Thông tin lịch hẹn
            </Typography.Paragraph>
            <Row className="booking-content">
              <Row className="booking-infor">
                <Col className="icon">
                  <MdOutlineAccessTimeFilled
                    style={{ fontSize: "20px", color: "#2f81f5" }}
                  />
                </Col>
                <Col className="time">
                  <strong>Lịch hẹn: {schedule.time}</strong>
                  <p>{schedule.date}</p>
                </Col>
              </Row>
              <Row className="booking-infor">
                <Col className="icon">
                  <MdLocationOn
                    style={{ fontSize: "20px", color: "#2f81f5" }}
                  />
                </Col>
                <Col className="time">
                  <strong>{doctor.workPlace}</strong>
                  <p>{doctor.fullName}</p>
                </Col>
              </Row>
              <Row className="booking-infor">
                <Col className="icon">
                  <MdAttachMoney
                    style={{ fontSize: "20px", color: "#2f81f5" }}
                  />
                </Col>
                <Col className="time">
                  <strong>Chi phí</strong>
                  <p>{formatPrice(doctor.price)}</p>
                </Col>
              </Row>
            </Row>
          </Row>
          <Row className="user-information no-bg">
            <Typography.Paragraph style={{ margin: "0", fontWeight: "350" }}>
              Hình thức
            </Typography.Paragraph>
            <Row className="information-content no-bg">
              <Radio.Group>
                <Radio value={1}>Offline</Radio>
                <Radio disabled value={2}>
                  Online
                </Radio>
              </Radio.Group>
            </Row>
          </Row>
          <Row className="user-information no-bg">
            <Typography.Paragraph style={{ margin: "0", fontWeight: "350" }}>
              Triệu chứng
            </Typography.Paragraph>
            <Row className="information-content no-bg">
              <Select
                mode="multiple"
                style={{ width: "100%" }}
                placeholder="Chọn triệu chứng"
                onChange={handleSymptomChange}
                value={selectedSymptom}
              >
                {symptom.map((symp) => (
                  <Select.Option key={symp.id} value={symp.id}>
                    {symp.name}
                  </Select.Option>
                ))}
              </Select>
            </Row>
          </Row>
          <Row className="user-information no-bg">
            <Typography.Paragraph style={{ margin: "0", fontWeight: "350" }}>
              Ghi chú
            </Typography.Paragraph>
            <Row className="information-content no-bg">
              <Input.TextArea
                maxLength={200}
                placeholder="Ghi chú cho bác sĩ"
                size="large"
                onChange={handleNoteChange}
                value={note}
              />
            </Row>
          </Row>
        </div>
        <Row
          align={"middle"}
          justify={"center"}
          style={{ marginTop: "10px" }}
          className="confirm-btn"
        >
          <Button type="primary" size="large" onClick={handleConfirm}>
            Xác nhận đặt lịch
          </Button>
        </Row>
      </div>
      <Modal
        title="Xác nhận đặt lịch"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        <p>Bạn xác nhận đặt lịch hẹn chứ?</p>
      </Modal>
    </>
  );
};

export default BookingInformation;
