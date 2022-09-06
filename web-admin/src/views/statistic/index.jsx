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
const labelMonths = [
  "Tháng 1",
  "Tháng 2",
  "Tháng 3",
  "Tháng 4",
  "Tháng 5",
  "Tháng 6",
  "Tháng 7",
  "Tháng 8",
  "Tháng 9",
  "Tháng 10",
  "Tháng 11",
  "Tháng 12",
];
export default function Statistic() {
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();
  const [data, setData] = useState();
  const [loading, setLoading] = useState();
  const [dataPieChart, setDataPieChart] = useState([0, 0, 0, 0]);
  const [dataBarChart, setDataBarChart] = useState(Array(12).fill(0));
  const [yearSelected, setYearSelected] = useState(moment().year());

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

  async function getStatisticForYear(year) {
    try {
      let month = 1;
      let result = [];

      while (month <= 12) {
        setLoading(true);
        const startDate = moment(`01/${month}/${year}`, "DD M YYYY")
          .startOf("day")
          .toISOString();
        const endDate = moment(`01/${month}/${year}`, "DD M YYYY")
          .endOf("month")
          .endOf("day")
          .toISOString();
        let { totalPayment, totalDeliveryFee, totalDiscount } =
          await getStatistic(startDate, endDate);
        result = [...result, totalPayment + totalDeliveryFee - totalDiscount];
        month++;
      }
      setDataBarChart(result);
      setLoading(false);
    } catch (error) {}
  }

  useEffect(() => {
    const firstDay = moment().startOf("month");
    setFromDate(firstDay);

    const lastDay = moment().endOf("month");
    setToDate(lastDay);

    getData(firstDay, lastDay);
    getStatisticForYear(moment().year());
  }, []);

  useEffect(() => {
    getStatisticForYear(yearSelected);
  }, [yearSelected]);

  const columns = [
    createColumn("STT", "index", "index", (txt) => <h4>{txt}</h4>),
    createColumn("Mã đơn hàng", "_id", "_id", (txt) => (
      <h4>{txt.slice(-5)}</h4>
    )),
    createColumn("Ngày đặt", "createdAt", "createdAt", (txt) => (
      <h4>{moment(txt).format("HH:mm DD-MM-yyyy")}</h4>
    )),
    createColumn("Số điện thoại", "phoneNumber", "phoneNumber", (txt) => (
      <h4>{txt}</h4>
    )),
    createColumn("Tổng tiền", "total", "total", (txt) => (
      <h4>{format.currency(txt)}</h4>
    )),
  ];

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
              <h1>Thống kê doanh thu</h1>
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
                      <label>Tổng doanh thu:</label>
                      <p className='text'>
                        {format.currency(
                          data.totalPayment -
                            data.totalDiscount +
                            data.totalDeliveryFee
                        )}
                      </p>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className='input'>
                      <label>Tổng đơn hàng đã giao:</label>
                      <p className='text'>{data.totalDeliveredOrders}</p>
                    </div>
                  </Col>
                </Row>

                <h3>Danh sách đơn hàng</h3>
                <Table
                  columns={columns}
                  dataSource={
                    data?.orders
                      .filter((item) => item.status === "delivered")
                      .map((item, index) => ({
                        ...item,
                        index: index + 1,
                        key: item._id,
                        total:
                          item.totalPayment + item.deliveryFee - item.discount,
                      })) ?? []
                  }
                  pagination={{ position: "bottomRight" }}
                />
              </div>
            ) : (
              <></>
            )}
            <div style={{ width: "10em" }}>
              <h4>Thống kê theo năm: </h4>
              <Dropdown
                overlayStyle={{ minWidth: 100 }}
                trigger={["click"]}
                overlay={
                  <Menu
                    items={Array(5)
                      .fill(1)
                      .map((e, index) => ({
                        key: yearSelected - index,
                        label: yearSelected - index,
                      }))}
                    onClick={(e) => {
                      setYearSelected(e.key);
                    }}
                  />
                }
              >
                <a onClick={(e) => e.preventDefault()}>
                  {yearSelected}
                  <DownOutlined />
                </a>
              </Dropdown>
            </div>
            <Bar
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "top",
                  },
                  title: {
                    display: true,
                    text: `Thống kê doanh thu năm ${yearSelected}`,
                  },
                },
              }}
              data={{
                labels: labelMonths,
                datasets: [
                  {
                    label: "Tổng tiền (vnđ)",
                    data: dataBarChart,
                    backgroundColor: "rgba(53, 162, 235, 0.5)",
                  },
                ],
              }}
            />
          </Tabs.TabPane>
        </Tabs>
      </Spin>
    </div>
  );
}
