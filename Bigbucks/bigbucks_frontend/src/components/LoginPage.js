import React from "react";
import {Form, Button, Input, Space, Checkbox, message} from "antd";
import { UserOutlined } from "@ant-design/icons"
import { login, register} from "../utils";
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

class LoginPage extends React.Component {
    formRef = React.createRef();
    state = {
        asHost: false,
        loading: false,
        isRegister: false,
    };

    onFinish = () => {
        console.log("finish form");
    };

    handleLogin = async(values) => {
        this.setState({ loading: true });
    
        try {
            const { asHost } = this.state;
            const resp = await login(values, asHost); // 使用传入的values参数
            this.props.handleLoginSuccess(resp.token, asHost);
        } catch(error) {
            message.error(error.message);
        } finally {
            this.setState({ loading: false });
        }
    };
    
    handleRegister = async(values) => {
        this.setState({ loading: true });
    
        try {
            await register(values, this.state.asHost); // 使用传入的values参数
            message.success("Register Successfully");
        } catch (error) {
            message.error(error.message);
        } finally {
            this.setState({ loading: false });
        }
    };    

    handleCheckboxOnChange = (e) => {
        this.setState({
            asHost: e.target.checked,
        });
    };

    toggleForm = () => {
        this.setState((prevState) => ({
            isRegister: !prevState.isRegister
        }));
    };

    render() {
        return (
            <div style={{ width: 500, margin: "20px auto " }}>
                {this.state.isRegister ? (
                    <RegisterForm onRegister={this.handleRegister} />
                ) : (
                    <LoginForm onLogin={this.handleLogin} />
                )}
                <div style={{ marginTop: 16 }}>
                    <Button type="link" onClick={this.toggleForm}>
                        {this.state.isRegister ? "Already have an account? Sign in" : "Don't have an account? Register"}
                    </Button>
                </div>
            </div>
        );
    }
}

export default LoginPage;