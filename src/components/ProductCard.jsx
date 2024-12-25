import { Card, Button } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
const { Meta } = Card;

const ProductCard = (props) => {
    return (
        <Card
            hoverable
            style={{
                width: 220,
            }}
            cover={<img  alt="example" src={props.image} />}
        >
            <Meta title={props.name} description={props.description} />
            <p style={{padding:"10px 0px"}} className='price'>{props.price}</p>
            <Button type="primary"
            icon={<ShoppingCartOutlined />}>
                Thêm vào giỏ hàng
            </Button>
        </Card>
    );
}

export default ProductCard;
