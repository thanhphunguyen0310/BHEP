import { Avatar, List } from "antd";


const CancelledAppointments = ({ cancelledAppointments }) => {
    console.log(cancelledAppointments, "lịch hủy")
    return (
        <List
        style={{minHeight:"400px"}}
        itemLayout="horizontal"
        dataSource={cancelledAppointments}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src={item.customerAvatar} />}
              title={item.customerName}
              description={item.note}
            />
          </List.Item>
        )}
      />
    );
}

export default CancelledAppointments;
