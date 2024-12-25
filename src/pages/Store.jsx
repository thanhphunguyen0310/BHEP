import {
  Avatar,
  Col,
  Flex,
  Image,
  Input,
  Row,
  Typography,
  Card,
  Button,
  Badge,
  Spin,
} from "antd";
import { ShoppingFilled, ShoppingCartOutlined } from "@ant-design/icons";
import category from "../assets/icon/category.svg";
import "../styles/Store.scss";
import { responsiveProductCart } from "./../data";
import Carousel from "react-multi-carousel";
import { getDevice, getService } from "../configs/api/productApi";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { setProducts } from "../store/productSlice";
import Meta from "antd/es/card/Meta";
import { useDispatch, useSelector } from "react-redux";
import { getTotal, setLocalToCart } from "../store/cartSlice";
import Detail from "../assets/icon/details.svg"

const Store = () => {
  const [product, setProduct] = useState([]);
  const [device, setDevice] = useState([]);
  const [service, setService] = useState([]);
  const [topRatedItems, setTopRatedItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const items = useSelector((state) => state?.cart);

  const fetchAllData = async () => {
    try {
      setLoading(true);
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
      // Set states
      setDevice(devices);
      setService(services);

      // Combine all products into one array
      const combinedData = [...devices, ...services];
      // Set product state
      setProduct(combinedData);
      // Sort by rate and get top rated items
      combinedData.sort((a, b) => b.rate - a.rate);
      const topItems = combinedData.slice(0, 3);
      //store to redux
      dispatch(setProducts(combinedData));
      setTopRatedItems(topItems);
    } catch (error) {
      console.error("Error fetching data:", error);
    }finally {
      setLoading(false); 
    }
  };
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cartItems"))
    dispatch(setLocalToCart(cart));
    dispatch(getTotal());
  }, []);
  // const checkExistingProduct = () => {
  //   if (product?.type != "device") {
  //     const isExistProduct = items?.cartItems.find(
  //       (item) => item.type === 1 || item.type === 2
  //     );
  //     if (isExistProduct != undefined) {
  //       return false;
  //     }
  //   }
  //   return true;
  // };
  // const handleAddToCart = () => {
  //   const checkExist = checkExistingProduct();
  //   if (checkExist) {
  //     let quantityToAdd = 1;
  //     if (product?.type === "device") {
  //       quantityToAdd = quantityToAdd; // Nếu là "device" thì lấy quantity mà người dùng chọn
  //     }
  //     const item = {
  //       id: product.id,
  //       name: product.name,
  //       image: product.image,
  //       price: product.price,
  //       duration: product.duration,
  //       type: product.type,
  //       quantity: quantityToAdd,
  //     };
  //     dispatch(addToCart(item));
  //     navigate("/cart");
  //   } else {
  //     message.error("Bạn không thể thêm sản phẩm này!")
  //   }
  // };
  const filterProductsByCategory = () => {
    if (selectedCategory === "device") {
      return product.filter(
        (item) => item.category === "Devices" && item.type === "device"
      );
    } else if (selectedCategory === "service") {
      return product.filter(
        (item) => item.category === "Services" && item.duration === 3
      );
    } else {
      return product.filter(
        (item) =>
          item.category === "Devices" ||
          (item.category === "Services" && item.duration === 3)
      );
    }
  };
  // filter device or service in top product
  const filterTopRatedItemsByCategory = () => {
    if (selectedCategory === "device") {
      return device.slice(0, 3);
    } else if (selectedCategory === "service") {
      return service.slice(0, 3);
    } else {
      return topRatedItems;
    }
  };

  const handleProductClick = (product) => {
    navigate(`/product-detail/${product.type}/${product.id}`);
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

  useEffect(() => {
    fetchAllData();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="store-container">
      {/* search bar */}
      <Flex className="search-bar" align="center" justify="center" gap={30}>
        <Input.Search size="large" style={{ width: "60%" }} />
        <Badge count={items?.cartTotalQuantity}>
        <Avatar
          onClick={() => navigate(`/cart`)}
          style={{ cursor:"pointer" ,backgroundColor: "white" }}
          size={"large"}
          icon={<ShoppingFilled style={{ color: "black" }} />}
        />
        </Badge>
      </Flex>
      {/* navigation */}
      <Row
        align={"middle"}
        justify={"center"}
        className="category-container"
        style={{ width: "100vw", margin: "16px 0px" }}
      >
        <Row className="category-content">
          <Col
            span={4}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0px 10px",
              cursor: "pointer",
            }}
            onClick={() => setSelectedCategory("all")}
          >
            <Image style={{ width: "25px", height: "25px" }} src={category} />
            <Typography.Title
              style={{
                marginBottom: "0px",
                fontSize: "25px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Danh mục
            </Typography.Title>
          </Col>
          <Col
            span={20}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Row style={{ width: "100%" }} justify={"center"}>
              <Col
                span={8}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <Typography.Title
                  style={{
                    marginBottom: "0px",
                    fontSize: "25px",
                    fontWeight: "600",
                  }}
                  className="category-item"
                  onClick={() => setSelectedCategory("device")}
                >
                  Thiết bị
                </Typography.Title>
              </Col>
              <Col
                span={8}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <Typography.Title
                  style={{
                    marginBottom: "0px",
                    fontSize: "25px",
                    fontWeight: "600",
                  }}
                  className="category-item"
                  onClick={() => setSelectedCategory("service")}
                >
                  Dịch vụ
                </Typography.Title>
              </Col>
            </Row>
          </Col>
        </Row>
      </Row>
      {/* top product */}
      <Row
        className="top-product-container"
        align={"middle"}
        justify={"center"}
        style={{ width: "100vw", margin: "16px 0px" }}
      >
        <Row
          className="top-product-content"
          style={{
            width: "100%",
            backgroundColor: "white",
            margin: "0px 100px",
            padding: "25px 37px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography.Title level={6}>SẢN PHẨM PHỔ BIẾN</Typography.Title>
          {loading ? (
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
            {filterTopRatedItemsByCategory().map((item) => (
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
                    width: 220,
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
                  <p style={{ padding: "10px 0px", color:"#3058A6", fontWeight:"500 " }} className="price">
                    {formatPrice(item.price)}
                  </p>
                  <Button
                    style={{ fontWeight: "600", width:"180px" }}
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

        </Row>
      </Row>
      {/* all product */}
      <Row
        className="all-product-container"
        align={"middle"}
        justify={"center"}
        style={{ width: "100vw", margin: "16px 0px" }}
      >
        <Row
          className="all-product-content"
          style={{
            width: "100%",
            backgroundColor: "white",
            margin: "0px 100px",
            padding: "25px 37px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography.Title level={6}>TẤT CẢ SẢN PHẨM</Typography.Title>
          {loading ? (
            <Spin />
          ) : (
            <div className="product-card-list">
            {filterProductsByCategory().map((product) => (
              <div key={product.id} style={{display:"flex", justifyContent:"center"}}>
                <Card
                  hoverable
                  style={{
                    width: 220,
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
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
                      src={product.image}
                    />
                  }
                >
                  <Meta title={product.name} />
                  <p>{formatDescription(product.description, product.type)}</p>
                  <Button
                    style={{ fontWeight: "600", width:"180px" }}
                    size="large"
                    type="primary"
                    icon={
                      <img
                        src={Detail}
                        alt="Details"
                        style={{ width: "16px", height: "16px" }}
                      />
                    }
                    onClick={() => handleProductClick(product)}
                  >
                    Xem chi tiết
                  </Button>
                </Card>
              </div>
            ))}
          </div>
          )}
        </Row>
      </Row>
    </div>
  );
};

export default Store;

// const items = [
//   {
//     label: "Thấp đến cao",
//     key: "1",
//   },
//   {
//     label: "Cao đến thấp",
//     key: "2",
//   },
// ];
{
  /* filter price */
}
{
  /* <Row style={{ width: "100vw" }}>
        <Flex
          align="center"
          justify="flex-start"
          style={{
            width: "200px",
            height: "64px",
            backgroundColor: "white",
            marginLeft: "100px",
          }}
        >
          <Dropdown
            menu={{
              items,
            }}
          >
            <a
              style={{ padding: "0px 36px" }}
              onClick={(e) => e.preventDefault()}
            >
              <Space
                style={{ color: "black", fontSize: "18px", gap: "0px 15px" }}
              >
                Giá
                <DownOutlined />
              </Space>
            </a>
          </Dropdown>
        </Flex>
      </Row> */
}
// const fetchAllDevices = async () => {
//   try {
//     const res = await getDevice();
//     console.log(res.items, "thiet bi");
//     setDevice(res.items);
//   } catch (error) {
//     console.error("Error fetching top rated doctors:", error);
//   }
// };

// const fetchAllServices = async () => {
//   try {
//     const res = await getService();
//     console.log(res.items, "dich vu");
//     setService(res.items);
//   } catch (error) {
//     console.error("Error fetching top rated doctors:", error);
//   }
// };

{
  /* <ProductCard
                  name={product.name}
                  image={product.image}
                  description={formatDescription(
                    product.description,
                    product.type
                  )}
                /> */
}
{
  /* <ProductCard
                  name={item.name}
                  image={item.image}
                  price={formatPrice(item.price)}
                /> */
}
