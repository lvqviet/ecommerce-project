import { DownOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Drawer,
  Form,
  Input,
  message,
  Row,
  Select,
  Space,
  Spin,
  Dropdown,
  Menu,
  InputNumber,
} from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAllCategory } from "../../api/category";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "../../api/products";

const { Option } = Select;
export default function ProductForm(props) {
  const [form] = Form.useForm();
  const { visible, setVisible, setTrigger, trigger } = props;
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [cateSelected, setCateSelected] = useState("");
  const [products, setProducts] = useState([]);

  const onClose = () => {
    form.resetFields();
    setVisible(false);
    setTrigger(!trigger);
  };

  const setData = async (id) => {
    try {
      setLoading(true);
      const res = await getProductById(id);
      if (res) {
        setCateSelected(res.category._id);

        form.setFieldsValue({
          name: res.name,
          price: res.price,
          description: res.description,
          pictures: res.pictures[0],
          category: res.category._id,
          quantity: res.quantity,
        });
      }
    } catch (err) {}
    setLoading(false);
  };

  useEffect(() => {
    if (id) {
      setData(id);
    } else form.resetFields();
  }, [id, trigger]);

  useEffect(() => {
    (async () => {
      const data = await getAllCategory();
      if (data) {
        setCategories(
          data.map((item) => ({ ...item, label: item.name, key: item._id }))
        );
        if (!id) setCateSelected(data[0]._id);
      }
    })();

    (async () => {
      const data = await getAllProducts();
      if (data) {
        setProducts(data);
      }
    })();
  }, []);

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        if (values.price === 0 || values.quantity === 0) {
          message.error("Giá tiền và số lượng phải lớn hơn 0");
          return;
        }

        if (id) {
          const name = values.name.replace(/\s\s+/g, " ").trim();
          const thisIndex = products.findIndex((e) => e._id === id);
          const findIndex = products.findIndex(
            (e) => e.name.toLowerCase() === name.toLowerCase()
          );
          if (findIndex !== -1 && findIndex !== thisIndex) {
            message.error("Tên đã tồn tại");
            return;
          }
          updateProduct(id, {
            ...values,
            name,
            category: cateSelected,
          })
            .then((res) => {
              if (res) {
                message.success("Cập nhật thành công");
                onClose();
              }
            })
            .catch((err) => {
              message.error("Cập nhật thất bại");
            });
        } else {
          const name = values.name.replace(/\s\s+/g, " ").trim();
          if (
            products.findIndex(
              (e) => e.name.toLowerCase() === name.toLowerCase()
            ) !== -1
          ) {
            message.error("Tên đã tồn tại");
            return;
          }
          createProduct({
            ...values,
            name,
            category: cateSelected,
            pictures: [values.pictures],
          })
            .then((res) => {
              message.success("Tạo thành công");
              onClose();
            })
            .catch((err) => {
              message.error("Tạo thất bại");
            });
        }
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };
  return (
    <Drawer
      title={id ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
      width={720}
      onClose={onClose}
      visible={visible}
      bodyStyle={{ paddingBottom: 80 }}
      extra={
        <Space>
          <Button onClick={onClose}>Huỷ</Button>
          <Button onClick={handleSubmit} type='primary'>
            Xác nhận
          </Button>
        </Space>
      }
    >
      <Spin tip='Loading...' spinning={loading}>
        <Form
          form={form}
          layout='vertical'
          initialValues={{
            name: "",
            price: "",
            description: "",
            pictures: "",
            category: cateSelected,
            quantity: "",
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name='name'
                label='Tên'
                rules={[{ required: true, message: "" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                style={{ width: "100%" }}
                name='price'
                label='Giá tiền'
                rules={[{ required: true, message: "" }]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  min={0}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name='description'
                label='Mô tả'
                rules={[{ required: true, message: "" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name='pictures'
                label='Hình ảnh'
                rules={[{ required: true, message: "" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name='category'
                label='Loại'
                rules={[{ required: true, message: "" }]}
              >
                <Dropdown
                  trigger={["click"]}
                  overlay={
                    <Menu
                      items={categories}
                      onClick={(e) => {
                        setCateSelected(e.key);
                        form.setFieldsValue(e.key);
                      }}
                    />
                  }
                >
                  <a onClick={(e) => e.preventDefault()}>
                    <Space>
                      {categories[
                        categories.findIndex((e) => e._id === cateSelected)
                      ]?.name ?? ""}
                      <DownOutlined />
                    </Space>
                  </a>
                </Dropdown>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name='quantity'
                label='Số lượng'
                rules={[{ required: true, message: "" }]}
              >
                <InputNumber min={0} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Spin>
    </Drawer>
  );
}
