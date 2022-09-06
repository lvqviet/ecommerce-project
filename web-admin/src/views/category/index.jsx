import { useState, useEffect } from "react";
import { Button, Input, message, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import CategoryTable from "./CategoryTable";
import { createCategory } from "../../api/category";

export default function Products() {
  const [visible, setVisible] = useState(false);
  const [trigger, setTrigger] = useState(false);

  const [isModalAddVisible, setIsModalAddVisible] = useState(false);

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
          <h1>Thể loại</h1>
          <Button
            type='primary'
            onClick={() => {
              setIsModalAddVisible(true);
            }}
            icon={<PlusOutlined />}
          >
            Thêm thể loại
          </Button>
        </div>
        <CategoryTable
          trigger={trigger}
          setTrigger={setTrigger}
          setVisible={setVisible}
          isModalAddVisible={isModalAddVisible}
          setIsModalAddVisible={setIsModalAddVisible}
        />
      </div>
    </div>
  );
}
