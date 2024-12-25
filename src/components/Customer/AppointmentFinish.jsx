import { Result, Button } from "antd";

const AppointmentFinish = ({ paymentId }) => {

  return (
    <>
      {paymentId ? (
        <Result
          status="success"
          title="Đặt lịch thành công"
          subTitle="Cảm ơn bạn đã đặt lịch khám. Chúng tôi sẽ liên hệ với bạn sớm nhất."
        />
      ) : (
        <Result
          status="error"
          title="Đặt lịch không thành công"
          subTitle="Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại hoặc liên hệ với chúng tôi để được hỗ trợ."
          extra={[
            <Button
              type="primary"
              key="retry"
              onClick={() => window.location.reload()}
            >
              Thử lại
            </Button>,
          ]}
        />
      )}
    </>
  );
};

export default AppointmentFinish;

// useEffect(() => {
//   const query = queryString.parse(location.search);
//   console.log(query)
//   const paymentId = query.vnp_TxnRef; // Assuming vnp_TxnRef is the payment ID

//   if (query.vnp_ResponseCode === "00" && query.vnp_TransactionStatus === "00") {
//     // Payment is successful, update the state
//     setIsPaymentComplete(true);
//   } else {
//     // Payment is not successful
//     setIsPaymentComplete(false);
//   }

//   // You can also optionally check payment status from your backend using paymentId
//   // For example:
//   // getPaymentStatus(paymentId).then(response => {
//   //   if (response?.data?.status === "completed") {
//   //     setIsPaymentComplete(true);
//   //   } else {
//   //     setIsPaymentComplete(false);
//   //   }
//   // }).catch(error => {
//   //   console.error("Error fetching payment status:", error);
//   // });

//   setLoading(false);
// }, [location.search]);
