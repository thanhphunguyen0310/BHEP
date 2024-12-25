import { Card, Button, Avatar, Image, Row, Col } from "antd";
import { StarFilled } from "@ant-design/icons";
import Stethoscope from "../assets/icon/stethoscope.svg";
import Hospital from "../assets/icon/hospital.svg";
const { Meta } = Card;

const DoctorCard = (props) => {
  return (
    <>
      <Card
        hoverable
        bordered={false}
        style={{
          width: "256px",
          // border: "1px solid #9ea4b0",
        }}
      >
        <Meta
          avatar={<Avatar size={70} src={props.avatar} shape="square" />}
          title={
            <div
              style={{
                fontSize: "13px",
                maxWidth: "200px",
                whiteSpace: "normal",
                wordWrap: "break-word",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent:"flex-start"
              }}
            >
              <div style={{display:"flex", flexDirection:"column", alignItems:"flex-start"}}>
              <p style={{ margin: 0, fontWeight:400 }}>{props.major}</p>
              <p style={{ margin: 0 }}>{props.fullName}</p>
              </div>
            </div>
          }
          description={
            <div
              style={{
                fontSize: "12px",
                display: "flex",
                justifyContent: "flex-start",
              }}
            >
              <Row align="middle" gutter={8}>
                <Col>{props.rate}</Col>
                <Col>
                  <StarFilled style={{ color: "#FFC107" }} />
                </Col>
              </Row>
            </div>
          }
        />
        <div style={{ marginTop: "10px", textAlign: "left" }}>
          <Row align="middle" gutter={8}>
            <Col>
              <Image
                height={"10px"}
                width={"10px"}
                preview={false}
                src={Stethoscope}
              />
            </Col>
            <Col>
              <p style={{ margin: 0 }}>{props.specialistId}</p>
            </Col>
          </Row>
          <Row style={{height:"50px"}} align="middle" gutter={8}>
            <Col>
              <Image
                height={"10px"}
                width={"10px"}
                preview={false}
                src={Hospital}
              />
            </Col>
            <Col span={20}>
              <p style={{ margin: 0 }}>{props.workPlace}</p>
            </Col>
          </Row>
          <Row style={{ marginTop: "10px" }} justify={"center"}>
            <Button
              size="large"
              style={{ backgroundColor: "#3058a6", color: "white" }}
            >
              Đặt lịch với bác sĩ
            </Button>
          </Row>
        </div>
      </Card>
    </>
  );
};

export default DoctorCard;