import { Col, message, Row, Spin, Tabs } from "antd";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { createColumn } from "../../utils";

import HeaderDetails from "../../components/HeaderDetails/HeaderDetails";
import ProductForm from "../../components/Products/ProductForm";
import { format } from "../../utils/format";
import { deleteProduct, getProductById } from "../../api/products";
const { TabPane } = Tabs;

export default function ProductDetail() {
  let { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState();
  const [visible, setVisible] = useState(false);
  const [trigger, setTrigger] = useState(false);

  const setData = async (id) => {
    try {
      setLoading(true);
      const res = await getProductById(id);
      setProduct(res);
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

  const history = useHistory();

  function confirmDelete() {
    deleteProduct(id)
      .then(() => {
        message.success("Xóa thành công");
        history.goBack();
      })
      .catch((err) => {
        message.error("Không thể xoá sản phẩm");
      });
  }

  return (
    <div className='container-from'>
      <Spin spinning={loading}>
        <Tabs onChange={onChange} type='card'>
          <TabPane tab='Sản phẩm' key='1'>
            <HeaderDetails
              namePage={"Chi tiết sản phẩm"}
              setVisible={setVisible}
              onDelete={confirmDelete}
            />
            {product ? (
              <div className='container-from'>
                <Row gutter={16}>
                  <Col span={12}>
                    <div className='input'>
                      <label>Tên</label>
                      <p className='text'>{product?.name ?? ""}</p>
                    </div>
                    <div className='input'>
                      <label>Mô tả</label>
                      <p className='text'>{product?.description ?? ""}</p>
                    </div>
                    <div className='input'>
                      <label>Giá tiền</label>
                      <p className='text'>
                        {format.currency(product?.price ?? "")}
                      </p>
                    </div>
                    <div className='input'>
                      <label>Loại</label>
                      <p className='text'>{product?.category.name ?? ""}</p>
                    </div>
                    <div className='input'>
                      <label>Số lượng</label>
                      <p className='text'>{product?.quantity ?? ""}</p>
                    </div>
                  </Col>
                  <Col span={12}>
                    <img
                      src={product.pictures[0]}
                      alt='Italian Trulli'
                      width='100'
                      height='100'
                      style={{ borderWidth: "1px" }}
                    />
                  </Col>
                </Row>
              </div>
            ) : (
              <></>
            )}
          </TabPane>
          {/* <TabPane tab="Order" key="2">
            <div className="container-from">
            <Row gutter={16}>
            <Col span={24}>
              <TableOrder columns={columns}/>
            </Col>
            </Row>
            </div>
          </TabPane> */}
        </Tabs>
      </Spin>
      <ProductForm
        visible={visible}
        setVisible={setVisible}
        trigger={trigger}
        setTrigger={setTrigger}
      />
    </div>
  );
}
