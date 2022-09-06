import {
  CloseOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Button, Input, message, Popconfirm, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { getAllOrder, updateOrder } from "../../api/orders";

import { deleteProduct, getAllProducts } from "../../api/products";
import { createColumn } from "../../utils";
import { format } from "../../utils/format";
import moment from "moment";

export default function OrderTable(props) {
  const history = useHistory();

  const { trigger, setTrigger, setVisible } = props;

  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({});
  const [onLoading, setOnLoading] = useState({});
  const [loadingTable, setLoadingTable] = useState(true);
  const [search, setSearch] = useState();

  function confirmCancel(id) {
    updateOrder(id, "cancelled")
      .then(() => {
        message.success("Huỷ thành công");
        setTrigger(!trigger);
      })
      .catch((err) => {
        message.error("Có lỗi");
      });
  }

  function updateStatus(item) {
    let status = item.status === "created" ? "shipping" : "delivered";
    updateOrder(item._id, status)
      .then(() => {
        message.success("Cập nhật thành công");
        setTrigger(!trigger);
      })
      .catch((err) => {
        message.error("Có lỗi");
      });
  }

  function handleClick(id) {
    history.push(`/orders/${id}`);
  }

  const columns = [
    createColumn("STT", "index", "index", (txt) => <h4>{txt}</h4>),
    createColumn("Mã đơn", "_id", "_id", (txt) => <h4>{txt.slice(-5)}</h4>),
    createColumn("Ngày đặt", "createdAt", "createdAt", (txt) => (
      <h4>{moment(txt).format("HH:mm DD-MM-yyyy")}</h4>
    )),
    createColumn("Số điện thoại", "phoneNumber", "phoneNumber", (txt) => (
      <h4>{txt}</h4>
    )),
    createColumn(
      "Tổng tiền",
      "total",
      "total",
      (txt) => <h4>{format.currency(txt)}</h4>,
      (a, b) => a.total - b.total
    ),
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (txt) => (
        <Tag key={txt} color={txt === "cancelled" ? "red" : "blue"}>
          {txt.toUpperCase()}
        </Tag>
      ),
      filters: [
        {
          text: <span>Created</span>,
          value: "created",
        },
        {
          text: <span>Shipping</span>,
          value: "shipping",
        },
        {
          text: <span>Delivered</span>,
          value: "delivered",
        },
        {
          text: <span>Cancelled</span>,
          value: "cancelled",
        },
      ],
      onFilter: (value, record) => record.status === value,
    },
    createColumn(null, null, "action", (item) => {
      return (
        <div style={{ display: "flex", justifyContent: "flex-start" }}>
          <Button
            key='1'
            onClick={() => handleClick(item._id)}
            style={{ marginRight: 20 }}
          >
            <EyeOutlined />
          </Button>
          {(item.status === "created" || item.status === "shipping") && (
            <Popconfirm
              title='Huỷ đơn này?'
              onConfirm={() => confirmCancel(item._id)}
              okText='OK'
              cancelText='Huỷ'
              placement='left'
            >
              <Button key='3' type='primary' danger style={{ marginRight: 20 }}>
                <h4 style={{ color: "white" }}>Huỷ đơn</h4>
              </Button>
            </Popconfirm>
          )}

          {(item.status === "created" || item.status === "shipping") && (
            <Popconfirm
              title={
                item.status === "created"
                  ? "Xác nhận giao hàng?"
                  : "Xác nhận đã nhận hàng?"
              }
              onConfirm={() => updateStatus(item)}
              okText='OK'
              cancelText='Huỷ'
              placement='left'
            >
              <Button key='3' type='primary'>
                <h4 style={{ color: "white" }}>
                  {item.status === "created"
                    ? "Giao hàng"
                    : item.status === "shipping"
                    ? "Nhận hàng"
                    : ""}
                </h4>
              </Button>
            </Popconfirm>
          )}
        </div>
      );
    }),
  ];

  useEffect(() => {
    (async () => {
      setLoadingTable(true);

      try {
        const response = await getAllOrder();
        if (response) {
          setOrders(
            response.map((item, index) => ({
              key: item._id,
              index: index + 1,
              total: item.totalPayment + item.deliveryFee - item.discount,
              ...item,
            }))
          );
          setOnLoading(false);
        }

        setPagination(response);
        setLoadingTable(false);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [trigger, onLoading]);

  return (
    <div>
      <div style={{ width: "40%", display: "flex", flexDirection: "row" }}>
        <h4>Lọc: </h4>
        <Input
          onChange={(e) => setSearch(e.target.value)}
          placeholder=' Nhập mã đơn'
        />
      </div>
      <Table
        columns={columns}
        dataSource={orders.filter((item) => {
          if (search) {
            return item?._id?.includes(search);
          } else return true;
        })}
        loading={loadingTable}
        pagination={{ position: "bottomRight" }}
      />
    </div>
  );
}
