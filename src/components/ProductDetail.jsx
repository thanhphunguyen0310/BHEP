import {
  Avatar,
  Badge,
  Button,
  Col,
  Flex,
  Input,
  InputNumber,
  Rate,
  Row,
  Select,
  Spin,
  Typography,
  message,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/ProductDetail.scss";
import { useEffect, useState } from "react";
import { getDeviceById, getServiceById } from "../configs/api/productApi";
import { ShoppingFilled } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "../store/productSlice";
import { addToCart, updateGroupCode } from "../store/cartSlice";

const ProductDetail = () => {
  const { id, type } = useParams();
  const [product, setProduct] = useState(null);
  const [service, setService] = useState(null);
  const [device, setDevice] = useState(null);
  const [duration, setDuration] = useState(3);
  const [quantity, setQuantity] = useState(1);
  const [groupCode, setGroupCode] = useState("");
  const products = useSelector(setProducts);
  const { Text } = Typography;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const items = useSelector((state) => state?.cart);
  useEffect(() => {
    fetchProduct();
  }, [id, type]);

  // useEffect(() => {
  //   if (type == 1 || type == 2) {
  //     fetchServiceByDuration();
  //     console.log(product,"update product")
  //   }
  // }, [duration]);

  const fetchProduct = async () => {
    try {
      let response;
      if (type === "device") {
        response = await getDeviceById(id);
      } else if (type == 1 || type == 2) {
        response = await getServiceById(id);
      }
      setProduct(response.data);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  const fetchServiceByDuration = async (serviceDuration) => {
    const id = serviceDuration?.id;
    try {
      const response = await getServiceById(id);
      setProduct(response.data);
    } catch (error) {
      console.error("Error fetching service by duration:", error);
    }
  };

  const checkExistingProduct = () => {
    if (type != "device") {
      const isExistProduct = items?.cartItems.find(
        (item) => item.type == "1" || item.type == "2"
      );
      if (isExistProduct != undefined) {
        return false;
      }
    }
    return true;
  };
  const handleAddToCart = () => {
    const checkExist = checkExistingProduct();
    if (checkExist) {
      let quantityToAdd = 1;
      if (type === "device") {
        quantityToAdd = quantity; // Nếu là "device" thì lấy quantity mà người dùng chọn
      }
      const item = {
        id: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        duration: product.duration,
        type: type,
        quantity: quantityToAdd,
      };
      dispatch(addToCart(item));
      navigate("/cart");
    } else {
      message.error("Bạn không thể thêm sản phẩm này!")
    }
  };
  const handleBuyNow = () => {
    // console.log("aaaaaaaaaaaaa")
    // let quantityToAdd = 1;
    //   if (type === "device") {
    //     quantityToAdd = quantity; // Nếu là "device" thì lấy quantity mà người dùng chọn
    //   }
      const item = {
        id: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        duration: product.duration,
        type: type,
        // quantity: quantityToAdd,
      };
      console.log(item)
      // dispatch(addToCart(item));
      // navigate("/cart");
  }
  const handleCreateGroup = () => {
    const isExistType1 = items?.cartItems.some(item => item.type === "1");
  
    if (isExistType1) {
      // Display error message or handle accordingly
      message.error("Bạn không thể tạo mã gia đình vì bạn đã thêm Gói dịch vụ cá nhân ở giỏ hàng.");
    } else {
      // If no item with type === "1" exists, proceed to add the group item
      const groupItem = {
        id: `group-${Date.now()}`, // Generate a unique ID for the group item
        name: "Mã gia đình",
        price: 500000,
        duration: product.duration,
        quantity: 1,
      };
      dispatch(addToCart(groupItem));
      message.success("Mã gia đình đã được tạo và thêm vào giỏ hàng.");
    }
  };
  
  const handleInputGroupCode = (e) => {
    
    const code = e.target.value;
    console.log(code);
    setGroupCode(code);
    // setTimeout(() => {
      dispatch(updateGroupCode(code));
    // }, 200);
  };
  const handleDurationChange = (value) => {
    setDuration(value);
    // get the service base on type (1,2) and duration
    const filteredService = products.payload.products.find(
      (p) => p.type == type && p.duration === value
    );
    fetchServiceByDuration(filteredService);
    setService(filteredService);
    setProduct(filteredService);
  };
  // format display price
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  if (!product) {
    return <div>
      <Spin />
      </div>;
  }
  //Device Component
  const Device = ({ product }) => {
    return (
      <>
        <Typography.Title className="product-name">
          {product.name}
        </Typography.Title>
        <Typography.Text className="product-description">
          {product.description}
        </Typography.Text>
        <Typography.Text className="product-price">
          {formatPrice(product.price)}
        </Typography.Text>
        <Row justify={"start"} align={"middle"} className="select-quantity">
          <Typography.Text>Số lượng</Typography.Text>
          <InputNumber value={quantity} onChange={(e) => setQuantity(e)} />
        </Row>
        <Row className="btn-selection">
          <Button
            size="large"
            className="custom-button add-to-cart"
            onClick={() => handleAddToCart()}
          >
            Thêm vào giỏ hàng
          </Button>
          <Button size="large" className="custom-button buy-now">
            Mua ngay
          </Button>
        </Row>
      </>
    );
  };

  // PersonalService Component
  const PersonalService = ({ product, duration, handleDurationChange }) => {
    return (
      <>
        <Typography.Title className="product-name">
          {product.name}
        </Typography.Title>
        <Typography.Text className="product-description">
          {product.description}
        </Typography.Text>
        <Typography.Text className="product-price">
          {formatPrice(product.price)}
        </Typography.Text>
        <div>
          <Typography.Text>Phân loại: </Typography.Text>
          <Select
            value={duration}
            onChange={handleDurationChange}
            style={{ width: 100 }}
          >
            <Select.Option value={3}>3 tháng</Select.Option>
            <Select.Option value={6}>6 tháng</Select.Option>
            <Select.Option value={12}>12 tháng</Select.Option>
          </Select>
        </div>
        <Row className="btn-selection">
          <Button
            size="large"
            className="custom-button add-to-cart"
            onClick={() => handleAddToCart()}
          >
            Thêm vào giỏ hàng
          </Button>
          <Button 
            size="large" 
            className="custom-button buy-now"
            onClick={handleBuyNow}  
          >
            Mua ngay
          </Button>
        </Row>
      </>
    );
  };

  // FamilyService Component
  const FamilyService = ({ product, duration, handleDurationChange }) => {
    return (
      <>
        <Typography.Title className="product-name">
          {product.name}
        </Typography.Title>
        <Typography.Text className="product-description">
          {product.description}
        </Typography.Text>
        <Row
          className="family-code"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <Typography.Text type="secondary">
            Nhập mã nhóm đã tạo
          </Typography.Text>
          <Input
            style={{ width: "120px" }}
            rows={1}
            value={groupCode}
            onChange={handleInputGroupCode}
          />
          <Typography.Text onClick={handleCreateGroup}>
            Ấn để tạo nhóm
          </Typography.Text>
        </Row>
        <Typography.Text className="product-price">
          {formatPrice(product.price)}
        </Typography.Text>
        <div>
          <Typography.Text>Phân loại: </Typography.Text>
          <Select
            value={duration}
            onChange={handleDurationChange}
            style={{ width: 100 }}
          >
            <Select.Option value={3}>3 tháng</Select.Option>
            <Select.Option value={6}>6 tháng</Select.Option>
            <Select.Option value={12}>12 tháng</Select.Option>
          </Select>
        </div>
        <Row className="btn-selection">
          <Button
            size="large"
            className="custom-button add-to-cart"
            onClick={() => handleAddToCart()}
          >
            Thêm vào giỏ hàng
          </Button>
          <Button size="large" className="custom-button buy-now">
            Mua ngay
          </Button>
        </Row>
      </>
    );
  };
  const renderContent = () => {
    if (type === "device") {
      return <Device product={product} />;
    } else if (type == 1) {
      return (
        <PersonalService
          product={product}
          duration={duration}
          handleDurationChange={handleDurationChange}
        />
      );
    } else if (type == 2) {
      return (
        <FamilyService
          product={product}
          duration={duration}
          handleDurationChange={handleDurationChange}
        />
      );
    }
    return null;
  };

  return (
    <div className="product-detail-container">
      <div className="product-detail-content">
        <Flex className="search-bar" align="center" justify="center" gap={30}>
          <Input.Search size="large" style={{ width: "60%" }} />
          <Badge count={items?.cartTotalQuantity}>
            <Avatar
              onClick={() => navigate(`/cart`)}
              style={{ cursor: "pointer", backgroundColor: "white" }}
              size={"large"}
              icon={<ShoppingFilled style={{ color: "black" }} />}
            />
          </Badge>
        </Flex>
        <Row justify={"center"} className="product-detail-header">
          {type == 2 && (
            <Row className="note">
              <Text type="secondary">
                Lưu ý <br />
                <ul className="note-list">
                  <li>
                    Nếu chưa có bạn vui lòng tạo nhóm để sử dụng dịch vụ. Phí{" "}
                    <span className="highlight">500.000VNĐ</span>/năm
                  </li>
                  <li>
                    Nếu đã có, bạn vui lòng nhập mã nhóm (do chủ nhóm cung cấp)
                    vào ô bên dưới để sử dụng
                  </li>
                </ul>
              </Text>
            </Row>
          )}
          <Row className="content">
            <Col span={8} className={type === "device"? 'device-img': 'product-img'}>
            {/* <Col span={8} className='product-img'> */}
              <Avatar
                shape="square"
                src={product.image}
                alt="Product-image"
                className="custom-image"
              />
              {/* <Row>Ảnh dưới</Row> */}
            </Col>
            <Col span={12} className="product-content">
              {renderContent()}
            </Col>
          </Row>
        </Row>
        <Row className="product-feedback">
          <div className="feedback-content">
            <Typography.Title>ĐÁNH GIÁ SẢN PHẨM</Typography.Title>
            {product.rates && product.rates.length > 0 ? (
              <>
                <p>{product.rate / 10}/5.0</p>
                {product.rates.map((feedback, index) => (
                  <Row gutter={[12, 12]} className="comment" key={index}>
                    <Col>
                      <Avatar
                        size={"large"}
                        shape="circle"
                        src={feedback.user.avatar}
                      />
                    </Col>
                    <Col className="comment-info">
                      <Typography.Text>
                        {feedback.user.fullName}
                      </Typography.Text>
                      <Row>
                        <Rate allowHalf disabled value={feedback.rate / 10} />
                      </Row>
                      <Row>
                        <Typography.Text className="reason">
                          {feedback.reason}
                        </Typography.Text>
                      </Row>
                    </Col>
                  </Row>
                ))}
              </>
            ) : (
              <Typography.Text>Sản phẩm chưa có đánh giá</Typography.Text>
            )}
          </div>
        </Row>
      </div>
    </div>
  );
};

export default ProductDetail;
