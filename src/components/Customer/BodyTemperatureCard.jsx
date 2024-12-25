import { Card, Col, Image, Row, Typography } from "antd";
import TemperatureIcon from "../../assets/icon/body_temperature.svg";

const TemperatureCard = ({ data }) => {
  const getFontSize = (data) => {
    if (data.length > 5) {
      return "20px"; // Kích thước nhỏ hơn nếu dữ liệu dài
    }
    return "25px"; // Kích thước mặc định
  };
  return (
    <Card
      hoverable
      style={{ border: "1px solid #3285a8" }}
      title={
        <>
          <Typography.Title level={5}>Nhiệt độ</Typography.Title>
        </>
      }
    >
      <Row justify={"space-between"} align={"middle"} className="health-index">
        <Col span={12}>
          <Typography.Text
            style={{
              fontWeight: "600",
              fontSize: getFontSize(data.toString()), // Áp dụng kích thước font
            }}
          >
            {data} °C
          </Typography.Text>
        </Col>
        <Col span={8}>
          <Image
            preview={false}
            src={TemperatureIcon}
            style={{ width: "50px", height: "50px" }}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default TemperatureCard;
