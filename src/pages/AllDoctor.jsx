import {
  Avatar,
  Card,
  Carousel,
  Col,
  Image,
  Input,
  Pagination,
  Row,
  Select,
  Typography,
} from "antd";
import DoctorBanner1 from "../assets/img/doctor-banner1.png";
import DoctorBanner2 from "../assets/img/doctor-banner2.png";
import DoctorBanner3 from "../assets/img/doctor-banner3.png";
import stethoscope from "../assets/icon/stethoscope.svg";
import hospital from "../assets/icon/hospital.svg";
import { SearchOutlined, StarFilled } from "@ant-design/icons";
import "../styles/AllDoctor.scss";
import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { getDoctor, getSpecialist } from "../configs/api/doctorApi";
import debounce from "lodash/debounce";

const { Meta } = Card;

const AllDoctor = () => {
  const [allDoctors, setAllDoctors] = useState([]);
  const [displayedDoctors, setDisplayedDoctors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [specialist, setSpecialist] = useState([]);
  const [selectedSpecialist, setSelectedSpecialist] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const pageSize = 8; // Number of doctors per page

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

  const fetchDoctors = async () => {
    try {
      let res;
      const doctors = [];
      let currentPage = 1;
      do {
        res = await getDoctor(currentPage, pageSize);
        doctors.push(...res.items);
        currentPage++;
      } while (currentPage <= Math.ceil(res.totalCount / pageSize));
      setAllDoctors(doctors);
      setDisplayedDoctors(doctors.slice(0, pageSize));
      setTotalDoctors(doctors.length);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };
  const fetchSpecialist = async () => {
    try {
      const response = await getSpecialist();
      setSpecialist(response.data.items);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };
  useEffect(() => {
    fetchDoctors();
    fetchSpecialist();
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setDisplayedDoctors(
      allDoctors.slice((page - 1) * pageSize, page * pageSize)
    );
  };

  const removeAccents = (str) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
  };

  const handleSearch = useCallback(
    debounce((value) => {
      const lowercasedValue = removeAccents(value.toLowerCase());
  
      if (!selectedSpecialist && !value) {
        // Trường hợp không chọn chuyên khoa và không nhập từ khóa
        setDisplayedDoctors(allDoctors.slice(0, pageSize));
        setTotalDoctors(allDoctors.length);
      } else if (selectedSpecialist && !value) {
        // Trường hợp chỉ chọn chuyên khoa không nhập từ khóa
        const filteredDoctors = allDoctors.filter(
          (doctor) => doctor.specialistId === selectedSpecialist
        );
        setDisplayedDoctors(filteredDoctors.slice(0, pageSize));
        setTotalDoctors(filteredDoctors.length);
      } else if (!selectedSpecialist && value) {
        // Trường hợp chỉ nhập từ khóa không chọn chuyên khoa
        const filteredDoctors = allDoctors.filter(
          (doctor) =>
            removeAccents(doctor.fullName.toLowerCase()).includes(lowercasedValue) ||
            removeAccents(getSpecialistState(doctor.specialistId).toLowerCase()).includes(lowercasedValue)
        );
        setDisplayedDoctors(filteredDoctors.slice(0, pageSize));
        setTotalDoctors(filteredDoctors.length);
      } else {
        // Trường hợp vừa chọn chuyên khoa vừa nhập từ khóa
        const filteredDoctors = allDoctors.filter(
          (doctor) =>
            doctor.specialistId === selectedSpecialist &&
            (removeAccents(doctor.fullName.toLowerCase()).includes(lowercasedValue) ||
              removeAccents(getSpecialistState(doctor.specialistId).toLowerCase()).includes(lowercasedValue))
        );
        setDisplayedDoctors(filteredDoctors.slice(0, pageSize));
        setTotalDoctors(filteredDoctors.length);
      }
    }, 300),
    [allDoctors, selectedSpecialist, pageSize]
  );
  
  const handleSpecialistChange = (value) => {
    setSelectedSpecialist(value);
    handleSearch(searchValue);
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

      {/* search doctor */}
      <Row
        justify={"center"}
        align={"middle"}
        style={{ width: "100vw", height: "150px", backgroundColor: "#F5FEFE" }}
      >
        <Input.Search
          prefix={
            <SearchOutlined
              style={{
                color: "rgba(0,0,0,.25)",
              }}
            />
          }
          style={{ width: "50%" }}
          placeholder="Tìm theo chuyên khoa, tên bác sĩ,..."
          allowClear
          enterButton="Tìm kiếm"
          size="large"
          onSearch={handleSearch}
          onChange={(e) => handleSearch(e.target.value)}
          addonBefore={
            <Select
              placeholder="Chuyên khoa"
              style={{
                width: 120,
              }}
              allowClear
              onChange={handleSpecialistChange}
              options={specialist.map((s) => ({ value: s.id, label: s.name }))}
            />
          }
        />
      </Row>

      <div className="doctor-container">
        <div className="title">
          <Typography.Title level={6}>Tất cả bác sĩ</Typography.Title>
        </div>
        <div className="all-doctor">
          <div className="doctor-card-list">
            {displayedDoctors.map((doctor) => (
              <Link
                to={`/doctor-detail/${doctor.id}`}
                key={doctor.id}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Card
                  key={doctor.id}
                  hoverable
                  bordered={false}
                  style={{
                    width: "256px",
                    margin: "10px",
                  }}
                >
                  <Meta
                    avatar={
                      <Avatar
                        size={70}
                        src={doctor.avatar || "https://via.placeholder.com/70"}
                        shape="square"
                      />
                    }
                    title={
                      <div
                        style={{
                          fontSize: "13px",
                          maxWidth: "200px",
                          whiteSpace: "normal",
                          wordWrap: "break-word",
                          display: "flex",
                          justifyContent: "flex-start",
                        }}
                      >
                        <span>
                          <p style={{fontWeight:400}}>{doctor.workProfile.major.name}</p>
                          <p>{doctor.fullName}</p>
                        </span>
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
                          <Col>{doctor.rate}</Col>
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
                          src={stethoscope}
                        />
                      </Col>
                      <Col>
                        <p style={{ margin: 0 }}>
                          {getSpecialistState(doctor.specialistId)}
                        </p>
                      </Col>
                    </Row>
                    <Row style={{height:"50px"}} align="middle" gutter={8}>
                      <Col>
                        <Image
                          height={"10px"}
                          width={"10px"}
                          preview={false}
                          src={hospital}
                        />
                      </Col>
                      <Col span={20}>
                        <p style={{ margin: 0 }}>{doctor.workProfile.workPlace}</p>
                      </Col>
                    </Row>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
        {/* Pagination */}
        <Row
          className="pagination"
          justify={"end"}
          style={{
            width: "70%",
            padding: "20px 0px",
          }}
        >
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={totalDoctors}
            onChange={handlePageChange}
            style={{ textAlign: "center", marginTop: "20px" }}
          />
        </Row>
      </div>
    </>
  );
};

export default AllDoctor;
