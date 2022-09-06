import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useState } from "react";
import UserForm from "../../components/Users/UserForm";
import UserTable from "./UserTable";

export default function Vouchers() {
  const [visible, setVisible] = useState(false);
  const [trigger, setTrigger] = useState(false);
  const [loading, setLoading] = useState(false);
  const [idSelected, setIdSelected] = useState();

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
          <h1>Khách hàng</h1>
        </div>
        <UserTable
          trigger={trigger}
          setTrigger={setTrigger}
          setVisible={setVisible}
          setIdSelected={setIdSelected}
        />
        <UserForm
          visible={visible}
          setVisible={setVisible}
          trigger={trigger}
          setTrigger={setTrigger}
          id={idSelected}
        />
      </div>
    </div>
  );
}
