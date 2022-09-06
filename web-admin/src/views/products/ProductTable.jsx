import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Input, message, Popconfirm, Table } from "antd";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { getAllCategory } from "../../api/category";

import { deleteProduct, getAllProducts } from "../../api/products";
import { createColumn } from "../../utils";
import { format } from "../../utils/format";

export default function ProductTable(props) {
  const history = useHistory();

  const { trigger, setTrigger, setVisible } = props;

  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [onLoading, setOnLoading] = useState({});
  const [loadingTable, setLoadingTable] = useState(true);
  const [search, setSearch] = useState();
  const [categories, setCategories] = useState();

  function confirmDelete(id) {
    deleteProduct(id)
      .then(() => {
        message.success("Xóa thành công");
        setTrigger(!trigger);
      })
      .catch((err) => {
        message.error("Không thể xoá sản phẩm");
      });
  }
  function cancel() {}

  function handleClick(id) {
    history.push(`/products/${id}`);
  }

  const columns = [
    createColumn("STT", "index", "index", (txt) => <h4>{txt}</h4>),
    createColumn("Hình ảnh", "pictures", "pictures", (txt) => (
      <img src={txt} alt='product' width='100' height='100' />
    )),
    createColumn("Tên", "name", "name", (txt) => <h4>{txt}</h4>),
    {
      title: "Loại",
      dataIndex: "category",
      key: "category",
      render: (txt) => <h4>{txt.name}</h4>,
      filters: categories,
      onFilter: (value, record) => record.category._id === value,
    },
    createColumn(
      "Giá tiền",
      "price",
      "price",
      (txt) => <h4>{format.currency(txt)}</h4>,
      (a, b) => a.price - b.price
    ),
    createColumn(
      "Số lượng",
      "quantity",
      "quantity",
      (txt) => <h4>{txt}</h4>,
      (a, b) => a.quantity - b.quantity
    ),

    createColumn(null, null, "action", (item) => {
      return (
        <div style={{ display: "flex", justifyContent: "space-evenly" }}>
          <Button key='1' onClick={() => handleClick(item._id)}>
            <EyeOutlined />
          </Button>
          <Popconfirm
            title='Xoá sản phẩm này?'
            onConfirm={() => confirmDelete(item._id)}
            onCancel={cancel}
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
      const data = await getAllCategory();
      if (data) {
        setCategories(
          data.map((item) => ({
            ...item,
            text: <span>{item.name}</span>,
            value: item._id,
          }))
        );
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      setLoadingTable(true);

      try {
        const response = await getAllProducts();

        if (response) {
          setProducts(
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
          placeholder=' Nhập tên sản phẩm'
        />
      </div>
      <Table
        columns={columns}
        dataSource={products.filter((item) => {
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
