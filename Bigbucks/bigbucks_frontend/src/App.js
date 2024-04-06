import { Layout, Dropdown, Menu, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import React from "react";
import LoginPage from "./components/LoginPage";
import UserMenuItems from "./components/UserMenuItems";
import Trade from "./components/UserMenu/Trade"

const { Header, Content } = Layout;

class App extends React.Component{
  state = {
    authed: false,
    asAdmin: false,
    selectedMenu: 'portfolio', // 默认选中的菜单项
  };

  componentDidMount() {
    const authToken = localStorage.getItem("authToken");
    const asAdmin = localStorage.getItem("asAdmin") === "true";
    this.setState({
      authed: authToken != null,
      asAdmin,
    });
  }

  handleLoginSuccess = (token, asAdmin) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("asAdmin", asAdmin);
    this.setState({
      authed: true,
      asAdmin,
    });
  };

  handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("asAdmin");
    this.setState({
      authed: false,
    });
  };

  renderContent = () => {
    if(!this.state.authed) {
      return <LoginPage handleLoginSuccess={this.handleLoginSuccess} />;
    }

    if(this.state.asAdmin) {
      return <div>Admin home page</div>;
    }

    switch(this.state.selectedMenu) {
      case 'portfolio': return <div>My portfolio</div>;
      case 'trade': return <Trade />;
      case 'historicalData': return <div>historicalData</div>;
      case 'myAccount': return <div>My Account</div>;
      default: return <div>My portfolio</div>; // 这里可以根据需要进行调整
    }
  };

  userMenu = (
    <Menu>
      <Menu.Item key="logout" onClick={this.handleLogout}>
        Log Out
      </Menu.Item>
    </Menu>
  );

  render() {
    return (
      <Layout style={{ height: "100vh" }}>
        <Header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: "white", marginRight: 20 }}>
              BigBucks
            </div>
            {this.state.authed && !this.state.asAdmin && (
              <UserMenuItems onSelectMenuItem={({ key }) => this.setState({ selectedMenu: key })} />
            )}
          </div>
          {this.state.authed && (
            <div>
              <Dropdown overlay={this.userMenu} trigger={['click']}>
                <Button icon={<UserOutlined />} shape="circle" />
              </Dropdown>
            </div>
          )}
        </Header>
        <Content style={{ height: "calc(100% - 64px)", margin: 20, overflow: "auto" }}>
          {this.renderContent()}
        </Content>
      </Layout>
    );
  }
}

export default App;
