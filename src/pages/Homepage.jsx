import Banner from "./../components/Banner";
import "../styles/Homepage.scss";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import DoctorCard from "../components/DoctorCard";
import { responsiveProductCart } from "../data";
import CommunityBanner from "../assets/img/community-banner.png";
import LOGO from "../assets/img/LOGO.png";
import { Button, Card, Spin, message } from "antd";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getHighRateDoctor } from "../configs/api/doctorApi";
import { getDevice, getService } from "../configs/api/productApi";
import Meta from "antd/es/card/Meta";
import Detail from "../assets/icon/details.svg";

const Homepage = () => {
  const [topRatedItems, setTopRatedItems] = useState([]);
  const [topRatedDoctors, setTopRatedDoctors] = useState([]);
  const [isProductLoading, setIsProductLoading] = useState(true)
  const [isDoctorLoading, setIsDoctorLoading] = useState(true)
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
  const fetchAllData = async () => {
    try {
      setIsProductLoading(true);
      const [deviceRes, serviceRes] = await Promise.all([
        getDevice(),
        getService(),
      ]);

      // Process devices
      const devices = deviceRes.items.map((item) => ({
        ...item,
        category: "Devices",
        type: "device",
      }));

      // Process services and categorize them
      const services = serviceRes.items.map((item) => {
        let category = "Services";
        let type = "";

        if (item.type === 1) {
          type = 1; // Goi dich vu ca nhan
        } else if (item.type === 2) {
          type = 2; // Goi dich vu gia dinh
        }

        return { ...item, category, type };
      });
      // Combine all products into one array
      const combinedData = [...devices, ...services];
      const deviceItem = combinedData.find(item => item.type === "device");
      const personalServiceItem = combinedData.find(item => item.type === 1 && item.duration === 3);
      const familyServiceItem = combinedData.find(item => item.type === 2 && item.duration === 3);

      const selectedItems = [deviceItem, personalServiceItem, familyServiceItem].filter(item => item !== undefined);
      // Sort by rate and get top rated items
      // combinedData.sort((a, b) => b.rate - a.rate);
      // const topItems = combinedData.slice(0, 3);
      setTopRatedItems(selectedItems);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsProductLoading(false);
    }
  };
  const formatDescription = (description, type) => {
    if (type === 2) {
      const splitDescription = description.split(". ");
      return `${splitDescription.slice(-2).join(". ")}...`;
    } else if (type === "device") {
      const colonIndex = description.indexOf(":");
      if (colonIndex !== -1) {
        return `${description.substring(0, colonIndex)}...`;
      }
    }
    return description;
  };

  const fetchTopRatedDoctors = async () => {
    try {
      setIsDoctorLoading(true);
      const doctors = await getHighRateDoctor();
      setTopRatedDoctors(doctors);
    } catch (error) {
      console.error("Error fetching top rated doctors:", error);
    }finally {
      setIsDoctorLoading(false);
    }
  };
  const handleProductClick = (product) => {
    navigate(`/product-detail/${product.type}/${product.id}`);
  };
  useEffect(() => {
    fetchAllData();
    fetchTopRatedDoctors();
  }, []);
  // const formatPrice = (price) => {
  //   return new Intl.NumberFormat("vi-VN", {
  //     style: "currency",
  //     currency: "VND",
  //   }).format(price);
  // };
  return (
    <>
      <Banner />

      <div className="service">
        <div className="service-content">
          <h1>Sản phẩm nổi bật</h1>
          {isProductLoading ? (
            <Spin />
          ) : (
            <Carousel
            className="carousel"
            additionalTransfrom={0}
            autoPlaySpeed={3000}
            centerMode={false}
            draggable
            focusOnSelect={false}
            infinite
            keyBoardControl
            minimumTouchDrag={80}
            pauseOnHover
            renderArrowsWhenDisabled={false}
            renderButtonGroupOutside={false}
            renderDotsOutside={false}
            arrows
            responsive={responsiveProductCart}
            containerClass="carousel-container"
            rewind={false}
            rewindWithAnimation={false}
            rtl={false}
            shouldResetAutoplay
            showDots={false}
            slidesToSlide={1}
            swipeable
          >
            {topRatedItems.map((item) => (
              <div
                key={item.id}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <Card
                  hoverable
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                    width: 250,
                    height:350
                  }}
                  cover={
                    <img
                    style={{
                      height: "150px",
                      width: "100%", 
                      objectFit: "cover",
                      objectPosition:"right"
                    }}
                      alt="example"
                      src={item.image}
                      loading="lazy"
                    />
                  }
                >
                  <Meta title={item.name} />
                  <p
                    style={{
                      fontSize:"14px",
                      marginTop:"15px",
                      fontWeight:300,
                      height:"80px"
                    }}
                    className="description"
                  >
                    {formatDescription(item.description, item.type)}
                  </p>
                  <Button
                    style={{ fontWeight: "600" }}
                    size="large"
                    type="primary"
                    icon={
                      <img
                        src={Detail}
                        alt="Details"
                        style={{ width: "16px", height: "16px" }}
                      />
                    }
                    onClick={() => handleProductClick(item)}
                  >
                    Xem chi tiết
                  </Button>
                </Card>
              </div>
            ))}
          </Carousel>
          )}
        </div>
      </div>

      <div className="doctor">
        <h1>Bác sĩ hàng đầu</h1>
        <div className="doctor-content">
        {isDoctorLoading ? (
            <Spin />
          ) : (
            <div className="doctor-items" style={{display:"flex", alignItems:"center", justifyContent:"center"}}>
            {topRatedDoctors.map((doctor) => (
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
            ))}
          </div>
          )}
        </div>
      </div>

      <div className="commnunity">
        <h1>Cộng đồng BHEP</h1>
        <div className="community-content">
          <div className="header">
            <img src={CommunityBanner} />
          </div>
          <div className="content">
            <div className="avatar">
              <img src={LOGO} />
            </div>
          </div>
          <div className="description">
            <h3>BHEP - SỨC KHỎE TỐT HƠN</h3>
            <section className="data">
              <div className="item">
                <p>15</p>
                <h4>Chủ đề</h4>
              </div>
              <div className="item">
                <p>4.5k</p>
                <h4>Bài viết</h4>
              </div>
              <div className="item">
                <p>50k</p>
                <h4>Thành viên</h4>
              </div>
            </section>
          </div>
          <Button
            onClick={() =>
              message.loading(
                "Tính năng đang được BHEP phát triển. Bạn quay lại sau nhé!"
              )
            }
          >
            Tham gia cộng đồng
          </Button>
        </div>
      </div>
    </>
  );
};

export default Homepage;
