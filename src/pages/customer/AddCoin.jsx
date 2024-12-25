import {
  Button,
  InputNumber,
  Radio,
  message,
  Typography,
  Modal,
  Row,
  Space,
} from "antd";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCoin, updateStatusPayment } from "../../configs/api/addCoinApi";
import "../../styles/AddCoin.scss";
import payOS from "../../assets/icon/payOS.svg";
import VNPay from "../../assets/img/vnpay_qr.png";
import { createTransaction } from "../../store/transactionSlice";
const AddCoin = () => {
  const [coinInput, setCoinInput] = useState(50000);
  const [paymentMethod, setPaymentMethod] = useState("PayOS");
  const [paymentResult, setPaymentResult] = useState(null);
  const userId = useSelector((state) => state.auth?.user?.data?.user?.id);
  const dispatch = useDispatch();
  const handleAddCoin = async () => {
    if (!paymentMethod) {
      message.warning("Bạn cần chọn 1 phương thức thanh toán.");
      return;
    }
    
    try {
      const napTien = await addCoin(userId, coinInput);
      const paymentUrl = napTien?.data?.checkoutUrl;
      const storeTransaction = dispatch(createTransaction(napTien.data))
      if (paymentUrl && storeTransaction?.payload?.id) {
        setTimeout(() => {
           window.location.href = paymentUrl;
        },2000)
      } else {
        setPaymentResult("Không thể tạo URL thanh toán.");
      }
    } catch (error) {
      console.error("Payment Error: ", error);
      setPaymentResult("Có lỗi xảy ra khi tạo yêu cầu thanh toán.");
    }
  };

  const showConfirm = () => {
    Modal.confirm({
      title: "Xác nhận nạp tiền",
      content: `Bạn xác nhận nạp ${coinInput} vào hệ thống BHEP qua ${
        paymentMethod === "PayOS" ? "PayOS" : "VNPay"
      }?`,
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: handleAddCoin,
    });
  };
  const formatNumber = (number) => {
    let str = number.toString();
    return str.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };
  const handleInputChange = (value) => {
    setCoinInput(value);
  };
  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  return (
    <div className="add-coin-container">
      <div className="add-coin-content">
        <Row className="add-coin-header">
          <Typography.Title level={2}>Nạp Xu</Typography.Title>
        </Row>

        <div className="input-section">
          <Typography.Text>Số tiền: </Typography.Text>
          <InputNumber
            // min={50000}
            value={coinInput}
            // formatter={(value) => `${formatNumber(value)}`}
            // parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            onChange={handleInputChange}
            style={{ width: 200, marginLeft: 10 }}
          />
        </div>

        <div className="payment-method-section">
          <Typography.Title level={5}>
            Phương thức thanh toán:{" "}
          </Typography.Title>
          <Radio.Group
            onChange={handlePaymentMethodChange}
            value={paymentMethod}
            className="radio-group"
          >
            <Space style={{ width: "40%" }} direction="vertical">
              <Radio className="radio-option" value={"PayOS"}>
                <img src={payOS} style={{ width: "50px", height: "25px" }} />
                {/* <Typography.Text style={{ fontWeight: "400" }}>
                    PayOS
                  </Typography.Text> */}
              </Radio>
              <Radio
                disabled
                className="radio-option"
                style={{ fontWeight: "500" }}
                value={"VNPay"}
              >
                <img src={VNPay} style={{ width: "50px", height: "25px" }} />
                {/* VNPay */}
              </Radio>
            </Space>
          </Radio.Group>
        </div>
        <Row className="confirm-btn">
          <Button size="large" type="primary" onClick={showConfirm} >
            Xác nhận
          </Button>
        </Row>
        {paymentResult && (
          <div style={{ marginTop: 20 }}>
            <Typography.Text type="danger">{paymentResult}</Typography.Text>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddCoin;
