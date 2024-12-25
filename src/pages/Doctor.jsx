import { Button, Carousel, Input, Row, Select, Spin } from "antd";
import { DoubleRightOutlined } from "@ant-design/icons";
import DoctorCard from "../components/DoctorCard";
import "../styles/Doctor.scss";
import { Link, useNavigate, Outlet } from "react-router-dom";
import { getDoctor, getSpecialist } from "../configs/api/doctorApi";
import DoctorBanner1 from "../assets/img/doctor-banner1.png";
import DoctorBanner2 from "../assets/img/doctor-banner2.png";
import DoctorBanner3 from "../assets/img/doctor-banner3.png";
import { useEffect, useState, useCallback } from "react";
import debounce from "lodash/debounce";

const Doctors = () => {
  const navigate = useNavigate();

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

  const [topDoctors, setTopDoctors] = useState([]);
  const [displayedDoctors, setDisplayedDoctors] = useState([]);
  const [specialist, setSpecialist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpecialist, setSelectedSpecialist] = useState(null);
  const [searchValue, setSearchValue] = useState("");

  const fetchDoctors = async (pageIndex = 1, pageSize = 10) => {
    try {
      let res;
      const doctors = [];
      let currentPage = pageIndex;
      do {
        res = await getDoctor(currentPage, pageSize);
        doctors.push(...res.items);
        currentPage++;
      } while (currentPage <= Math.ceil(res.totalCount / pageSize));

      const sortedDoctors = doctors.sort((a, b) => b.rate - a.rate);
      const topDoctors = sortedDoctors.slice(0, 8);
      setTopDoctors(topDoctors);
      setDisplayedDoctors(topDoctors);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      setLoading(false);
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

  const removeAccents = (str) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
  };
  // search function
  const handleSearch = useCallback(
    debounce((value) => {
      const lowercasedValue = removeAccents(value.toLowerCase());

      if (!selectedSpecialist) {
        // Trường hợp không chọn chuyên khoa
        const filteredDoctors = topDoctors.filter(
          (doctor) =>
            removeAccents(doctor.fullName.toLowerCase()).includes(
              lowercasedValue
            ) ||
            removeAccents(
              getSpecialistState(doctor.specialistId).toLowerCase()
            ).includes(lowercasedValue)
        );
        setDisplayedDoctors(filteredDoctors);
      } else if (selectedSpecialist && !value) {
        // Trường hợp chỉ chọn chuyên khoa mà không nhập từ khóa
        const filteredDoctors = topDoctors.filter(
          (doctor) => doctor.specialistId === selectedSpecialist
        );
        setDisplayedDoctors(filteredDoctors);
      } else {
        // Trường hợp chọn chuyên khoa và nhập từ khóa
        const filteredDoctors = topDoctors.filter(
          (doctor) =>
            doctor.specialistId === selectedSpecialist &&
            (removeAccents(doctor.fullName.toLowerCase()).includes(
              lowercasedValue
            ) ||
              removeAccents(
                getSpecialistState(doctor.specialistId).toLowerCase()
              ).includes(lowercasedValue))
        );
        setDisplayedDoctors(filteredDoctors);
      }
    }, 300),
    [selectedSpecialist, topDoctors]
  );
  const handleSpecialistChange = (value) => {
    setSelectedSpecialist(value);
    handleSearch(searchValue);
  };
  return (
    <>
      {/* Banner doctor */}
      <Carousel style={{ width: "100vw" }} infinite={false}>
        <div>
          <img
            style={{ width: "100vw" }}
            src={DoctorBanner1}
            alt="Doctor Banner 1"
          />
        </div>
        <div>
          <img
            style={{ width: "100vw" }}
            src={DoctorBanner2}
            alt="Doctor Banner 2"
          />
        </div>
        <div>
          <img
            style={{ width: "100vw" }}
            src={DoctorBanner3}
            alt="Doctor Banner 3"
          />
        </div>
      </Carousel>

      {/* Search doctor */}
      <Row
        justify={"center"}
        align={"middle"}
        style={{ width: "100vw", height: "150px", backgroundColor: "#F5FEFE" }}
      >
        <Input.Search
          style={{ width: "50%" }}
          placeholder="Tìm theo chuyên khoa, tên bác sĩ,..."
          allowClear
          enterButton="Tìm kiếm"
          size="large"
          onSearch={handleSearch}
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
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

      {/* Doctor outstanding list */}
      <div className="doctor">
        <h1>Bác sĩ nổi bật</h1>
        <div className="doctor-content">
          <div className="doctor-items">
            {loading ? (
              <Spin />
            ) : (
              displayedDoctors.map((doctor) => (
                <Link
                  to={`/doctor-detail/${doctor.id}`}
                  key={doctor.id}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div key={doctor.id}>
                    <DoctorCard
                      avatar={doctor.avatar}
                      fullName={doctor.fullName}
                      specialistId={getSpecialistState(doctor.specialistId)}
                      description={doctor.description}
                      major={doctor.workProfile.major.name}
                      rate={doctor.rate}
                      workPlace={doctor.workProfile.workPlace}
                    />
                  </div>
                </Link>
              ))
            )}
          </div>
          <div className="doctor-button">
            <Button
              icon={<DoubleRightOutlined />}
              size="large"
              onClick={() => navigate("/all-doctor")}
              style={{ backgroundColor: "#3058a6", color: "white" }}
            >
              Tất cả Bác sĩ
            </Button>
          </div>
        </div>
      </div>
      <Outlet />
    </>
  );
};

export default Doctors;
