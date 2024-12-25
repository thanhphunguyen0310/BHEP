import { useEffect } from "react";
import { updateStatusPayment } from "../configs/api/addCoinApi";
import { useDispatch, useSelector } from "react-redux";
import { clearTransaction } from "../store/transactionSlice";
import { Button, Result } from "antd";
import {  useNavigate } from 'react-router-dom';

const SuccessPayment = () => {

    const transaction = useSelector((state) => state?.transaction?.transaction)
    console.log(transaction, "Success Payment")
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const updateTransactionStatus = async () => {
        try {
            if (transaction) {
                let id = transaction?.id
                await updateStatusPayment(id, 2);
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
        <div className="success-payment-container">
            <Result
                status="success"
                title="Thanh toán thành công"
                subTitle="Cảm ơn bạn đã tin tưởng chúng tôi."
                // subTitle="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
                // extra={[
                //     <Button type="primary" key="console" onClick={() => navigate(`/`)}>
                //         Về trang chủ
                //     </Button>,
                //     <Button key="buy" onClick={() => navigate(`/add-coin`)}>Nạp thêm</Button>,
                // ]}
            />
        </div>
    );
}

export default SuccessPayment;