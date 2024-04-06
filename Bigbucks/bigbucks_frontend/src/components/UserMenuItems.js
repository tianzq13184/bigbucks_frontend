import React from "react";
import { Menu } from "antd";

const UserMenuItems = ({ onSelectMenuItem }) => (
  <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['portfolio']}
        onClick={onSelectMenuItem}>
    <Menu.Item key="portfolio">Portfolio</Menu.Item>
    <Menu.Item key="trade">Trade</Menu.Item>
    <Menu.Item key="historicalData">Historical Data</Menu.Item>
    <Menu.Item key="myAccount">My Account</Menu.Item>
  </Menu>
);

export default UserMenuItems;
