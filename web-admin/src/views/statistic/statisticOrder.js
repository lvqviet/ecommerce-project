import { DownOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Dropdown,
  Menu,
  message,
  Row,
  Spin,
  Table,
  Tabs,
} from "antd";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import moment from "moment";
import { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { getStatistic } from "../../api/orders";
import { createColumn } from "../../utils";
import { format } from "../../utils/format";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title
);
export default function StatisticOrder() {
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();
  const [data, setData] = useState();
  const [loading, setLoading] = useState();
  const [dataPieChart, setDataPieChart] = useState([0, 0, 0, 0]);

  const onChangeFrom = (date, dateString) => {
    setFromDate(date);
  };

  const onChangeTo = (date, dateString) => {
    setToDate(date);
  };

  async function getData(from, to) {
    if (moment(to).isBefore(from)) {
      message.error("Vui lòng chọn khoảng thời gian hợp lệ");
      return;
    }
    try {
      setLoading(true);
      const res = await getStatistic(
        moment(from).startOf("day").toISOString(),
        moment(to).endOf("day").toISOString()
      );
      setLoading(false);
      if (res) {
        setData(res);
        setDataPieChart([
          res.totalCreatedOrders,
          res.totalShippingOrders,
          res.totalDeliveredOrders,
          res.totalCancelledOrders,
        ]);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const firstDay = moment().startOf("month");
    setFromDate(firstDay);

    const lastDay = moment().endOf("month");
    setToDate(lastDay);

    getData(firstDay, lastDay);
  }, []);

  return (
    <div className='container-from'>
      <Spin spinning={loading}>
        <Tabs type='card'>
          <Tabs.TabPane tab='' key='1'>
            <div
              style={{
                display: "flex",
                margin: "20px",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h1>Thống kê đơn hàng</h1>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  width: "12em",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h1>Từ:</h1>
                <DatePicker onChange={onChangeFrom} value={moment(fromDate)} />
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  width: "13em",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h1>Đến:</h1>
                <DatePicker onChange={onChangeTo} value={moment(toDate)} />
              </div>

              <Button
                type='primary'
                onClick={() => {
                  getData(fromDate, toDate);
                }}
              >
                Lọc
              </Button>
            </div>
            {data ? (
              <div className='container-from'>
                <h2
                  style={{
                    color: "green",
                    fontWeight: "bold",
                  }}
                >{`Thống kê từ ngày ${moment(fromDate).format(
                  "DD/MM/YYYY"
                )} đến ngày ${moment(toDate).format("DD/MM/YYYY")}`}</h2>
                <Row gutter={16}>
                  <Col span={12}>
                    <div className='input'>
                      <label>Tổng số lượng đơn hàng:</label>
                      <p className='text'>
                        {data.totalCreatedOrders +
                          data.totalCancelledOrders +
                          data.totalShippingOrders +
                          data.totalDeliveredOrders}
                      </p>

                      <label>Đơn đang chờ xác nhận:</label>
                      <p className='text'>{data.totalCreatedOrders}</p>

                      <label>Đơn đang giao:</label>
                      <p className='text'>{data.totalShippingOrders}</p>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className='input'>
                      <label>Tổng doanh thu:</label>
                      <p className='text'>
                        {format.currency(
                          data.totalPayment -
                            data.totalDiscount +
                            data.totalDeliveryFee
                        )}
                      </p>

                      <label>Đơn đã giao:</label>
                      <p className='text'>{data.totalDeliveredOrders}</p>

                      <label>Đơn đã huỷ:</label>
                      <p className='text'>{data.totalCancelledOrders}</p>
                    </div>
                  </Col>
                  <Pie
                    data={{
                      labels: [
                        `Chờ xác nhận (${dataPieChart[0]})`,
                        `Đang giao (${dataPieChart[1]})`,
                        `Đã giao (${dataPieChart[2]})`,
                        `Đã huỷ (${dataPieChart[3]})`,
                      ],
                      datasets: [
                        {
                          data: dataPieChart,
                          backgroundColor: [
                            "rgba(255, 206, 86, 0.2)",
                            "rgba(54, 162, 235, 0.2)",
                            "rgba(153, 102, 255, 0.2)",
                            "rgba(255, 99, 132, 0.2)",
                          ],
                          borderColor: [
                            "rgba(255, 206, 86, 1)",
                            "rgba(54, 162, 235, 1)",
                            "rgba(153, 102, 255, 1)",
                            "rgba(255, 99, 132, 1)",
                          ],
                          borderWidth: 1,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: "top",
                        },
                        title: {
                          display: true,
                          text: "Thống kê tất cả đơn hàng",
                        },
                      },
                    }}
                    style={{
                      marginRight: "30%",
                      marginLeft: "30%",
                    }}
                  />
                </Row>
              </div>
            ) : (
              <></>
            )}
          </Tabs.TabPane>
        </Tabs>
      </Spin>
    </div>
  );
}
