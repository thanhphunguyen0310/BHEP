import { useState, useEffect } from "react";
import {
  Modal,
  TimePicker,
  Form,
  Typography,
  Button,
  List,
  message,
} from "antd";
import Calendar from "react-calendar";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import viLocale from "dayjs/locale/vi";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "../../styles/DoctorSchedule.scss";
import "react-calendar/dist/Calendar.css";
import {
  createDoctorSchedule,
  updateDoctorSchedule,
  getDoctorSchedule,
  deleteDoctorSchedule,
} from "../../configs/api/doctorApi";
import { useSelector } from "react-redux";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);
dayjs.locale(viLocale);

const DoctorSchedule = ({ open, onOk, onCancel }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [timeRange, setCurrentRange] = useState(null);
  const [schedules, setSchedules] = useState({});
  const [existingSchedules, setExistingSchedules] = useState({});
  const [fetchedSchedules, setFetchedSchedules] = useState(null);
  
  const employeeId = useSelector((state) => state.auth?.user?.data?.user?.id);

  const vietnamTimezone = "Asia/Ho_Chi_Minh";
  const today = dayjs().tz(vietnamTimezone).startOf("day");

  const onDateChange = (date) => {
    setSelectedDate(date);
    setCurrentRange(null);
  };

  const onTimeChange = (time) => {
    setCurrentRange(time);
  };

  const addTimeRange = () => {
    if (timeRange && timeRange.length === 2) {
      const dateStr = dayjs(selectedDate).format("DD-MM-YYYY");
      const newRange = {
        range: [
          dayjs(timeRange[0]).tz(vietnamTimezone).format("HH:mm"),
          dayjs(timeRange[1]).tz(vietnamTimezone).format("HH:mm"),
        ],
      };
      const existingRanges = schedules[dateStr] || [];
      const isDuplicate = existingRanges.some(
        (existingRange) =>
          existingRange.range[0] == newRange.range[0] &&
          existingRange.range[1] == newRange.range[1]
      );
      // check date exist
      if (isDuplicate) {
        message.warning("Thời gian này đã được tạo.");
        return;
      }

      setSchedules((prevSchedules) => ({
        ...prevSchedules,
        [dateStr]: prevSchedules[dateStr]
          ? [...prevSchedules[dateStr], newRange]
          : [newRange],
      }));

      setCurrentRange(null);
    } else {
      message.warning("Vui lòng chọn một khoảng thời gian hợp lệ.");
    }
  };

  const removeTimeRange = (dateStr, index) => {
    setSchedules((prevSchedules) => {
      const newSchedules = { ...prevSchedules };
      newSchedules[dateStr].splice(index, 1);
      if (newSchedules[dateStr].length === 0) {
        delete newSchedules[dateStr];
      }
      return newSchedules;
    });
  };
  // get schedule data
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const fetchedSchedules = await getDoctorSchedule(employeeId);
        if (!fetchedSchedules.isSuccess && fetchedSchedules.statusCode === 404) {
          message.info("Bạn chưa tạo lịch làm việc");
          setFetchedSchedules([]);
          setSchedules({});
          setExistingSchedules({});
          return;
        }
        const formattedSchedules = fetchedSchedules.reduce((acc, schedule) => {
          const dateStr = schedule.date;
          const timeRanges = schedule.time.map((timeRange) => {
            return {
              range: timeRange.split("-"),
            };
          });
          acc[dateStr] = timeRanges;
          return acc;
        }, {});
        setFetchedSchedules(fetchedSchedules)
        setSchedules(formattedSchedules);
        setExistingSchedules(formattedSchedules);
      } catch (error) {
        message.error("Có lỗi xảy ra khi lấy lịch làm việc: " + error.statusCode);
      }
    };

    if (open) {
      fetchSchedules();
    }
  }, [open, employeeId]);

  const handleOk = async () => {
    // check user need to choose time
    if (Object.keys(schedules).length === 0) {
      message.warning("Vui lòng chọn ít nhất một ngày và khoảng thời gian.");
      return;
    }

    const dateStr = dayjs(selectedDate).format("DD-MM-YYYY");
    const selectedDateSchedules = schedules[dateStr] || [];
    const existingRanges = existingSchedules[dateStr] || [];
    const newSchedules = selectedDateSchedules.filter((range) => {
      // const existingRanges = existingSchedules[dateStr] || [];
      return !existingRanges.some(
        (existingRange) =>
          existingRange.range[0] == range.range[0] &&
          existingRange.range[1] == range.range[1]
      );
    });
    const allSchedules = [...existingRanges, ...newSchedules];

    if (Object.keys(allSchedules).length === 0) {
      message.warning("Không có lịch mới nào được tạo.");
      return;
    }

    const formattedSchedules = [
      {
        date: dateStr,
        time: allSchedules.map((range) => {
          const startTime = range.range[0];
          const endTime = range.range[1];

          return `${startTime}-${endTime}`;
        }),
      },
    ];
    const timeSlot = formattedSchedules[0].time;
    try {
      let response;
      if (existingSchedules[dateStr]) {
        response = await updateDoctorSchedule(employeeId, dateStr, timeSlot);
      } else {
        response = await createDoctorSchedule(employeeId, formattedSchedules);
      }
  
      if (response) {
        message.success("Tạo lịch làm việc thành công!");
        // Update schedules and existingSchedules after successful creation/update
        const updatedSchedules = {
          ...schedules,
          [dateStr]: allSchedules,
        };
        const updatedExistingSchedules = {
          ...existingSchedules,
          [dateStr]: allSchedules,
        };
  
        setSchedules(updatedSchedules);
        setExistingSchedules(updatedExistingSchedules);
  
        setSelectedDate(null);
        setCurrentRange(null);
        onOk();
      } else {
        message.error(`Có lỗi xảy ra: ${response.message}`);
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi tạo lịch làm việc: " + error.message);
    }
  };

  const handleCancel = () => {
    setSelectedDate(null);
    setCurrentRange(null);
    setSchedules({});
    onCancel();
  };

  const handleDeleteSchedule = () => {
    const dateStr = dayjs(selectedDate).format("DD-MM-YYYY");
    const selectedSchedule = fetchedSchedules.find(schedule => schedule.date === dateStr);
    const { id } = selectedSchedule;
    // bắt lỗi lại
    if (!selectedSchedule || !id) {
      message.error("Không tìm thấy lịch làm việc để xóa.");
      return;
    }

    // Show confirmation dialog before deleting the schedule
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: `Bạn có chắc muốn xóa lịch ${dateStr}?`,
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await deleteDoctorSchedule(id, employeeId);
          message.success("Lịch làm việc đã được xóa thành công!");
         // Update schedules and existingSchedules after deletion
        const updatedSchedules = { ...schedules };
        const updatedExistingSchedules = { ...existingSchedules };

        // Remove the deleted schedule from schedules
        if (updatedSchedules[dateStr]) {
          delete updatedSchedules[dateStr];
        }

        // Remove the deleted schedule from existingSchedules
        if (updatedExistingSchedules[dateStr]) {
          delete updatedExistingSchedules[dateStr];
        }

        // Update state
        setSchedules(updatedSchedules);
        setExistingSchedules(updatedExistingSchedules);
        } catch (error) {
          message.error("Có lỗi xảy ra khi xóa lịch làm việc: " + error.message);
        }
      },
    });
  };
  const filteredSchedules = Object.entries(schedules)
    .filter(([date]) => {
      const scheduleDate = dayjs(date, "DD-MM-YYYY");
      return scheduleDate.isAfter(today) || scheduleDate.isSame(today, "day");
    })
    .sort(([dateA], [dateB]) =>
      dayjs(dateB, "DD-MM-YYYY").diff(dayjs(dateA, "DD-MM-YYYY"))
    )
    .reduce((acc, [date, ranges]) => {
      acc[date] = ranges;
      return acc;
    }, {});
  return (
    <>
      <Modal
        title={
          <Typography.Title level={3} style={{ margin: 0 }}>
            Tạo lịch làm việc
          </Typography.Title>
        }
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
        width={500}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        <Form layout="vertical" className="doctor-schedule-form">
          <Form.Item
            className="calender"
            label={<Typography.Text strong>Chọn ngày</Typography.Text>}
          >
            <Calendar
              style={{ width: "100%" }}
              onChange={onDateChange}
              value={selectedDate}
              tileDisabled={({ date }) => dayjs(date).isBefore(today)}
              locale="vi-VN"
            />
          </Form.Item>
          {selectedDate && (
            <div className="time-display">
              <Form.Item
                label={<Typography.Text strong>Chọn thời gian</Typography.Text>}
              >
                <TimePicker.RangePicker
                  value={timeRange}
                  onChange={onTimeChange}
                  format="HH:mm"
                  placeholder={["Từ", "Đến"]}
                />
                <Button onClick={addTimeRange} style={{ marginTop: "10px" }}>
                  Thêm khoảng thời gian
                </Button>
              </Form.Item>
              <div className="time-selected">
                <List
                  size="small"
                  bordered
                  dataSource={
                    selectedDate &&
                    schedules[dayjs(selectedDate).format("DD-MM-YYYY")]
                  }
                  renderItem={(schedule, index) => (
                    <>
                    <List.Item
                      style={{ display: "flex", alignItems: "center" }}
                      actions={[
                        <Button
                          key="delete-btn"
                          type="link"
                          onClick={() =>
                            removeTimeRange(
                              dayjs(selectedDate).format("DD-MM-YYYY"),
                              index
                            )
                          }
                        >
                          Xóa
                        </Button>,
                      ]}
                    >
                      {schedule.range[0]}
                      {"-"}
                      {schedule.range[1]}
                    </List.Item>
                    </>
                  )}
                />
              </div>
              <Button
                onClick={handleDeleteSchedule}
                type="primary"
                danger
                style={{ marginTop: "10px" }}
              >
                Xóa lịch làm việc này
              </Button>
            </div>
          )}
        </Form>
        <div className="schedule-summary">
          <Typography.Title style={{ width: "70%" }} level={5} strong>
            Lịch làm việc đã chọn:
          </Typography.Title>
          <List
            dataSource={Object.entries(filteredSchedules)}
            renderItem={([date, ranges]) => (
              <List.Item className="schedule-item">
                <Typography.Text className="date">{date}</Typography.Text>
                <div className="time">
                  {ranges.map((schedule, index) => (
                    <Typography.Text key={index}>
                      {schedule.range[0]}
                      {"-"}
                      {schedule.range[1]}
                    </Typography.Text>
                  ))}
                </div>
              </List.Item>
            )}
            className="scrollable-list"
          />
        </div>
      </Modal>
    </>
  );
};

export default DoctorSchedule;
