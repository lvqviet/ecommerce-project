import { PlusOutlined } from "@ant-design/icons";
import { Button, Input, message, Modal } from "antd";
import { useState } from "react";
import { createCategory } from "../../api/category";
import VoucherForm from "../../components/Vouchers/VoucherForm";
import VoucherTable from "./VoucherTable";

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
          <h1>Mã giảm giá</h1>
          <Button
            type='primary'
            onClick={() => {
              setIdSelected("");
              setVisible(true);
            }}
            icon={<PlusOutlined />}
          >
            Thêm mã
          </Button>
        </div>
        <VoucherTable
          trigger={trigger}
          setTrigger={setTrigger}
          setVisible={setVisible}
          setIdSelected={setIdSelected}
        />
        <VoucherForm
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
