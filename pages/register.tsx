import React from 'react';
import Link from 'next/link';
import { withRouter } from 'next/router'
import { Form, Modal, Input, Button, Mentions, message, Popover } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { useSelector, useDispatch, connect } from 'react-redux';
import { createFromIconfontCN } from '@ant-design/icons';
import AvatarEditor from 'react-avatar-editor';

import * as constant from '../constant/constant';
import Layout from '../components/layout';
import { initializeStore } from '../store';
import request from '../utils/http';
import ImageCode from '../components/ImageCode';

const IconFont = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_1301029_p8kma5yetg.js',
});

interface State {
    userAvata: string,
    copper: boolean,
    loadding: boolean,
    uploadLoading: boolean,
    image: any,
    imgInfo: object
}

class Register extends React.Component<any, State> {
    registerFormRef = React.createRef<FormInstance>();
    private inputValue = React.createRef<HTMLInputElement>();
    private editor: any;

    setEditorRef = (editor: any) => (this.editor = editor);

    constructor(props: any) {
        super(props);
        this.state = {
            copper: false,
            loadding: false,
            image: null,
            userAvata: '',
            uploadLoading: false,
            imgInfo: {
                bg: '',
                ani: '',
                y: 0,
                userName: ''
            }
        }

    }

    compareToFirstPassword = (rule: any, value: any) => {
        const form = this.registerFormRef.current!;
        if (!value || value.length < 6 || value.length > 16) {
            return Promise.resolve();
        }
        console.log(value, form.getFieldValue('password'));
        if (value && value !== form.getFieldValue('password')) {
            return Promise.reject('傻子吗，两次密码不一致');
        } else {
            return Promise.resolve();
        }
    }

    delImg() {
        this.setState({ userAvata: '' });
    }

    uploadChange(e: any) {
        if (this.inputValue.current) {
            let reader = new FileReader();
            if (this.inputValue.current.files) {
                this.setState({ image: this.inputValue.current.files[0], copper: true });
            }
        }
    }

    handleOk() {
        this.setState({ uploadLoading: true });
        if (this.editor) {
            const canvasScaled = this.editor.getImageScaledToCanvas().toDataURL();
            let imageURL;
            fetch(canvasScaled)
                .then(res => res.blob())
                .then(blob => {
                    const file = new File([blob], new Date().getTime() + '.png', { 'type': 'image/png' });
                    this.uploadImg(file);
                    // console.log(file);
                });
        }
    }

    handleCancel() {
        if (this.inputValue.current) {
            this.inputValue.current.value = '';
        }
        this.setState({ copper: false });
    }

    handleSubmit(e) {
        this.registerFormRef.current.validateFields().then((values) => {
            if (this.props.imageStatus.status !== 'success') {
                this.getImage(values.phone);
            } else {
                this.setState({ loadding: true });
                values.x = this.props.imageStatus.x;
                values.avatar = this.state.userAvata;
                delete values.subminPassword;
                this.setState({ loadding: true });
                request(constant.register, { method: 'POST', body: values }).then((data) => {
                    this.setState({ loadding: false });
                    this.refresh();
                    this.setImageStatus('', false, 0);
                    if (data.status === 0) {
                        message.success('注册成功!');
                        console.log(this.props);
                        this.props.router.push('/');
                    } else {
                        message.error(data.msg);
                    }
                });
            }
        }).catch((err) => {
            console.log(err);
        });;
    }

    uploadImg(file: File) {
        const formData = new FormData();
        formData.append('file', file as any);
        formData.append('id', '1000');

        fetch(constant.upload, {
            method: "POST",
            body: formData
        }).then(response => response.json())
            .then((data) => {
                if (data.status === 0) {
                    this.setState({ userAvata: data.url, uploadLoading: false, copper: false });
                    if (this.inputValue.current) {
                        this.inputValue.current.value = '';
                    }
                }
            })
            .catch((error) => {
                this.setState({ uploadLoading: false });

            });
    }

    getImage(userName) {
        this.setState({ loadding: true });
        request(constant.getLoginImage + '?userName=' + userName, { method: 'get' }).then((data) => {
            this.setState({ loadding: false });
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
        console.log(document.querySelector('.progress'));
        // const cur = document.querySelector('.progress') as HTMLElement;
        // const aniBg = document.querySelector('.aniBg') as HTMLElement;
        // const curBg = document.querySelector('.progress-bg') as HTMLElement;
        // cur.style.left = 10 + 'px';
        // aniBg.style.left = 10 + 'px';
        // curBg.style.width = 0 + 'px';
        // curBg.style.display = 'none';

        // cur.style.backgroundColor = "#ffffff";
        // cur.style.color = '#808080';
        // cur.style.borderColor = '#e1e1e1';
        // curBg.style.backgroundColor = "#e6f7ff";
        // curBg.style.borderColor = '#1890ff';
    }

    render() {
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 9 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 15 },
            },
        };
        return (
            <Layout home>
                <div className="login-content">
                    <Form {...formItemLayout} ref={this.registerFormRef} className="login-form">
                        <Form.Item name="userName" label="请输入昵称" rules={[{ required: true, message: '请输入昵称' }]} style={{ color: this.props.theme.contentTextColor }}>
                            <Input
                                prefix={<IconFont type="iconuser" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="请输入昵称"
                            />
                        </Form.Item>
                        <Form.Item name="phone" label="请输入手机号" rules={[{ required: true, message: '请输入手机号' }, { pattern: new RegExp(/^1[34578]\d{9}$/), message: '请输入正确手机号' }]} style={{ color: this.props.theme.contentTextColor }}>
                            <Input
                                prefix={<IconFont type="iconhomebeifen" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="请输入手机号"
                            />
                        </Form.Item>
                        <Form.Item name="password" label="请输入密码" rules={[{ required: true, message: '请输入密码' }, { max: 16, message: '密码最大16位' }, { min: 6, message: '密码最小6位' }]} style={{ color: this.props.theme.contentTextColor }}>
                            <Input
                                prefix={<IconFont type="iconlock1" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="请输入密码"
                                type="password"
                            />
                        </Form.Item>
                        <Form.Item name="subminPassword" label="请输入确认密码" rules={[{ required: true, message: '请输入确认密码' }, { max: 16, message: '密码最大16位' }, { min: 6, message: '密码最小6位' }, { validator: this.compareToFirstPassword }]} style={{ color: this.props.theme.contentTextColor }}>
                            <Input
                                prefix={<IconFont type="iconlock1" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="请输入确认密码"
                                type="password"
                            />
                        </Form.Item>
                        <Form.Item name="desc" label="请输入简介" rules={[]} initialValue={'剑未配妥，出门早已江湖。'} style={{ color: this.props.theme.contentTextColor }}>
                            <Mentions rows={3} placeholder="">
                            </Mentions>
                        </Form.Item>

                        <Form.Item label="上传头像" style={{ color: this.props.theme.contentTextColor }}>
                            {this.state.userAvata ?
                                <div className="user-avatar-content1">
                                    <div className="avatar-bg">
                                        <img src={this.state.userAvata} alt="" />
                                    </div>
                                    <div className="avatar-opera">
                                        <a className='list' onClick={this.delImg.bind(this)}>
                                            <IconFont type="icondel" />
                                        </a>
                                    </div>
                                </div>
                                :
                                <div className="user-avatar-content">
                                    <input className="user-avatar" ref={this.inputValue} type="file" accept="image/*" onChange={this.uploadChange.bind(this)} />
                                    <div className="avata-upload">
                                        <IconFont type="iconadd" />
                                        <div>上传头像</div>
                                    </div>
                                </div>
                            }
                        </Form.Item>
                        <Popover
                            key={20}
                            content={<ImageCode imgInfo={this.state.imgInfo} handelLogin={this.handleSubmit.bind(this)} />}
                            visible={this.props.imageStatus.show}
                        >
                            <Button loading={this.state.loadding} type="primary" onClick={(e) => this.handleSubmit(e)} className="login-form-button ml20">注册</Button>
                        </Popover>
                    </Form>

                    <Modal
                        title="裁剪图片"
                        visible={this.state.copper}
                        onOk={this.handleOk.bind(this)}
                        confirmLoading={this.state.uploadLoading}
                        onCancel={this.handleCancel.bind(this)}
                    >
                        <AvatarEditor
                            image={this.state.image}
                            ref={this.setEditorRef}
                            width={350}
                            height={350}
                            border={50}
                            color={[255, 255, 255, 0.6]} // RGBA
                            scale={1.2}
                            rotate={0}
                            borderRadius={175}
                        />
                    </Modal>
                </div>
            </Layout >
        )
    }

}

// export function getServerSideProps() {
//     const reduxStore = initializeStore();
//     const { dispatch } = reduxStore;
//     return { props: reduxStore.getState() }
// }

function mapStateToProps(state) {
    return {
        login: state.login,
        theme: state.theme,
        imageStatus: state.imageStatus
    }
}

export default connect(mapStateToProps)(withRouter(Register));
