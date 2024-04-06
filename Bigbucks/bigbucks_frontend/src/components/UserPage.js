import React, { useState } from 'react';
import { Layout, Menu, Button } from 'antd';
import 'antd/dist/antd.css'; // 引入antd样式

const { Header, Content, Footer, Sider } = Layout;

function UserPage() {
    const [collapsed, setCollapsed] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState('trade'); // 默认选中Trade

    const renderContent = () => {
        switch (selectedMenu) {
        case 'trade':
            return <div>TradeComponent</div>;
        case 'analysis':
            return <div>AnalysisComponent</div>;
        case 'settings':
            return <div>SettingComponent</div>;
        default:
            return <div>TradeComponent</div>;
        }
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
            <div className="logo" />
            <Menu theme="dark" defaultSelectedKeys={['trade']} mode="inline"
                onSelect={({key}) => setSelectedMenu(key)}>
            <Menu.Item key="trade">Trade</Menu.Item>
            <Menu.Item key="analysis">Analysis</Menu.Item>
            <Menu.Item key="settings">Setting</Menu.Item>
            </Menu>
        </Sider>
        <Layout className="site-layout">
            <Header style={{ padding: 0 }} />
            <Content style={{ margin: '0 16px' }}>
            <div style={{ padding: 24, minHeight: 360 }}>
                {renderContent()}
            </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>Your Footer Here</Footer>
        </Layout>
        </Layout>
    );
}

export default UserPage;
