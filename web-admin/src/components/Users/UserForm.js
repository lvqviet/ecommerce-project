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
} from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAllCategory } from "../../api/category";
import {
  createProduct,
  getProductById,
  updateProduct,
} from "../../api/products";
import { getUserById, updateUser } from "../../api/users";

const { Option } = Select;
export default function UserForm(props) {
  const [form] = Form.useForm();
  const { visible, setVisible, setTrigger, trigger, id } = props;

  const [loading, setLoading] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);
  const [cateSelected, setCateSelected] = useState("");

  const onClose = () => {
    setLoadingButton(false);
    form.resetFields();
    setVisible(false);
    setTrigger(!trigger);
  };

  const setData = async (id) => {
    try {
      setLoading(true);
      const res = await getUserById(id);
      if (res) {
        form.setFieldsValue({
          firstName: res.firstName,
          lastName: res.lastName,
          email: res.email,
          phoneNumber: res.phoneNumber,
          address: res.address,
        });
      }
    } catch (err) {}
    setLoading(false);
  };

  useEffect(() => {
    setData(id);
  }, [id, trigger]);

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        setLoadingButton(true);

        updateUser(id, {
          ...values,
        })
          .then((res) => {
            if (res) {
              message.success("Cập nhật thành công");
              onClose();
            }
          })
          .catch((err) => {
            message.error("Cập nhật thất bại");
            setLoadingButton(false);
          });
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };
  return (
    <Drawer
      title={"Cập nhật khách hàng"}
      width={720}
      onClose={onClose}
      visible={visible}
      bodyStyle={{ paddingBottom: 80 }}
      extra={
        <Space>
          <Button onClick={onClose}>Huỷ</Button>
          <Button loading={loadingButton} onClick={handleSubmit} type='primary'>
            Xác nhận
          </Button>
        </Space>
      }
    >
      <Spin tip='Loading...' spinning={loading}>
        <Form form={form} layout='vertical'>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name='firstName'
                label='Họ'
                rules={[{ required: true, message: "" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name='lastName'
                label='Tên'
                rules={[{ required: true, message: "" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name='phoneNumber'
                label='Số điện thoại'
                rules={[{ required: true, message: "" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name='address'
                label='Địa chỉ'
                rules={[{ required: true, message: "" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Spin>
    </Drawer>
  );
}
