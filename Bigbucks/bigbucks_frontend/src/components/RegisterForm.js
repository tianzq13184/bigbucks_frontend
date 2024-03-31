import React from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';

const RegisterForm = ({ onRegister }) => {
  const onFinish = async(values) => {
    onRegister(values);
  };

  return (
    <Form onFinish={onFinish}>
      <Form.Item
        name="username"
        rules={[{ required: true, message: 'Please input your Username!' }]}
      >
        <Input prefix={<UserOutlined />} placeholder="Username" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: 'Please input your Password!' }]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="Password" />
      </Form.Item>
      <Form.Item
        name="email"
        rules={[{ type: 'email', message: 'The input is not valid E-mail!' }]}
      >
        <Input prefix={<MailOutlined />} placeholder="Email" />
      </Form.Item>
      <Form.Item name="firstname">
        <Input placeholder="First Name" />
      </Form.Item>
      <Form.Item name="lastname">
        <Input placeholder="Last Name" />
      </Form.Item>
      <Form.Item name="phonenum">
        <Input prefix={<PhoneOutlined />} placeholder="Phone Number" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Register
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RegisterForm;
