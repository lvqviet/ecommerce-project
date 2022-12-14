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
          message.error("Gi?? ti???n v?? s??? l?????ng ph???i l???n h??n 0");
          return;
        }

        if (id) {
          const name = values.name.replace(/\s\s+/g, " ").trim();
          const thisIndex = products.findIndex((e) => e._id === id);
          const findIndex = products.findIndex(
            (e) => e.name.toLowerCase() === name.toLowerCase()
          );
          if (findIndex !== -1 && findIndex !== thisIndex) {
            message.error("T??n ???? t???n t???i");
            return;
          }
          updateProduct(id, {
            ...values,
            name,
            category: cateSelected,
          })
            .then((res) => {
              if (res) {
                message.success("C???p nh???t th??nh c??ng");
                onClose();
              }
            })
            .catch((err) => {
              message.error("C???p nh???t th???t b???i");
            });
        } else {
          const name = values.name.replace(/\s\s+/g, " ").trim();
          if (
            products.findIndex(
              (e) => e.name.toLowerCase() === name.toLowerCase()
            ) !== -1
          ) {
            message.error("T??n ???? t???n t???i");
            return;
          }
          createProduct({
            ...values,
            name,
            category: cateSelected,
            pictures: [values.pictures],
          })
            .then((res) => {
              message.success("T???o th??nh c??ng");
              onClose();
            })
            .catch((err) => {
              message.error("T???o th???t b???i");
            });
        }
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };
  return (
    <Drawer
      title={id ? "C???p nh???t s???n ph???m" : "Th??m s???n ph???m"}
      width={720}
      onClose={onClose}
      visible={visible}
      bodyStyle={{ paddingBottom: 80 }}
      extra={
        <Space>
          <Button onClick={onClose}>Hu???</Button>
          <Button onClick={handleSubmit} type='primary'>
            X??c nh???n
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
                label='T??n'
                rules={[{ required: true, message: "" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                style={{ width: "100%" }}
                name='price'
                label='Gi?? ti???n'
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
                label='M?? t???'
                rules={[{ required: true, message: "" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name='pictures'
                label='H??nh ???nh'
                rules={[{ required: true, message: "" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name='category'
                label='Lo???i'
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
                label='S??? l?????ng'
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
