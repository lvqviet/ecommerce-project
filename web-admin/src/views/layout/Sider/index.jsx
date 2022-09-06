import React from "react";
import { Layout } from "antd";
import Logo from "./Logo";
import Meun from "./Menu";
const { Sider } = Layout;

const LayoutSider = () => {
  return (
    <Sider style={{ zIndex: "10" }}>
      <Logo />
      <Meun />
    </Sider>
  );
};

export default LayoutSider;
