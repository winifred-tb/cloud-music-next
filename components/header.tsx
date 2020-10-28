import React from 'react';
import Link from 'next/link';
import { Layout, Popover, Dropdown, Form, message, Menu, Modal, Input, Button } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { connect } from 'react-redux';
import { createFromIconfontCN } from '@ant-design/icons';

import request from '../utils/http';
import { theme } from '../constant/theme.config';
import * as constant from '../constant/constant';
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
    isPeople: boolean,
    showImageCode: boolean,
    userName: string,
    imgInfo: object
}


class HeaderMain extends React.Component<any, State> {

    loginFormRef = React.createRef<FormInstance>();

    constructor(props: any) {
        super(props);
        this.state = {
            visible: false,
            loginCon: false,
            loginLoading: false,
            url: 'https://bing.ioliu.cn/v1/rand?w=400&h=240',
            imgKey: 0,
            loadding: false,
            isPeople: false,
            showImageCode: false,
            userName: '',
            imgInfo: {
                bg: '',
                ani: '',
                y: 0,
                userName: ''
            }
        }
        this.openDraw = this.openDraw.bind(this);
    }

    componentDidMount() {

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
        this.loginFormRef.current.validateFields().then((value) => {
            if (this.props.imageStatus.status !== 'success') {
                this.getImage(value.phone);
            } else {
                this.setState({ loginLoading: true });
                value.x = this.props.imageStatus.x;
                request(constant.login, { method: 'POST', body: value }).then((data) => {
                    this.setState({ loginLoading: false });
                    this.refresh();
                    this.setImageStatus('', false, 0);
                    if (data && data.status === 0) {
                        message.success('登录成功!');
                        this.setState({ loginCon: false });
                        this.props.dispatch({
                            type: 'set_user',
                            payload: {
                                user: data.data
                            }
                        });
                    } else {
                        message.error(data.msg);
                    }
                });
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    handleCancelLogin() {
        this.setState({ loginCon: false });
    }

    handleSubmit(e: any) {
        e.preventDefault();
    }

    loginOut() {
        this.props.dispatch({
            type: 'del_user'
        });
    }

    goTo(url: string) {
        this.props.history.push({ pathname: url });
    }

    getImage(userName) {
        request(constant.getLoginImage + '?userName=' + userName, { method: 'get' }).then((data) => {
            if (data.status === 0) {
                const imgInfo = data.data;
                imgInfo.userName = userName;
                this.setState({ imgInfo }, () => {
                    this.setImageStatus('', true, 0);
                });
            }
        });
    }

    setImageStatus(type, show, x) {
        this.props.dispatch({
            type: 'set_image_status',
            payload: {
                status: {
                    show: show,
                    status: type,
                    x: x
                },
            }
        });
    }

    refresh() {
        const cur = document.querySelector('.progress') as HTMLElement;
        const aniBg = document.querySelector('.aniBg') as HTMLElement;
        const curBg = document.querySelector('.progress-bg') as HTMLElement;
        cur.style.left = 10 + 'px';
        aniBg.style.left = 10 + 'px';
        curBg.style.width = 0 + 'px';
        curBg.style.display = 'none';

        cur.style.backgroundColor = "#ffffff";
        cur.style.color = '#808080';
        cur.style.borderColor = '#e1e1e1';
        curBg.style.backgroundColor = "#e6f7ff";
        curBg.style.borderColor = '#1890ff';
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
                    footer={[
                        <Button key="back" onClick={this.handleCancelLogin.bind(this)}>
                            取消
                        </Button>,
                        <Popover
                            key={20}
                            content={<ImageCode imgInfo={this.state.imgInfo} />}
                            visible={this.props.imageStatus.show}
                        >
                            <Button key="submit" type="primary" loading={this.state.loginLoading} onClick={this.handleOkLogin.bind(this)}>
                                登录
                        </Button>
                        </Popover>,
                    ]}
                >
                    <Form {...formItemLayout} className="login-form" ref={this.loginFormRef}>
                        <Form.Item name="phone" label="请输入手机号" rules={[{ required: true, message: '请输入手机号' }, { pattern: new RegExp(/^1[34578]\d{9}$/), message: '请输入正确手机号' }]}>
                            <Input
                                prefix={<IconFont type="iconphone" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="请输入手机号"
                            />
                        </Form.Item>
                        <Form.Item name="password" label="请输入密码" rules={[{ required: true, message: '请输入密码' }, { max: 16, message: '密码最大16位' }, { min: 6, message: '密码最小6位' }]}>
                            <Input
                                prefix={<IconFont type="iconlock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type="password"
                                placeholder="请输入密码"
                            />
                        </Form.Item>
                    </Form>
                    {/* <ImageCode /> */}
                </Modal>
            </Header>
        )
    }
}


function mapStateToProps(state) {
    return {
        login: state.login,
        theme: state.theme,
        imageStatus: state.imageStatus
    }
}

export default connect(mapStateToProps)(HeaderMain);