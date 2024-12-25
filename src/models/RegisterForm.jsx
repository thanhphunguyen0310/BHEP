import apiClient from "../configs/api/index";
import { Modal, Button, Form, Input, Select, Row, Col, message } from "antd";
import { useState } from "react";
import "../styles/RegisterForm.scss";
const { Option } = Select;

const RegistForm = ({ closeForm, openLoginForm }) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleOk = () => {
    setIsOpen(false);
    closeForm();
  };

  const handleCancel = () => {
    setIsOpen(false);
    closeForm();
  };

  const emailRules = [
    {
      required: true,
      message: "Nhập Email!",
    },
    {
      type: "email",
      message: "Email không hợp lệ!",
    },
    {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Email phải chứa @ và tên miền hợp lệ!",
    },
  ];

  const passwordRules = [
    {
      required: true,
      message: "Nhập mật khẩu!",
    },
    {
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/,
      message:
        "Mật khẩu phải chứa ít nhất 6 ký tự, bao gồm chữ thường, chữ in hoa và số!" +" "+
        "Ví dụ:123456Abc",
    },
  ];
  const handleRegister = async (values) => {
    const { rePassword, ...registerData } = values;
    try {
      // Gọi API đăng ký
      const response = await apiClient.post("/User", registerData);
      message.success("Đăng ký thành công!");
      // Đóng form đăng ký sau khi đăng ký thành công
      handleOk();
      openLoginForm();
    } catch (error) {
      message.error("Đăng ký thất bại. Vui lòng thử lại sau!");
      console.error("Đăng ký thất bại:", error);
    }
  };

  return (
    <Modal
      title="Đăng ký"
      open={isOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={null}
    >
      <div className="register-modal-content">
        <div className="register-form">
          <Form
            layout="vertical"
            name="basic"
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            autoComplete="off"
            onFinish={handleRegister}
          >
            <Form.Item
              label="Họ và tên"
              name="fullName"
              rules={[
                {
                  required: true,
                  message: "Nhập họ tên!",
                },
              ]}
            >
              <Input placeholder="Họ và tên" />
            </Form.Item>

            <Form.Item label="Email" name="email" rules={emailRules}>
              <Input placeholder="Email" />
            </Form.Item>

            <Form.Item label="Mật khẩu" name="password" rules={passwordRules}>
              <Input.Password placeholder="Mật khẩu" />
            </Form.Item>

            <Form.Item
              label="Nhập lại mật khẩu"
              name="rePassword"
              dependencies={["password"]}
              rules={[
                {
                  required: true,
                  message: "Xác nhận lại mật khẩu!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Mật khẩu chưa đúng!"));
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Nhập lại mật khẩu" />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Số điện thoại"
                  name="phoneNumber"
                  rules={[
                    {
                      required: true,
                      message: "Nhập số điện thoại!",
                    },
                  ]}
                >
                  <Input placeholder="Số điện thoại" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="gender"
                  label="Giới tính"
                  rules={[
                    {
                      required: true,
                      message: "Chọn giới tính!",
                    },
                  ]}
                >
                  <Select placeholder="Giới tính">
                    <Option value={1}>Nam</Option>
                    <Option value={2}>Nữ</Option>
                    <Option value={3}>Khác</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Button style={{ width: "100%" }} type="primary" htmlType="submit">
              Đăng ký
            </Button>
            <Form.Item>
              <span>
                Đã có tài khoản? <a onClick={openLoginForm}>Đăng nhập</a>
              </span>
            </Form.Item>
          </Form>
        </div>
      </div>
    </Modal>
  );
};

export default RegistForm;
