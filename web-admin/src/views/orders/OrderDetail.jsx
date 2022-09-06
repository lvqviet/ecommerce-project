import { Button, Col, message, Popconfirm, Row, Spin, Table, Tabs } from "antd";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { createColumn } from "../../utils";

import HeaderDetails from "../../components/HeaderDetails/HeaderDetails";

import { format } from "../../utils/format";

import { getOrderById, updateOrder } from "../../api/orders";
import moment from "moment";
const { TabPane } = Tabs;

export default function OrderDetail() {
  let { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState();
  const [visible, setVisible] = useState(false);
  const [trigger, setTrigger] = useState(false);

  const setData = async (id) => {
    try {
      setLoading(true);
      const res = await getOrderById(id);
      console.log(res);
      setOrder(res);
      setLoading(false);
    } catch (err) {}
  };

  useEffect(() => {
    setVisible(false);
    if (id) {
      setData(id);
    }
  }, [id, trigger]);

  const onChange = (key) => {
    console.log(key);
  };

  function confirmCancel() {
    setLoading(true);
    updateOrder(order._id, "cancelled")
      .then(() => {
        message.success("Huỷ thành công");
        setTrigger(!trigger);
        setLoading(false);
      })
      .catch((err) => {
        message.error("Có lỗi");
        setLoading(false);
      });
  }

  function updateStatus() {
    setLoading(true);
    let status = order.status === "created" ? "shipping" : "delivered";
    updateOrder(order._id, status)
      .then(() => {
        message.success("Cập nhật thành công");
        setTrigger(!trigger);
        setLoading(false);
      })
      .catch((err) => {
        message.error("Có lỗi");
        setLoading(false);
      });
  }

  const columns = [
    createColumn("STT", "index", "index", (txt) => <h4>{txt}</h4>),
    createColumn("Hình ảnh", "pictures", "pictures", (txt) => (
      <img src={txt} alt='product' width='100' height='100' />
    )),
    createColumn("Tên", "name", "name", (txt) => <h4>{txt}</h4>),
    createColumn("Giá tiền", "price", "price", (txt) => (
      <h4>{format.currency(txt)}</h4>
    )),
    createColumn("Số lượng", "quantity", "quantity", (txt) => <h4>{txt}</h4>),
  ];

  const history = useHistory();

  return (
    <div className='container-from'>
      <Spin spinning={loading}>
        <Tabs onChange={onChange} type='card'>
          <TabPane tab='Đơn hàng' key='1'>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h1>Chi tiết đơn hàng</h1>
                <div
                  style={{
                    width: "15em",
                    justifyContent: "space-between",
                    display: "flex",
                  }}
                >
                  {(order?.status === "created" ||
                    order?.status === "shipping") && (
                    <Popconfirm
                      title='Huỷ đơn hàng này?'
                      onConfirm={() => confirmCancel()}
                      okText='OK'
                      cancelText='Huỷ'
                      placement='left'
                    >
                      <Button key='3' type='primary' danger>
                        <h4 style={{ color: "white" }}>Huỷ đơn</h4>
                      </Button>
                    </Popconfirm>
                  )}

                  {(order?.status === "created" ||
                    order?.status === "shipping") && (
                    <Button
                      type='primary'
                      onClick={() => {
                        updateStatus();
                      }}
                    >
                      {order?.status === "created"
                        ? "Giao hàng"
                        : order?.status === "shipping"
                        ? "Nhận hàng"
                        : ""}
                    </Button>
                  )}
                </div>
              </div>
            </div>
            {order ? (
              <div className='container-from'>
                <Row gutter={16}>
                  <Col span={12}>
                    <div className='input'>
                      <label>Ngày đặt</label>
                      <p className='text'>
                        {moment(order?.createdAt).format("HH:mm DD-MM-yyyy")}
                      </p>
                    </div>
                    <div className='input'>
                      <label>Địa chỉ</label>
                      <p className='text'>{order?.address}</p>
                    </div>
                    <div className='input'>
                      <label>Số điện thoại</label>
                      <p className='text'>
                        {format.currency(order?.phoneNumber)}
                      </p>
                    </div>
                    <div className='input'>
                      <label>Email</label>
                      <p className='text'>{order.userId.email}</p>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className='input'>
                      <label>Tổng tiền</label>
                      <p className='text'>
                        {format.currency(
                          order.totalPayment +
                            order.deliveryFee -
                            (order?.discount ?? 0)
                        )}
                      </p>
                    </div>
                    <div className='input'>
                      <label>Trạng thái</label>
                      <p className='text'>{order?.status}</p>
                    </div>
                    <div className='input'>
                      <label>Giảm giá</label>
                      <p className='text'>
                        {format.currency(order?.discount ?? 0)}
                      </p>
                    </div>
                    <div className='input'>
                      <label>Người nhận</label>
                      <p className='text'>
                        {`${order.userId.firstName} ${order.userId.lastName}`}
                      </p>
                    </div>
                  </Col>
                </Row>

                <div>
                  <Table
                    columns={columns}
                    dataSource={order.items.map((e, index) => ({
                      ...e.product,
                      quantity: e.quantity,
                      index: index + 1,
                    }))}
                    // loading={loadingTable}
                    pagination={{ position: "bottomRight" }}
                  />
                </div>
              </div>
            ) : (
              <></>
            )}
          </TabPane>
        </Tabs>
      </Spin>
    </div>
  );
}
