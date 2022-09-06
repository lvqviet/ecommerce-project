import { useState, useEffect } from "react";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import OrderTable from "./OrderTable";

export default function Orders() {
  const [trigger, setTrigger] = useState(false);

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
          <h1>Đơn hàng</h1>
        </div>
        <OrderTable trigger={trigger} setTrigger={setTrigger} />
      </div>
    </div>
  );
}
