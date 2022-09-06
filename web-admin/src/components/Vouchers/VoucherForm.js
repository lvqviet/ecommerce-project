import {
  Button,
  Col,
  DatePicker,
  Drawer,
  Form,
  Input,
  InputNumber,
  message,
  Row,
  Select,
  Space,
  Spin,
} from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import {
  createVoucher,
  getAllVoucher,
  getVoucherById,
  updateVoucher,
} from "../../api/vouchers";

const { Option } = Select;
export default function VoucherForm(props) {
  const [form] = Form.useForm();
  const { visible, setVisible, setTrigger, trigger, id } = props;

  const [loading, setLoading] = useState(false);
  const [dateSelected, setDateSelected] = useState();
  const [vouchers, setVouchers] = useState([]);

  const onChangeDate = (date, dateString) => {
    setDateSelected(date);
  };

  const onClose = () => {
    form.resetFields();
    setVisible(false);
    setTrigger(!trigger);
  };

  const setData = async (id) => {
    try {
      setLoading(true);
      const res = await getVoucherById(id);
      if (res) {
        setDateSelected(moment(res.expiredAt));
        form.setFieldsValue({
          name: res.name,
          value: res.value,
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

    (async () => {
      const res = await getAllVoucher();
      if (res) setVouchers(res);
    })();
  }, [id, trigger]);

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        if (values.value === 0 || values.quantity === 0) {
          message.error("Giá tiền và số lượng phải lớn hơn 0");
          return;
        }

        if (id) {
          const name = values.name.replace(/\s\s+/g, " ").trim();
          const thisIndex = vouchers.findIndex((e) => e._id === id);
          const findIndex = vouchers.findIndex(
            (e) => e.name.toLowerCase() === name.toLowerCase()
          );
          if (findIndex !== -1 && findIndex !== thisIndex) {
            message.error("Tên đã tồn tại");
            return;
          }
          updateVoucher(id, {
            ...values,
            name,
            expiredAt: moment(dateSelected).toISOString(),
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
            vouchers.findIndex(
              (e) => e.name.toLowerCase() === name.toLowerCase()
            ) !== -1
          ) {
            message.error("Tên đã tồn tại");
            return;
          }
          createVoucher({
            ...values,
            name,
            expiredAt: moment(dateSelected).toISOString(),
          })
            .then((res) => {
              message.success("Tạo thành công");
              onClose();
            })
            .catch((err) => {
              message.error("Tạo thất bại");
              console.log(err);
            });
        }
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };
  return (
    <Drawer
      title={id ? "Cập nhật mã giảm giá" : "Thêm mã giảm giá"}
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
            value: "",
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
                name='value'
                label='Giá trị'
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
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: 62,
                }}
              >
                <label>Ngày hết hạn</label>
                <DatePicker
                  onChange={onChangeDate}
                  value={moment(dateSelected)}
                />
              </div>
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
