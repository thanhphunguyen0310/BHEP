import {
  Avatar,
  Button,
  Carousel,
  Col,
  Dropdown,
  Image,
  List,
  Menu,
  Modal,
  Row,
  Typography,
  message,
} from "antd";
import "../styles/DoctorDetail.scss";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import viLocale from "dayjs/locale/vi";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { getDoctorDetail, getDoctorSchedule } from "../configs/api/doctorApi";
import DoctorBanner1 from "../assets/img/doctor-banner1.png";
import DoctorBanner2 from "../assets/img/doctor-banner2.png";
import DoctorBanner3 from "../assets/img/doctor-banner3.png";
import stethoscope from "../assets/icon/stethoscope.svg";
import hospital from "../assets/icon/hospital.svg";
import briefcase from "../assets/icon/briefcase.svg";
import star from "../assets/icon/star.svg";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import LoginForm from "../models/LoginForm";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);
dayjs.locale(viLocale);


const dateFormat = "DD-MM-YYYY";
const vietnamTimezone = "Asia/Ho_Chi_Minh";
// format dddd, upercase
const formatDay = (date) => {
  return date.format("dddd").replace(/^\w/, (c) => c.toUpperCase());
};
const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};
const data = [
  "(1986 - 1994) Bác sĩ nội khoa truyền nhiễm,Bệnh viện Nhân Dân Gia Định",
  "(1994 - 1997) Phó trưởng phòng Kế hoach tổng hợp, Bác sĩ tim mach, Bệnh viện Nhân Dân Gia Định",
  "(1997 - 1999) Phó trưởng khoa Cơ Xương khớp, Bệnh viện Nhân Dân Gia Định",
  "(2004 - 2007) Phó phòng Tổ chức cán bộ, Bệnh viện Nhân Dân Gia Định",
  "(2007 - 2008) Trưởng phòng Tổ chức cán bộ, Bệnh viện Nhân Dân Gia Định",
  "(2008 - 2010) Phó giám đốc bệnh viện, Bệnh viện Nhân Dân Gia Định",
  "(2010 - 2016) Giám đốc Trung tâm Cơ Xương khớp, Bệnh viện Nhân Dân Gia Định",
  "(2016 - 2018) Tiến sĩ Nội xương khớp, Bệnh viện Nhân Dân Gia Định",
  "(2020 - Hiện nay) Giám đốc Phòng khám, Tổ hợp y tế Mediplus",
];
const getSpecialistState = (specialistId) => {
  switch (specialistId) {
    case 1:
      return "Xương khớp";
    case 2:
      return "Tim mạch";
    case 3:
      return "Thần kinh";
    case 4:
      return "Tai mũi họng";
    case 5:
      return "Răng hàm mặt";
    case 6:
      return "Phụ sản";
    case 7:
      return "Nội khoa";
    case 8:
      return "Ký sinh trùng";
    case 9:
      return "Hô hấp";
    case 10:
      return "Dinh dưỡng";
    default:
      return "Không xác định";
  }
};
const getMajorState = (majorId) => {
  switch (majorId) {
    case 1:
      return "Bác sĩ";
    case 2:
      return "Dược sĩ";
    case 3:
        return "Y tá";
    case 4:
        return "Điều dưỡng";
    case 5:
        return "Kỹ thuật viên y tế";
    default:
      return " ";
  }
};
const DoctorDetail = () => {
  const navigate = useNavigate();
  const userRole = useSelector((state) => state.auth?.user?.data?.user?.roleId);
  const { id } = useParams();
  //set timezone VietNam
  const today = dayjs().tz(vietnamTimezone);
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [doctorDetail, setDoctorDetail] = useState("");
  const [openLoginForm, setOpenLoginForm] = useState(false)

  const handleDateChange = async (date) => {
    const localDate = date.tz(vietnamTimezone);
    setSelectedDate(localDate);
    try {
      const doctorTime = await getDoctorSchedule(id);
      const filteredSchedule = doctorTime.filter((appointment) =>
        dayjs(appointment.date, dateFormat).isSame(date, "day")
      );
      setSchedule(filteredSchedule);
    } catch (error) {
      console.error("Error fetching schedule:", error);
    }
  };
  // get doctor data
  const fetchDoctorDetail = async () => {
    try {
      const doctorData = await getDoctorDetail(id);
      setDoctorDetail(doctorData.data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const handleTimeSlotSelect = (slot) => {
    setSelectedTimeSlot(slot);
  };
  useEffect(() => {
    fetchDoctorDetail();
    handleDateChange(today);
  }, [id]);
  const handleBookingAppointment = () => {
    if(!userRole) {
      message.error("Vui lòng đăng nhập để đặt lịch hẹn!")
      setOpenLoginForm(true);
    } else if (selectedDate && selectedTimeSlot) {
      const schedule = {
        date: selectedDate.format(dateFormat),
        time: selectedTimeSlot
      };
      const doctor = {
        id,
        workPlace: doctorDetail?.workProfile?.workPlace,
        fullName: doctorDetail?.fullName,
        price: doctorDetail?.workProfile?.price
      };
      navigate('/booking-appointment', { state: { doctor, schedule } });
    } else {
      message.error('Bạn chưa chọn lịch hẹn');
    }
  };
  const closeLoginModal = () => {
    setOpenLoginForm(false);
  };
  return (
    <>
      {/* banner doctor */}
      <Carousel style={{ width: "100vw" }} infinite={false}>
        <div>
          <img style={{ width: "100vw" }} src={DoctorBanner1} />
        </div>
        <div>
          <img style={{ width: "100vw" }} src={DoctorBanner2} />
        </div>
        <div>
          <img style={{ width: "100vw" }} src={DoctorBanner3} />
        </div>
      </Carousel>
      {/* doctor infor */}
        <Row
        justify={"center"}
        style={{ backgroundColor: "#D7ECFF", width: "100vw" }}
      >
        <Row
          style={{
            borderRadius: "8px",
            width: "80%",
            margin: "20px 0px",
            backgroundColor: "white",
          }}
          justify="space-around"
          gutter={{
            xs: 8,
            sm: 16,
            md: 24,
            lg: 32,
          }}
        >
          <Col
            span={8}
            style={{
              justifyContent: "flex-end",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Avatar src={doctorDetail.avatar} size={160} shape="square" />
          </Col>

          <Col style={{ padding: "24px 20px" }} span={16}>
            <Row
              style={{
                justifyContent: "flex-start",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Row style={{display:"flex", flexDirection:"column", alignItems:"flex-start"}}>
              <Typography.Title
                style={{
                  marginBottom: "0px",
                  fontSize: "20px",
                  fontWeight: "500",
                }}
              >
              {getMajorState(doctorDetail?.workProfile?.majorId)}{". "} {doctorDetail?.fullName}
              </Typography.Title>
              <Typography.Text style={{fontSize:"20px", fontWeight:"500", color:"#3058A6"}}>
                {formatPrice(doctorDetail?.workProfile?.price)}
              </Typography.Text>
                </Row>
              <Row align={"middle"}>
                <Col span={12}>
                  <Row
                    style={{ padding: "10px 0px" }}
                    align="middle"
                    gutter={8}
                  >
                    <Col>
                      <Image
                        height={"20px"}
                        width={"20px"}
                        preview={false}
                        src={stethoscope}
                      />
                    </Col>
                    <Col>
                      <p style={{ margin: 0 }}>{getSpecialistState(doctorDetail?.workProfile?.specialistId)}</p>
                    </Col>
                  </Row>

                  <Row
                    style={{ padding: "10px 0px" }}
                    align="middle"
                    gutter={8}
                  >
                    <Col>
                      <Image
                        height={"20px"}
                        width={"20px"}
                        preview={false}
                        src={hospital}
                      />
                    </Col>
                    <Col>
                      <p style={{ margin: 0 }}>{doctorDetail?.workProfile?.workPlace}</p>
                    </Col>
                  </Row>
                </Col>
                <Col span={12}>
                  <Row
                    style={{ padding: "10px 0px" }}
                    align="middle"
                    gutter={8}
                  >
                    <Col>
                      <Image
                        height={"20px"}
                        width={"20px"}
                        preview={false}
                        src={briefcase}
                      />
                    </Col>
                    <Col>
                      <p style={{ margin: 0 }}>Lượt đặt: {doctorDetail?.workProfile?.appointmentDone}</p>
                    </Col>
                  </Row>

                  <Row
                    style={{ padding: "10px 0px" }}
                    align="middle"
                    gutter={8}
                  >
                    <Col>
                      <Image
                        height={"20px"}
                        width={"20px"}
                        preview={false}
                        src={star}
                      />
                    </Col>
                    <Col>
                      <p style={{ margin: 0 }}>Đánh giá: {doctorDetail?.rate}</p>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Row>
          </Col>
        </Row>
      </Row>
      {/* doctor schedule */}
      <Row
        className="schedule-container"
        justify={"center"}
        style={{
          width: "100vw",
          backgroundColor: "#D7ECFF",
          padding: "24px 0px",
        }}
      >
        <Row
          className="time-booking"
          align={"top"}
          justify={"center"}
          style={{
            width: "80%",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "white",
            padding: "24px 16px",
            borderRadius: "8px",
          }}
        >
          <Row
            className="header-time-picker"
            align={"center"}
            style={{ flexWrap: "wrap", width: "70%", alignItems: "center" }}
          >
            <Col span={4}>
              <Typography.Title
                style={{
                  fontSize: "16px",
                  fontWeight: "650",
                  marginBottom: "0",
                }}
              >
                Lịch hẹn
              </Typography.Title>
            </Col>
            <Col span={8}>
              <Dropdown
                className="custom-dropdown"
                placement="bottomLeft"
                arrow
                overlay={
                  <Menu>
                    {[...Array(7)].map((_, index) => {
                      const date = today
                        .clone()
                        .add(index, "days")
                        .tz(vietnamTimezone);
                      const isToday = date.isSame(today, "day");
                      return (
                        <Menu.Item
                          key={index}
                          onClick={() => handleDateChange(date)}
                          className={isToday ? "highlight-today" : ""}
                        >
                          <Row
                            gutter={[8, 8]}
                            align={"middle"}
                            justify={"center"}
                          >
                            <Col span={7}>{formatDay(date)}</Col>
                            <Col span={10}>{date.format("DD-MM-YYYY")}</Col>
                          </Row>
                        </Menu.Item>
                      );
                    })}
                  </Menu>
                }
                trigger={["click"]}
              >
                <a
                  className="ant-dropdown-link"
                  onClick={(e) => e.preventDefault()}
                >
                  <Row
                    style={{
                      border: "1px solid #d9d9d9",
                      width: "fit-content",
                      padding: "4px 11px",
                      borderRadius: "2px",
                      transition: "border .3s,box-shadow .3s",
                    }}
                    gutter={[8, 8]}
                    align={"middle"}
                    justify={"start"}
                  >
                    <Col style={{ fontWeight: "650", fontSize: "16px" }}>
                      {formatDay(selectedDate)},
                    </Col>
                    <Col style={{ fontWeight: "650", fontSize: "16px" }}>
                      {selectedDate.format("DD-MM-YYYY")}
                    </Col>
                  </Row>
                </a>
              </Dropdown>
            </Col>
          </Row>
          <Row
            className="time-picker"
            align={"middle"}
            justify={"start"}
            style={{ width: "100%", marginTop: "16px" }}
          >
            <Row
              style={{
                marginLeft: "100px",
                padding: "0px 110px",
                display: "flex",
                flexWrap: "wrap",
              }}
              align={"top"}
              justify={"start"}
              gutter={[8, 8]}
            >
              {schedule.length > 0 ? (
                schedule[0].time.map((time, index) => (
                  <Col key={index}>
                    <Button
                      type={selectedTimeSlot === time ? "primary" : "default"}
                      onClick={() => handleTimeSlotSelect(time)}
                    >
                      {time}
                    </Button>
                  </Col>
                ))
              ) : (
                <Typography.Text>
                  Bác sĩ chưa làm việc vào ngày này
                </Typography.Text>
              )}
            </Row>
          </Row>
          <Row style={{ width: "90%" }} justify={"end"} className="booking-btn">
            <Button onClick={handleBookingAppointment}>Đặt lịch ngay</Button>
          </Row>
        </Row>
      </Row>
      {/* doctor experience */}
      {/* <Row
        className="doctor-experience-container"
        justify={"center"}
        style={{ width: "100vw", padding: "24px 0px" }}
      >
        <Row
          className="doctor-experience-content"
          style={{ marginTop: "1rem", width: "60%" }}
        >
          <Row
            align={"top"}
            className="work-experience"
            style={{ display: "flex", flexDirection: "column", width: "80%" }}
          >
            <Typography.Title level={5.5}>
              Kinh nghiệm làm việc
            </Typography.Title>
            <p>
              Giám đốc Phòng khám Tổ hợp Y tế Mediplus Nguyên Phó Giám đốc Bệnh
              viện Nhân Dân Gia Định. Hơn 30 năm kinh nghiệm khám và điều trị
              các bệnh nội cơ xương khớp Bác sĩ nhận khám bệnh nhân từ 16 tuổi
              trở lên
            </p>
          </Row>
          <Row
            align={"top"}
            className="work-experience"
            style={{
              display: "flex",
              flexDirection: "column",
              width: "80%",
              marginTop: "1.5rem",
            }}
          >
            <Typography.Title level={5.5}>Quá trình công tác</Typography.Title>
            <List
              dataSource={data}
              renderItem={(item) => (
                <List.Item>
                  <Typography.Text>{item}</Typography.Text>
                </List.Item>
              )}
            />
          </Row>
        </Row>
      </Row> */}
      <Modal
        title="Đăng nhập"
        open={openLoginForm}
        onCancel={closeLoginModal}
        footer={null}
      >
        <LoginForm closeForm={closeLoginModal} />
      </Modal>
    </>
  );
};

export default DoctorDetail;
