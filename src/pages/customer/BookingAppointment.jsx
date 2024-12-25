import { useState } from "react";
import { Row, Steps, Typography } from "antd";
import "../../styles/BookingAppointment.scss";
import BookingInformation from "../../components/Customer/BookingInformation";
import AppointmentPayment from "../../components/Customer/AppointmentPayment";
import AppointmentFinish from "../../components/Customer/AppointmentFinish";
import { FormOutlined, MoneyCollectOutlined, FileDoneOutlined } from "@ant-design/icons";

const BookingAppointment = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [paymentId, setPaymentId] = useState(null);

  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
  };
  const handlePaymentSuccess = (id) => {
    setPaymentId(id);
    setCurrentStep(2); 
  };
  const setConfirmationStatus = (status) => {
    setIsConfirmed(status);
  };

  const steps = [
    {
      title: "Thông tin",
      content: <BookingInformation 
      onNextStep={handleNextStep}
      setConfirmationStatus={setConfirmationStatus} />,
    },
    {
      title: "Thanh toán",
      content: <AppointmentPayment 
      onPaymentSuccess={handlePaymentSuccess}
      setCurrentStep={setCurrentStep}/>,
    },
    {
      title: "Hoàn thành",
      content: <AppointmentFinish paymentId={paymentId}/>,
    },
  ];

  return (
    <>
      <div className="booking-container">
        <div className="booking-content">
          <Row className="header" align={"middle"} justify={"center"}>
            <Typography.Title level={3}>Đặt lịch khám</Typography.Title>
          </Row>
          <hr />
          <Row className="booking-body">
            <Steps
              style={{ padding: "32px 16px" }}
              current={currentStep}
              onChange={(nextStep) => {
                if (nextStep <= currentStep || isConfirmed) {
                  setCurrentStep(nextStep);
                }
              }}
            >
              <Steps.Step title="Thông tin" icon={<FormOutlined />} />
              <Steps.Step title="Thanh toán" icon={<MoneyCollectOutlined />} />
              <Steps.Step title="Hoàn thành" icon={<FileDoneOutlined />} />
            </Steps>
            <Row className="content-body">
              {steps[currentStep]?.content}
            </Row>
          </Row>
        </div>
      </div>
    </>
  );
};

export default BookingAppointment;
