import { useNavigate } from "react-router-dom";
import "../styles/Footer.scss";
import { Col, Row } from "antd";
const Footer = () => {
  const navigate = useNavigate();
  return (
    <div className="footer">
      <Row
        gutter={{
          xs: 8,
          sm: 16,
          md: 24,
          lg: 32,
        }}
      >
        <Col className="gutter-row" span={6}>
          <div className="footer-content">
            <h2>BHEP</h2>
            <p style={{color:"#CACACA"}}>
              BHEP là ứng dụng được phát triển nhằm hỗ trợ người dùng trong việc
              theo dõi, đánh giá và đưa ra cảnh báo sớm về tình trạng sức khỏe
              kịp thời. Đối tượng BHEP hướng đến bao gồm những người có nhu cầu
              theo dõi sức khỏe hay lối sống không lành mạnh. Ngoài ra, BHEP
              cũng dịch vụ theo dõi sức khỏe gia đình giữa các thành viên với
              nhau.
            </p>
          </div>
        </Col>
        <Col className="gutter-row" span={6}>
          <div className="footer-content">
            <p>Chuyên đề sức khỏe</p>
            <p>Kiểm tra sức khỏe</p>
            <p>Tìm bệnh viện</p>
            <p>Cộng đồng</p>
            <p>Cửa hàng</p>
          </div>
        </Col>
        <Col className="gutter-row" span={6}>
          <div className="footer-content">
            <p style={{cursor:"pointer"}} onClick={()=> navigate('/terms-of-use')}>Điều khoản sử dụng</p>
            <p style={{cursor:"pointer"}} onClick={()=> navigate('/policy')}>Chính sách bảo mật</p>
            <p>Câu hỏi thường gặp</p>
            <p>Tiêu chuẩn cộng đồng</p>
            <p>Quy trình đặt lịch và mua hàng</p>
            <p style={{cursor:"pointer"}} onClick={()=> navigate('/disable-account')}>Vô hiệu hóa tài khoản</p>
          </div>
        </Col>
        <Col className="gutter-row" span={6}>
          <div className="footer-content">
            <h1>Liên hệ</h1>
            <p>9 đường 12D, phường Long Thạnh Mỹ, Thành phố Thủ Đức</p>
            <p>bhep2024@gmail.com</p>
            <p>(+84) 868 405 894</p>
          </div>
        </Col>
      </Row>
      <div className="footer-bottom">
        <p className="footer-bottom-text">
          @Copyright developed by
          <span className="footer-bottom-highlight">
            {" "}
            RAPTOR Technical Team
          </span>{" "}
          | All rights reserved 2024
        </p>
      </div>
    </div>
  );
};

export default Footer;
