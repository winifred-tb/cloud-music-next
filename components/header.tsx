import React from 'react';
import Link from 'next/link';
import { Layout, Popover, Dropdown, Form, message, Menu, Modal, Input } from 'antd';
import { connect } from 'react-redux';
import { createFromIconfontCN } from '@ant-design/icons';

import request from '../utils/http';
import { theme } from '../constant/theme.config';
import * as config from '../constant/constant';
import ImageCode from './ImageCode';

const IconFont = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_1301029_tsyiwc1jof.js',
});

const { Header } = Layout;

interface State {
    visible: boolean,
    loginCon: boolean,
    loginLoading: boolean,
    url: string,
    imgKey: number,
    loadding: boolean,
    isPeople: boolean
}


class HeaderMain extends React.Component<any, State> {


    constructor(props: any) {
        super(props);
        this.state = {
            visible: false,
            loginCon: false,
            loginLoading: false,
            url: 'https://bing.ioliu.cn/v1/rand?w=400&h=240',
            imgKey: 0,
            loadding: false,
            isPeople: false
        }
        this.openDraw = this.openDraw.bind(this);
    }


    getRandom() {
        var Num = "";
        for (var i = 0; i < 6; i++) {
            Num += Math.floor(Math.random() * 10);
        }
        return Num;
    }

    changeTheme(type: string) {
        this.props.dispatch({
            type: 'set_theme',
            payload: {
                theme: type,
            }
        });
    }

    getSetting() {
        const themeData = [];
        for (const key in theme) {
            themeData.push(theme[key]);
        };
        return (
            <div className="setting-content">
                {themeData.map((item, index) => {
                    return (<a key={index} className="setting-list" style={{ backgroundColor: item.headerBg }} onClick={this.changeTheme.bind(this, item.type)}>
                    </a>)
                })}
            </div>
        );
    }

    openDraw() {
        if (!this.props.login.isLogging) {
            message.error('请先登录!');
            return;
        }
        this.setState({ visible: true });
    }

    onClose() {
        this.setState({ visible: false });
    }

    openLogin() {
        this.setState({ loginCon: true });
    }

    handleOkLogin() {
        // if (!this.state.isPeople) {
        //     message.success('请滑动验证码！');
        //     return;
        // }
        const [form] = Form.useForm();
        // form.validateFields((err: any, values: any) => {
        //     this.setState({ loginLoading: true });
        //     request(config.login, { method: 'POST', body: values }).then((data) => {
        //         this.setState({ loginLoading: false });
        //         if (data.status === 0) {
        //             message.success('登录成功!');
        //             this.setState({ loginCon: false });
        //             this.onReload();
        //             // this.props.dispatch(userActions.setUser(data.user));
        //             // this.props.history.push({ pathname: '/' });
        //         } else {
        //             message.error(data.msg);
        //         }
        //     });
        // })
        form.validateFields().then((values) => {
            console.log(values);
        }).catch((err) => {
            console.log(err);
        });
    }

    handleCancelLogin() {
        this.setState({ loginCon: false });
    }

    onReload() {
        const number = this.state.imgKey + 1;
        this.setState({ imgKey: number });
    }

    handleSubmit(e: any) {
        e.preventDefault();
    }

    loginOut() {
        // this.props.dispatch(userActions.delUser());
    }

    goTo(url: string) {
        this.props.history.push({ pathname: url });
    }

    render() {
        const formItemLayout = {
            labelCol: {
                xs: { span: 8 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 8 },
                sm: { span: 12 },
            },
        };

        const menu = (
            <Menu>
                <Menu.Item key="0">
                    <Link href="/UserInfo">
                        <a>个人中心</a>
                    </Link>
                </Menu.Item>
                <Menu.Item key="1">
                    <Link href="/fileSetting">
                        <a>文档管理</a>
                    </Link>
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key="3" onClick={this.loginOut.bind(this)}>退出登录</Menu.Item>
            </Menu>
        );
        return (
            <Header className="header" style={{ backgroundColor: this.props.theme.headerBg, color: this.props.theme.headerTextColor }}>
                <div className='header-left'>
                    <a className="left-menu" style={{ color: this.props.theme.headerTextColor }} onClick={this.openDraw}>
                        <IconFont type="iconmenu" />
                    </a>
                    <a className="left-title" onClick={this.goTo.bind(this, '/')} style={{ color: this.props.theme.headerTextColor }}>
                        {this.props.login.isLogging ? this.props.login.login.desc : '剑未配妥，出门早已江湖。'}
                    </a>
                </div>
                <div className='header-right'>
                    <div className="right-opera">
                        <Popover content={this.getSetting.bind(this)} trigger="click">
                            <a className="opera-list" style={{ color: this.props.theme.headerTextColor }} title="切换主题">
                                <IconFont type="icon_skin" />
                            </a>
                        </Popover>
                    </div>
                    {this.props.login.isLogging ?
                        <Dropdown overlay={menu} trigger={['click']}>
                            <a>
                                <img src={this.props.login.login.avatar} alt="" />
                                <span style={{ color: this.props.theme.headerTextColor }}>{this.props.login.login.userName}</span>
                            </a>
                        </Dropdown>
                        :
                        <div className="right-login">
                            <a style={{ color: this.props.theme.headerTextColor }} onClick={this.openLogin.bind(this)}>登录</a>
                            <div style={{ color: this.props.theme.headerTextColor }} className="line"> | </div>
                            <Link href="/register">
                                <a style={{ color: this.props.theme.headerTextColor }}>注册</a>
                            </Link>
                        </div>
                    }
                </div>
                <Modal
                    visible={this.state.loginCon}
                    onOk={this.handleOkLogin.bind(this)}
                    confirmLoading={this.state.loginLoading}
                    onCancel={this.handleCancelLogin.bind(this)}
                >
                    <Form {...formItemLayout} onFinish={(e) => this.handleSubmit(e)} className="login-form">
                        <Form.Item label="请输入手机号" rules={[{ required: true, message: '请输入手机号' }, { pattern: new RegExp(/^1[34578]\d{9}$/), message: '请输入正确手机号' }]}>
                            <Input
                                prefix={<IconFont type="iconphone" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="请输入手机号"
                            />
                        </Form.Item>
                        <Form.Item label="请输入密码" rules={[{ required: true, message: '请输入密码' }, { max: 16, message: '密码最大16位' }, { min: 6, message: '密码最小6位' }]}>
                            <Input
                                prefix={<IconFont type="iconlock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type="password"
                                placeholder="请输入密码"
                            />
                        </Form.Item>
                    </Form>
                    <ImageCode
                        imgKey={this.state.imgKey}
                        imageUrl={this.state.url}
                        onReload={this.onReload.bind(this)}
                        onMatch={() => {
                            this.setState({ isPeople: true });
                        }}
                    />
                </Modal>
            </Header>
        )
    }
}


function mapStateToProps(state) {
    return {
        login: state.login,
        theme: state.theme
    }
}

export default connect(mapStateToProps)(HeaderMain);