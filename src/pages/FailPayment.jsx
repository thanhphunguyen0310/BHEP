import { Button, Result } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearTransaction } from "../store/transactionSlice";
import { updateStatusPayment } from "../configs/api/addCoinApi";
import { useEffect } from 'react';
const FailPayment = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const transaction = useSelector((state) => state?.transaction?.transaction);
    const updateTransactionStatus = async () => {
        try {
            if (transaction) {
                let id = transaction?.id
                await updateStatusPayment(id, -1);
            }
        } catch (error) {
            console.log("Error: ", error)
        }
    }
    useEffect(() => {
        updateTransactionStatus();
        dispatch(clearTransaction())
    }, [])
    return (
        <div className="fail-payment-container">
            <Result
                status="error"
                title="Giao dịch thất bại"
                subTitle="Vui lòng kiểm tra lại thông tin."
                // extra={[
                //     <Button type="primary" key="console" onClick={() => navigate(`/`)}>
                //         Về trang chủ
                //     </Button>,
                //     <Button key="buy" onClick={() => navigate(`/add-coin`)}>Thực hiện lại</Button>,
                // ]}
            >
            </Result>
        </div>
    );
}

export default FailPayment;