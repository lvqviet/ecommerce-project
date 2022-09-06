import { useState, useEffect } from "react";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import ProductTable from "./ProductTable";
import ProductForm from "../../components/Products/ProductForm";

export default function Products() {
  const [visible, setVisible] = useState(false);
  const [trigger, setTrigger] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };
  useEffect(() => {}, [trigger]);
  return (
    <div>
      <div
        style={{
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            margin: "20px",
            justifyContent: "space-between",
          }}
        >
          <h1>Sản phẩm</h1>
          <Button type='primary' onClick={showDrawer} icon={<PlusOutlined />}>
            Thêm sản phẩm
          </Button>
        </div>
        <ProductTable
          trigger={trigger}
          setTrigger={setTrigger}
          setVisible={setVisible}
        />
        <ProductForm
          visible={visible}
          setVisible={setVisible}
          trigger={trigger}
          setTrigger={setTrigger}
        />
      </div>
    </div>
  );
}
