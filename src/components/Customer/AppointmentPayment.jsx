import { Button, Modal, Radio, Space, Typography, message } from "antd";
import { MdPayment } from "react-icons/md";
import {
  FaMoneyBillWave,
  FaCreditCard,
  FaRegCreditCard,
  FaCoins,
} from "react-icons/fa";
import "../../styles/AppointmentPayment.scss";
import { useEffect, useState } from "react";
import { getUserDetail } from "../../configs/api/userApi";
import { makeAppointment } from "../../configs/api/appointmentApi";
import { useSelector } from "react-redux";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../configs/firebase/firebaseConfig"

const AppointmentPayment = ({ onPaymentSuccess, setCurrentStep }) => {

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userBalance, setUserBalance] = useState(null);

  const userId = useSelector((state) => state?.appointment?.userId);
  const doctorId = useSelector((state) => state?.appointment?.doctorId);
  const date = useSelector((state) => state?.appointment?.date);
  const time = useSelector((state) => state?.appointment?.time);
  const price = useSelector((state) => state?.appointment?.price);
  const description = useSelector((state) => state?.appointment?.description);
  const note = useSelector((state) => state?.appointment?.note);
  const selectedSymptom = useSelector(
    (state) => state?.appointment?.selectedSymptom
  );

  const getPaymentMethod = (selectedPaymentMethod) => {
    switch (selectedPaymentMethod) {
      case 1:
        return "Thanh toán bằng BHEP coin";
      case 2:
        return "Thanh toán tiền mặt";
      case 3:
        return "Thanh toán bằng thẻ Visa / Mastercard";
      case 4:
        return "Thanh toán bằng thẻ ATM nội địa";
      case 5:
        return "Thanh toán bằng VNPay";
      default:
        return " ";
    }
  };
  const handlePaymentMethodChange = (e) => {
    setSelectedPaymentMethod(e.target.value);
  };
  const handlePaymentButtonClick = () => {
    if (selectedPaymentMethod) {
      setIsModalVisible(true);
    } else {
      message.error(
        "Vui lòng chọn hình thức thanh toán trước khi tiến hành thanh toán."
      );
    }
  };
  useEffect(() => {
    getBalance();
  }, []);
  const getBalance = async () => {
    try {
      const balance = await getUserDetail(userId);
      setUserBalance(balance.data.balance);
    } catch (error) {
      console.log(error);
    }
  };
  const handleConfirmPayment = async () => {
    if(userBalance <= 0 || userBalance < price) {
      message.error("Số xu không đủ để đặt lịch. Bạn vui lòng nạp thêm xu!")
      setIsModalVisible(false);
      setCurrentStep(2);
    } else {
      try {
        const appointment = await makeAppointment(
          userId,
          doctorId,
          date,
          time,
          price,
          description,
          note,
          selectedSymptom
        );
        if (appointment) {
          // Firestore data structure
        const notificationData = {
          appointmentId: appointment.data.id,
          content: `Muốn đặt lịch hẹn vào ngày ${date} : ${time}`,
          createdAt: Date.now(),
          fromUserId: userId,
          isRead: false,
          toUserId: doctorId,
          uid: appointment.data.id,
        };

        // Add the document to Firestore
        await setDoc(doc(db, 'notification', `${appointment.data.id}`), notificationData);
          onPaymentSuccess(appointment.data.id);
          setIsModalVisible(false);
        } else {
          message.error("Có lỗi xảy ra khi tạo lịch hẹn. Vui lòng thử lại.");
        }
      } catch (error) {
        console.error("Error making appointment:", error);
        message.error("Có lỗi xảy ra khi tạo lịch hẹn. Vui lòng thử lại.");
        setCurrentStep(2);
      }
    }
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  return (
    <div className="payment-container">
      <Typography.Title level={5}>Chọn hình thức thanh toán</Typography.Title>
      <Radio.Group onChange={handlePaymentMethodChange} className="radio-group">
        <Space direction="vertical">
          <Radio className="radio-option" value={1}>
              <FaCoins
              style={{
                color: "#e6f024",
                fontSize: "20px",
                marginRight: "10px",
              }}
            />{" "}
            <Typography.Text style={{fontWeight:"500"}}>Xu BHEP</Typography.Text>
          </Radio>
          <Radio disabled className="radio-option" value={2}>
            <FaMoneyBillWave
              style={{
                color: "#32a852",
                fontSize: "20px",
                marginRight: "10px",
              }}
            />{" "}
            Thanh toán tiền mặt
          </Radio>
          <Radio disabled className="radio-option" value={3}>
            <FaCreditCard
              style={{
                color: "#a83242",
                fontSize: "20px",
                marginRight: "10px",
              }}
            />{" "}
            Thanh toán bằng thẻ Visa / Mastercard
          </Radio>
          <Radio disabled className="radio-option" value={4}>
            <FaRegCreditCard
              style={{
                color: "#dc24f0",
                fontSize: "20px",
                marginRight: "10px",
              }}
            />{" "}
            Thanh toán bằng thẻ ATM nội địa
          </Radio>
          <Radio className="radio-option" value={5} disabled>
            <MdPayment
              style={{
                color: "#2f81f5",
                fontSize: "20px",
                marginRight: "10px",
              }}
            />{" "}
            Thanh toán bằng VNPay
          </Radio>
        </Space>
      </Radio.Group>
      {selectedPaymentMethod && (
        <Button
          type="primary"
          size="large"
          onClick={handlePaymentButtonClick}
          className="payment-button"
        >
          Thanh toán
        </Button>
      )}
      <Modal
        title="Xác nhận thanh toán"
        open={isModalVisible}
        onOk={handleConfirmPayment}
        onCancel={handleCancel}
      >
        <p>
          Bạn xác nhận thanh toán bằng hình thức{" "}
          <strong>{getPaymentMethod(selectedPaymentMethod)}</strong> chứ?
        </p>
        <Typography.Paragraph type="warning">
         BHEP coin sẽ được trừ tự động khi đơn hẹn được xác nhận
        </Typography.Paragraph>
      </Modal>
    </div>
  );
};

export default AppointmentPayment;


// const payment = await makePayment(userId, price);
// console.log(payment,"payment")
// const paymentUrl = payment?.data?.data?.paymentUrl;
// window.location.replace(paymentUrl);



























// // if (payment?.data?.isSuccess) {
// //   const paymentUrl = payment?.data?.data?.paymentUrl;
// //   const paymentId = payment?.data?.data?.id;
// //   window.open(paymentUrl, '_blank');
// //   onPaymentSuccess(paymentId);
// //   // onPaymentSuccess();
// // } else {
// //   message.error("Có lỗi xảy ra khi tạo lịch hẹn. Vui lòng thử lại.");
// // }
