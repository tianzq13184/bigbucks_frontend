import { Layout, Dropdown, Menu, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import React from "react";
import LoginPage from "./components/LoginPage";

const { Header, Content } = Layout;

class App extends React.Component{
  state = {
    authed: false,
    asAdmin: false,
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

    return <div>User home page</div>
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
        <Header style={{ display: "flex", justifyContent:"space-between"}}>
          <div style={{ fontSize: 16, fontWeight: 600, color: "white"}}>
            BigBucks
          </div>
          {this.state.authed && (
            <div>
              <Dropdown trigger="click" overlay={this.userMenu}>
                <Button icon={<UserOutlined />} shape="circle" />
              </Dropdown>
            </div>
          )}
        </Header>
        <Content style={{ height: "calc(100% - 64px", margin: 20, overflow: "auto"}} >
          {this.renderContent()}
        </Content>
      </Layout>
    );
  }
}

export default App;
