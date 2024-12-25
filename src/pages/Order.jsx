import {
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  Flex,
  Form,
  Input,
  Modal,
  Radio,
  Row,
  Space,
  Table,
  Tooltip,
  Typography,
  message,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ShoppingFilled } from "@ant-design/icons";
import "../styles/Order.scss";
import { FaCoins } from "react-icons/fa";
import { createOrder } from "../configs/api/orderApi";
import { getUserDetail } from "../configs/api/userApi";
import { useEffect, useState } from "react";
import { clearCart } from "../store/cartSlice";

const Order = () => {
  const items = useSelector((state) => state?.cart);
  const userId = useSelector((state) => state.auth?.user?.data?.user?.id);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userBalance, setUserBalance] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [userName, setUserName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");

  // const userBalance = useSelector(
  //   (state) => state.auth?.user?.data?.user?.balance
  // );

  const columns = [
    {
      title: <Typography.Title level={4}>Sản phẩm</Typography.Title>,
      dataIndex: "image",
      className: "custom-header",
      key: "image",
      render: (text, record) => {
        const objectPosition = record.type === "device" ? "center" : "right";
        return text ? (
          <span style={{ display: "flex", alignItems: "center" }}>
            <img
              src={text}
              alt="product"
              style={{
                marginRight: "16px",
                width: "80px",
                height: "80px",
                borderRadius: "4px",
                objectFit: "cover",
                objectPosition: objectPosition,
              }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <Typography.Title level={4}>{record.name}</Typography.Title>
              {(record.type === "1" || record.type === "2") && (
                <Typography.Text type="secondary">
                  Phân loại: {record.duration} tháng
                </Typography.Text>
              )}
              {record.type === "2" && (
                <Typography.Text type="secondary">
                  Mã gia đình: {items?.groupCode}
                </Typography.Text>
              )}
            </div>
          </span>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <Typography.Title level={4}>{record.name}</Typography.Title>
              {(record.type === "1" || record.type === "2") && (
                <Typography.Text type="secondary">
                  Phân loại: {record.duration} tháng
                </Typography.Text>
              )}
            </div>
          </div>
        );
      },
    },
    {
      title: <Typography.Title level={4}>Giá tiền</Typography.Title>,
      dataIndex: "price",
      key: "price",
      className: "custom-header",
      render: (text) => <span>{formatPrice(text)}</span>,
    },
    {
      title: <Typography.Title level={4}>Số lượng</Typography.Title>,
      dataIndex: "quantity",
      key: "quantity",
      className: "custom-header",
      render: (text, record) => (
        <Typography.Text>{record.quantity}</Typography.Text>
      ),
    },
    {
      title: <Typography.Title level={4}>Thành tiền</Typography.Title>,
      key: "total",
      dataIndex: "total",
      className: "custom-header",
      render: (text, record) => {
        const total = record.price * record.quantity;
        return (
          <span style={{ color: "#ED1C1C", fontWeight: "600" }}>
            {formatPrice(total)}
          </span>
        );
      },
    },
  ];
  const vouchers = null;
  const COD = 0;
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
  const makeOrder = async () => {
    if (!selectedPaymentMethod) {
      message.warning("Bạn cần chọn 1 trong các phương thức thanh toán.");
    } else {
      const serviceItem = items.cartItems.find(
        (item) => item.type == "1" || item.type == "2"
      );
      const serviceId = serviceItem?.id;

      let products = items.cartItems
        .filter((item) => item.type == "device")
        .map((item) => ({ id: item.id, quantity: item.quantity }));

      let description = `Order Description`;
      if (items.cartItems.some((item) => item.type === "device")) {
        description = `Họ tên: ${userName}, Số điện thoại: ${phoneNumber}, Địa chỉ: ${address}`;
      }

      let isGenerateCode, code;
      if (items.cartItems.every((item) => item.type === "device" || item.type === "1")) {
        isGenerateCode = false;
        code = null;
      } else {
        if (items.groupCode && items.groupCode.length > 0) {
          isGenerateCode = false;
          code = items.groupCode;
        } else {
          isGenerateCode = true;
          code = null;
        }
      }
      let dataOrder = {
        userId: userId,
        amount: items.cartTotalAmount,
        isMinus: true,
        title: "Order Title",
        description: description,
        isGenerateCode: isGenerateCode,
        code: code,
        vouchers: vouchers,
        serviceId: serviceId,
        products: products.length > 0 ? products : null,
      };
      try {
        if (userBalance <= 0 || userBalance < dataOrder.amount) {
          message.warning("Số dư của bạn không đủ. Vui lòng nạp thêm xu!");
        } else {
          Modal.confirm({
            title: "Xác nhận đặt hàng",
            content: `Hệ thống sẽ trừ ${formatPrice(
              items.cartTotalAmount
            )} xu BHEP trong ví của bạn. Bạn xác nhận chứ?`,
            okText: "Xác nhận",
            cancelText: "Hủy",
            onOk: async () => {
              const order = await createOrder(
                dataOrder.userId,
                dataOrder.amount,
                dataOrder.isMinus,
                dataOrder.title,
                dataOrder.description,
                dataOrder.isGenerateCode,
                dataOrder.code,
                dataOrder.vouchers,
                dataOrder.serviceId,
                dataOrder.products
              );
              if (order.status === 200) {
                dispatch(clearCart());
                message.success("Đơn hàng của bạn đã được đặt thành công.");
              } else {
                message.error("Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.");
              }
            },
          });
        }
      } catch (error) {
        console.log("Error: ", error);
      }
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };
  return (
    <div className="order-container">
      <Flex className="search-bar" align="center" justify="center" gap={30}>
        <Input.Search size="large" style={{ width: "60%" }} />
        <Badge count={items?.cartTotalQuantity}>
          <Avatar
            onClick={() => navigate(`/cart`)}
            style={{ cursor: "pointer", backgroundColor: "white" }}
            size={"large"}
            icon={<ShoppingFilled style={{ color: "black" }} />}
          />
        </Badge>
      </Flex>
      <Row className="order-content">
        <Row className="order-header">
          <Typography.Title>THANH TOÁN</Typography.Title>
          <Row className="order-info">
            <Typography.Text>
              Giỏ hàng: {items.cartTotalQuantity} sản phẩm
            </Typography.Text>
            <Typography.Text onClick={() => navigate(-1)}>
              Ấn để thay đổi
            </Typography.Text>
          </Row>
        </Row>
        <Row justify={"center"} className="order-items">
          <Table
            showHeader={false}
            pagination={false}
            columns={columns}
            dataSource={items?.cartItems}
            rowKey={(record) => record.id}
            rowClassName={() => "custom-row"}
          />
        </Row>
        <hr />
        <Row align={"middle"} justify={"start"} className="order-voucher">
          <Typography.Text>Phiếu giảm giá</Typography.Text>
          <Typography.Text>Chọn phiếu</Typography.Text>
        </Row>
        <Form onFinish={makeOrder} className="order-delivery">
          {items.cartItems.some((item) => item.type === "device") && (
            <Row align={"middle"} justify={"start"}>
              <Card
                title={
                  <Tooltip
                    placement="rightTop"
                    title="Khi mua thiết bị, vui lòng điền thông tin người nhận để chúng tôi
              có thể giao hàng cho bạn."
                  >
                    <Typography.Text>Thông tin mua hàng</Typography.Text>
                  </Tooltip>
                }
              >
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <Form.Item
                      name="userName"
                      rules={[
                        {
                          required: true,
                          message: "Họ tên không được để trống",
                        },
                      ]}
                    >
                      <Input
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Họ tên"
                        style={{ marginBottom: "16px" }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      name="phoneNumber"
                      rules={[
                        {
                          required: true,
                          message: "Số điện thoại không được để trống",
                        },
                        {
                          pattern: /^[0-9]{10}$/,
                          message: "Số điện thoại phải đủ 10 số",
                        },
                      ]}
                    >
                      <Input
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Số điện thoại"
                        style={{ marginBottom: "16px" }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      name="address"
                      rules={[
                        {
                          required: true,
                          message: "Địa chỉ không được để trống",
                        },
                      ]}
                    >
                      <Input
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Địa chỉ"
                        style={{ marginBottom: "16px" }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </Row>
          )}
        </Form>
      </Row>
      <Row className="order-payment">
        <Col className="payment-method" span={10}>
          <Row className="payment-header">
            <Typography.Title style={{ fontSize: "32px" }}>
              PHƯƠNG THỨC THANH TOÁN
            </Typography.Title>
            <Radio.Group
              className="radio-group"
              onChange={(e) => setSelectedPaymentMethod(e.target.value)}
            >
              <Space direction="vertical">
                <Radio className="radio-option" value={1}>
                  <FaCoins
                    style={{
                      color: "#e6f024",
                      fontSize: "20px",
                      marginRight: "10px",
                    }}
                  />{" "}
                  <Typography.Text style={{ fontWeight: "500" }}>
                    Xu BHEP
                  </Typography.Text>
                </Radio>
                <Radio disabled className="radio-option" value={2}>
                  Thanh toán tiền mặt
                </Radio>
                <Radio disabled className="radio-option" value={3}>
                  Thanh toán bằng thẻ Visa / Mastercard
                </Radio>
                <Radio disabled className="radio-option" value={4}>
                  Thanh toán bằng thẻ ATM nội địa
                </Radio>
                <Radio className="radio-option" value={5} disabled>
                  Thanh toán bằng VNPay
                </Radio>
              </Space>
            </Radio.Group>
          </Row>
        </Col>
        <Col span={4}></Col>
        <Col className="total-price" span={10}>
          <Typography.Title>TỔNG TIỀN</Typography.Title>
          <Row className="billing">
            <Col span={12}>
              <Row>
                <Typography.Text type="secondary">Tạm tính</Typography.Text>
              </Row>
              <Row style={{ marginTop: "16px" }}>
                <Typography.Text type="secondary">
                  Phí vận chuyển
                </Typography.Text>
              </Row>
              <Row style={{ marginTop: "16px" }}>
                <Typography.Text type="secondary">
                  Phiếu giảm giá
                </Typography.Text>
              </Row>
              <Row style={{ marginTop: "16px" }}>
                <Typography.Text type="secondary">Thành tiền</Typography.Text>
              </Row>
            </Col>
            <Col span={12}>
              <Row>
                <Typography.Text>
                  {formatPrice(items?.cartTotalAmount)}
                </Typography.Text>
              </Row>
              <Row style={{ marginTop: "16px" }}>
                <Typography.Text>{formatPrice(vouchers)}</Typography.Text>
              </Row>
              <Row style={{ marginTop: "16px" }}>
                <Typography.Text>{formatPrice(COD)}</Typography.Text>
              </Row>
              <Row style={{ marginTop: "16px" }}>
                <Typography.Text
                  style={{
                    color: "#ED1C1C",
                    fontWeight: "600",
                    fontSize: "28px",
                  }}
                >
                  {formatPrice(items?.cartTotalAmount)}
                </Typography.Text>
              </Row>
            </Col>
          </Row>
          <Row className="order-btn">
            <Button
              className="custom-button"
              onClick={makeOrder}
              disabled={!selectedPaymentMethod}
            >
              Đặt hàng
            </Button>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default Order;
