import { Layout } from "antd";

import Content from "./Content";
import Header from "./Header";
import Sider from "./Sider";

const Main = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider />
      <Layout>
        <Header />
        <Content />
      </Layout>
    </Layout>
  );
};
export default Main;
