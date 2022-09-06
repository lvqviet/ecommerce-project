import React from "react";
import { Button, Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

export default function HeaderDetails(props) {
  const { namePage, setVisible, onDelete } = props;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>{namePage}</h1>
        <div
          style={{
            width: "15em",
            justifyContent: "space-between",
            display: "flex",
          }}
        >
          {onDelete && (
            <Popconfirm
              title='Xoá sản phẩm này?'
              onConfirm={() => onDelete()}
              okText='OK'
              cancelText='Huỷ'
              placement='left'
            >
              <Button key='3' type='primary' danger>
                <DeleteOutlined className='antd-icon' />
              </Button>
            </Popconfirm>
          )}
          {setVisible && (
            <Button
              type='primary'
              onClick={() => {
                setVisible(true);
              }}
            >
              Chỉnh Sửa
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
