import {
  BlockOutlined,
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  LockOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import {
  Button,
  Dropdown,
  Input,
  Menu,
  message,
  Modal,
  Popconfirm,
  Space,
  Table,
  Tag,
} from "antd";
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
import { deleteUser, getAllUser, updateUser } from "../../api/users";

export default function UserTable(props) {
  const { trigger, setTrigger, setVisible, setIdSelected } = props;

  const [pagination, setPagination] = useState({});
  const [onLoading, setOnLoading] = useState({});
  const [loadingTable, setLoadingTable] = useState(true);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState();
  const [keySearch, setKeySearch] = useState("Email");

  function confirmDelete(id) {
    deleteUser(id)
      .then(() => {
        message.success("Xóa thành công");
        setTrigger(!trigger);
      })
      .catch((err) => {
        message.error("Không thể xoá khách hàng này");
      });
  }

  function confirmBlock(id, active) {
    updateUser(id, { active: !active })
      .then(() => {
        message.success("Cập nhật thành công");
        setTrigger(!trigger);
      })
      .catch((err) => {
        message.error("Có lỗi");
      });
  }

  const columns = [
    createColumn("STT", "index", "index", (txt) => <h4>{txt}</h4>),
    createColumn("Họ", "firstName", "firstName", (txt) => <h4>{txt}</h4>),
    createColumn("Tên", "lastName", "lastName", (txt) => <h4>{txt}</h4>),
    createColumn("Email", "email", "email", (txt) => <h4>{txt}</h4>),
    createColumn("Số điện thoại", "phoneNumber", "phoneNumber", (txt) => (
      <h4>{txt}</h4>
    )),
    createColumn("Địa chỉ", "address", "address", (txt) => <h4>{txt}</h4>),
    {
      title: "Trạng thái",
      dataIndex: "active",
      key: "active",
      render: (txt) => (
        <Tag key={txt} color={txt ? "green" : "red"}>
          {txt ? "Active" : "InActive"}
        </Tag>
      ),
      filters: [
        {
          text: <span>Active</span>,
          value: true,
        },
        {
          text: <span>inActive</span>,
          value: false,
        },
      ],
      onFilter: (value, record) => record.active === value,
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
            title='Xoá khách hàng này?'
            onConfirm={() => confirmDelete(item._id)}
            okText='OK'
            cancelText='Huỷ'
            placement='left'
          >
            <Button key='3' type='primary' danger>
              <DeleteOutlined className='antd-icon' />
            </Button>
          </Popconfirm>

          <Button
            key='3'
            type='primary'
            danger={item.active}
            onClick={() => confirmBlock(item._id, item.active)}
          >
            <h4 style={{ color: "white" }}>
              {item.active ? "Chặn" : "Bỏ chặn"}
            </h4>
          </Button>
        </div>
      );
    }),
  ];

  useEffect(() => {
    (async () => {
      setLoadingTable(true);

      try {
        const response = await getAllUser();

        if (response) {
          setUsers(
            response
              .filter((item) => item.email !== "admin@gmail.com")
              .map((item, index) => ({
                key: item._id,
                index: index + 1,
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
      <div
        style={{
          width: "40em",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <h4>Lọc: </h4>
        <Input
          onChange={(e) => setSearch(e.target.value)}
          placeholder={
            keySearch === "Email" ? "Nhập email" : "Nhập số điện thoại"
          }
          maxWidth={30}
        />
        <div style={{ width: "10em" }}>
          <Dropdown
            overlayStyle={{ minWidth: 100 }}
            trigger={["click"]}
            overlay={
              <Menu
                items={[
                  { key: "Email", label: "Email" },
                  { key: "Số điện thoại", label: "Số điện thoại" },
                ]}
                onClick={(e) => {
                  setKeySearch(e.key);
                }}
              />
            }
          >
            <a onClick={(e) => e.preventDefault()}>
              {keySearch}
              <DownOutlined />
            </a>
          </Dropdown>
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={users.filter((item) => {
          if (search) {
            if (keySearch === "Email") return item?.email?.includes(search);
            else {
              return item?.phoneNumber?.includes(search);
            }
          } else return true;
        })}
        loading={loadingTable}
        pagination={{ position: "bottomRight" }}
      />
    </div>
  );
}
