import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Form, Input, Button, message, Spin } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import DocumentTitle from "react-document-title";

import "./index.scss";
import { getToken } from "../../api/auth";

const Login = () => {
  let history = useHistory();

  useEffect(() => {
    const token = localStorage.getItem("Bearer");

    if (token) {
      history.replace("/products");
    }
  });

  const [loading, setLoading] = useState(false);

  const handleLogin = async (email, password) => {
    setLoading(true);

    const response = await getToken({ email, password });

    if (response) {
      localStorage.setItem("Bearer", `Bearer ${response.token}`);
      //history.push("/products");
    } else {
      message.error("Sai tài khoản hoặc mật khẩu");
    }

    setLoading(false);
  };

  const handleSubmit = (values) => {
    const { email, password } = values;

    handleLogin(email, password);
  };

  return (
    <DocumentTitle title={"Đăng nhập"}>
      <div className='login-container'>
        <Form
          onFinish={handleSubmit}
          className='content'
          // layout="vertical"
          layout='inline'
          name='normal_login'
          initialValues={{
            modifier: "public",
          }}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div className='title'>
            <h2>Đăng nhập</h2>
          </div>
          <Spin spinning={loading} tip='Loading...'>
            <Form.Item
              name='email'
              style={{ margin: "15px" }}
              rules={[
                {
                  required: true,
                  message: "The input is not valid E-mail!",
                },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder='Email'
                // type="email"
              />
            </Form.Item>
            <Form.Item name='password' style={{ margin: "15px" }}>
              <Input.Password
                prefix={<LockOutlined />}
                type='password'
                placeholder='Password'
              />
            </Form.Item>
            <Form.Item style={{ margin: "20px" }}>
              <Button
                type='primary'
                htmlType='submit'
                className='login-form-button'
              >
                Login
              </Button>
            </Form.Item>
          </Spin>
        </Form>
      </div>
    </DocumentTitle>
  );
};
export default Login;
