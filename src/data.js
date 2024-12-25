import basicService3month from "./assets/img/bacsic-service-3month.jpg"
import basicService6month from "./assets/img/bacsic-service-6month.jpg"
import familyService12month  from "./assets/img/family-service-12month.jpg";
import spiritDevice from "./assets/img/spirit-device.jpg";

import doctor1 from "./assets/img/doctor1.jpg"
import doctor2 from "./assets/img/doctor2.jpg"
import doctor3 from "./assets/img/doctor3.jpg"
import doctor4 from "./assets/img/doctor4.jpg"
import doctor5 from "./assets/img/doctor5.jpg"
import doctor6 from "./assets/img/doctor6.jpg"

export const productData = [
    {
        id: 1,
        name: 'Gói Dịch vụ Cơ bản',
        description: "Dùng cho cá nhân",
        price: "399.000 VNĐ",
        rating: 4.5,
        image: basicService3month
    },
    {
        id: 2,
        name: 'Gói Dịch vụ Cơ bản',
        description: "Dùng cho cá nhân",
        price: "5499.000 VNĐ",
        rating: 4.6,
        image: basicService6month
    },
    {
        id: 3,
        name: 'Gói Dịch vụ Gia Đình',
        description: "Dùng cho gia đình",
        price: "679.000 VNĐ",
        rating: 4.6,
        image: familyService12month
    },
    {
        id: 4,
        name: 'Spirit',
        description: "Thiết bị đo lường Spirit",
        price: "599.000 VNĐ",
        rating: 4.6,
        image: spiritDevice
    },
];

export const doctorData = [
    {
        id: 1,
        avatar: doctor1,
        name: "Nguyễn Thành Minh",
        specialist: "Tim mạch",
        major: "Bác sĩ",
        workPlace:"Bệnh viện Chợ Rẫy",
        rating: 4.9
    },
    {
        id: 2,
        avatar: doctor2,
        name: "Trần Tuyết Trang",
        specialist: "Da liễu",
        major: "Dược sĩ",
        workPlace:"Phòng khám Minh Anh",
        rating: 4.8
    },
    {
        id: 3,
        avatar: doctor3,
        name: "Lê Minh Nhật",
        specialist: "Nội khoa",
        major: "Thạc sĩ",
        workPlace:"Bệnh viện ĐH Y Dược",
        rating: 4.7
    },
    {
        id: 4,
        avatar: doctor4,
        name: "Bùi Thanh Tùng",
        specialist: "Tai Mũi Họng",
        major: "Bác sĩ",
        workPlace:"Bệnh viện Bình Dân",
        rating: 4.6
    },
    {
        id: 5,
        avatar: doctor5,
        name: "Đoàn Công Lĩnh",
        specialist: "Xương khớp",
        major: "Tiến sĩ",
        workPlace:"Bệnh viện Hùng Vương",
        rating: 4.5
    },
    {
        id: 6,
        avatar: doctor6,
        name: "Huỳnh Giao Oanh",
        specialist: "Phụ sản",
        major: "Bác sĩ",
        workPlace:"Bệnh viện Từ Vũ",
        rating: 4.8,
    },
    {
        id: 7,
        avatar: doctor6,
        name: "Trịnh Quý Vy",
        specialist: "Nội khoa",
        major: "Bác sĩ",
        workPlace:"Bệnh viện Hòa Hảo",
        rating: 4.4,
    },
    {
        id: 8,
        avatar: doctor6,
        name: "Nguyễn Kính Trọng",
        specialist: "Thần kinh",
        major: "Bác sĩ",
        workPlace:"Bệnh viện Chợ Rẫy",
        rating: 4.3,
    },
    {
        id: 9,
        avatar: doctor6,
        name: "Huỳnh Văn Mỹ",
        specialist: "Dinh dưỡng",
        major: "Bác sĩ",
        workPlace:"Bệnh viện Nhi đồng II",
        rating: 4.2,
    },
    {
        id: 10,
        avatar: doctor6,
        name: "Lý Bách Việt",
        specialist: "Ký sinh trùng",
        major: "Bác sĩ",
        workPlace:"Bệnh viện Nhiệt đới",
        rating: 4.1,
    },
]

export const responsiveProductCart = {
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 4,
        slidesToSlide: 1 // optional, default to 1.
      },
      tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 2,
        slidesToSlide: 2 // optional, default to 1.
      },
      mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1,
        slidesToSlide: 1 // optional, default to 1.
      }
};
