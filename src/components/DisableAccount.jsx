import React, { useState } from "react";
import { Typography, Input, Button, Form, Modal, message } from "antd";
import "../styles/DisableAccount.scss";
import { useNavigate } from "react-router-dom";

const DisableAccount = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);

  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    checkCredentials(e.target.value, password);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    checkCredentials(email, e.target.value);
  };

  const checkCredentials = (email, password) => {
    if (email === "huydat@gmail.com" && password === "123456Test@") {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  };

  const showConfirm = () => {
    Modal.confirm({
      title: "Xác nhận vô hiệu hóa tài khoản",
      content: `Bạn có chắc chắn muốn vô hiệu hóa tài khoản "${email}" không?`,
      okText: "Xác nhận",
      cancelText: "Hủy bỏ",
      onOk() {
        navigate("/");
        message.success("Vô hiệu hóa tài khoản thành công")
      },
      onCancel() {
        message.error("Hủy bỏ vô hiệu hóa tài khoản")
      },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isDisabled) {
      showConfirm();
    }
  };

  return (
    <div className="disable-account-container">
      <div className="disable-account-content">
        <Typography.Title>Vô hiệu hóa tài khoản</Typography.Title>
        <Form
          layout="vertical"
          className="content"
          onSubmit={handleSubmit}
        >
          <Form.Item label="Email" required>
            <Input
              placeholder="Email"
              value={email}
              onChange={handleEmailChange}
            />
          </Form.Item>
          <Form.Item label="Mật khẩu" required>
            <Input.Password
              placeholder="Mật khẩu"
              value={password}
              onChange={handlePasswordChange}
            />
          </Form.Item>
          <Form.Item className="btn-disable">
            <Button
              type="primary"
              danger
              htmlType="submit"
              disabled={isDisabled}
              onClick={handleSubmit}
            >
              Vô hiệu hóa
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default DisableAccount;
