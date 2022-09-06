import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Input, message, Modal, Popconfirm, Table } from "antd";
import { useEffect, useState } from "react";

import {
  createCategory,
  deleteCategory,
  getAllCategory,
  updateCategory,
} from "../../api/category";
import { createColumn } from "../../utils";

export default function CategoryTable(props) {
  const { trigger, setTrigger, setIsModalAddVisible, isModalAddVisible } =
    props;

  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({});
  const [onLoading, setOnLoading] = useState({});
  const [loadingTable, setLoadingTable] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [name, setName] = useState("");
  const [idSelected, setIdSelected] = useState();
  const [search, setSearch] = useState();

  function confirmDelete(id) {
    deleteCategory(id)
      .then(() => {
        message.success("Xóa thành công");
        setTrigger(!trigger);
      })
      .catch((err) => {
        message.error("Không thể xoá thể loại này");
      });
  }

  function addCategory() {
    if (!name) {
      return;
    }
    const nameFormatted = name.trim().replace(/\s\s+/g, " ");
    const findIndex = categories.findIndex(
      (e) => e.name.toLowerCase() === nameFormatted.toLowerCase()
    );
    if (findIndex !== -1) {
      message.error("Tên đã tồn tại");
      return;
    }

    createCategory({ name: nameFormatted })
      .then(() => {
        message.success("Thêm thành công");
        setTrigger(!trigger);
        setIsModalAddVisible(false);
      })
      .catch((err) => {
        message.error("Có lỗi");
      });
  }

  function update() {
    if (!name) {
      return;
    }
    const nameFormatted = name.trim().replace(/\s\s+/g, " ");
    const thisIndex = categories.findIndex((e) => e._id === idSelected);
    const findIndex = categories.findIndex(
      (e) => e.name.toLowerCase() === nameFormatted.toLowerCase()
    );
    if (findIndex !== -1 && findIndex !== thisIndex) {
      message.error("Tên đã tồn tại");
      return;
    }
    updateCategory(idSelected, { name: nameFormatted })
      .then(() => {
        message.success("Sửa thành công");
        setTrigger(!trigger);
        setIsModalVisible(false);
      })
      .catch((err) => {
        message.error("Có lỗi");
      });
  }

  const columns = [
    createColumn("STT", "index", "index", (txt) => <h4>{txt}</h4>),

    createColumn("Tên", "name", "name", (txt) => <h4>{txt}</h4>),

    createColumn(null, null, "action", (item) => {
      return (
        <div style={{ display: "flex", justifyContent: "space-evenly" }}>
          <Button
            key='1'
            onClick={() => {
              setName(item.name);
              setIdSelected(item._id);
              setIsModalVisible(true);
            }}
          >
            <EditOutlined />
          </Button>
          <Popconfirm
            title='Xoá thể loại này?'
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
    if (isModalAddVisible) setName("");
  }, [isModalAddVisible]);

  useEffect(() => {
    (async () => {
      setLoadingTable(true);

      try {
        const response = await getAllCategory();

        if (response) {
          setCategories(
            response.map((item, index) => ({
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
      <div style={{ width: "40%", display: "flex", flexDirection: "row" }}>
        <h4>Lọc: </h4>
        <Input
          onChange={(e) => setSearch(e.target.value)}
          placeholder=' Nhập tên'
        />
      </div>
      <Table
        columns={columns}
        dataSource={categories.filter((item) => {
          if (search) {
            return item?.name?.toLowerCase().includes(search.toLowerCase());
          } else return true;
        })}
        loading={loadingTable}
        pagination={{ position: "bottomRight" }}
      />
      <Modal
        title='Chỉnh sửa thể loại'
        visible={isModalVisible || isModalAddVisible}
        onOk={isModalAddVisible ? addCategory : update}
        onCancel={() => {
          setIsModalVisible(false);
          setIsModalAddVisible(false);
        }}
      >
        <label>Tên</label>
        <Input onChange={(e) => setName(e.target.value)} value={name} />
      </Modal>
    </div>
  );
}
