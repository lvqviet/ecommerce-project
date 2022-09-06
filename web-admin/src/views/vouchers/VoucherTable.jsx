import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Input, message, Modal, Popconfirm, Table, Tag } from "antd";
import { useEffect, useState } from "react";

import {
  deleteCategory,
  getAllCategory,
  updateCategory,
} from "../../api/category";
import { deleteVoucher, getAllVoucher } from "../../api/vouchers";
import { createColumn } from "../../utils";
import moment from "moment";
import { format } from "../../utils/format";

export default function VoucherTable(props) {
  const { trigger, setTrigger, setVisible, setIdSelected } = props;

  const [vouchers, setVouchers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [onLoading, setOnLoading] = useState({});
  const [loadingTable, setLoadingTable] = useState(true);
  const [search, setSearch] = useState();

  function confirmDelete(id) {
    deleteVoucher(id)
      .then(() => {
        message.success("Xóa thành công");
        setTrigger(!trigger);
      })
      .catch((err) => {
        message.error("Không thể xoá mã này");
      });
  }

  const columns = [
    createColumn("STT", "index", "index", (txt) => <h4>{txt}</h4>),
    createColumn("Tên", "name", "name", (txt) => <h4>{txt}</h4>),
    createColumn(
      "Giá trị",
      "value",
      "value",
      (txt) => <h4>{format.currency(txt)}</h4>,
      (a, b) => a.value - b.value
    ),
    createColumn(
      "Ngày hết hạn",
      "expiredAt",
      "expiredAt",
      (txt) => <h4>{moment(txt).format("DD-MM-yyyy")}</h4>,
      (a, b) => moment(a.expiredAt).isBefore(moment(b.expiredAt))
    ),
    createColumn(
      "Số lượng",
      "quantity",
      "quantity",
      (txt) => <h4>{txt}</h4>,
      (a, b) => a.quantity - b.quantity
    ),
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (txt) => (
        <Tag color={txt === "active" ? "green" : "red"}>{txt}</Tag>
      ),
      filters: [
        {
          text: <span>Active</span>,
          value: "active",
        },
        {
          text: <span>Expired</span>,
          value: "expired",
        },
        {
          text: <span>Inactive</span>,
          value: "inactive",
        },
      ],
      onFilter: (value, record) => record.status === value,
    },
    createColumn(null, null, "action", (item) => {
      return (
        <div style={{ display: "flex", justifyContent: "space-evenly" }}>
          <Button
            key='1'
            onClick={() => {
              setIdSelected(item._id);
              setVisible(true);
            }}
          >
            <EditOutlined />
          </Button>
          <Popconfirm
            title='Xoá mã này?'
            onConfirm={() => confirmDelete(item._id)}
            okText='OK'
            cancelText='Huỷ'
            placement='left'
          >
            <Button key='3' type='primary' danger>
              <DeleteOutlined className='antd-icon' />
            </Button>
          </Popconfirm>
        </div>
      );
    }),
  ];

  useEffect(() => {
    (async () => {
      setLoadingTable(true);

      try {
        const response = await getAllVoucher();

        if (response) {
          setVouchers(
            response.map((item, index) => ({
              key: item._id,
              index: index + 1,
              status:
                item.quantity === 0
                  ? "inactive"
                  : moment(item.expiredAt).endOf("day").isAfter(Date.now())
                  ? "active"
                  : "expired",
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
          placeholder=' Nhập tên'
        />
      </div>
      <Table
        columns={columns}
        dataSource={vouchers.filter((item) => {
          if (search) {
            return item?.name.toLowerCase()?.includes(search.toLowerCase());
          } else return true;
        })}
        loading={loadingTable}
        pagination={{ position: "bottomRight" }}
      />
    </div>
  );
}
